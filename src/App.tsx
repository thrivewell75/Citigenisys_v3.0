import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import {
  MapPin,
  Calculator,
  FileText,
  Settings,
  Globe,
  Download,
  Database,
  Save,
  Upload,
} from "lucide-react";
import { Switch } from "./components/ui/switch";
import { Label } from "./components/ui/label";
import {
  MapComponent,
  MapComponentRef,
  MeasurementResult,
} from "./components/MapComponent";
import { EnhancedMapWrapper } from "./components/EnhancedMapWrapper";
import { MapSidebar } from "./components/MapSidebarReorganized";
import {
  ParametersFormEnhanced,
  DevelopmentParameters,
  defaultDevelopmentParameters,
} from "./components/ParametersFormEnhanced";
import {
  CalculationEngine,
  CalculationResults,
} from "./components/CalculationEngine";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { FinancialResultsDashboard } from "./components/FinancialResultsDashboard";
import { getComprehensiveAreaDisplay } from "./utils/areaFormatting";
import {
  exportPolygon,
  validatePolygonForExport,
  PolygonData,
} from "./utils/spatialDataExport";
import { ImportedPolygon } from "./utils/spatialDataImport";
import { SpatialDataImport } from "./components/SpatialDataImport";

// Add logo import - adjust the path to match your actual logo location
import Logo from "./assets/logo.png"; // or .svg, .jpg, etc.

interface Polygon {
  id: string;
  coordinates: [number, number][];
  area: number;
}

type BaseLayerType =
  | "osm"
  | "satellite"
  | "topographic"
  | "dark";

export default function App() {
  const [selectedPolygon, setSelectedPolygon] =
    useState<Polygon | null>(null);
  const [parameters, setParameters] =
    useState<DevelopmentParameters>(defaultDevelopmentParameters);

  const [results, setResults] =
    useState<CalculationResults | null>(null);
  const [activeTab, setActiveTab] = useState("area");

  // Map-specific state for sidebar control
  const [drawingMode, setDrawingMode] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState<
    [number, number][]
  >([]);
  const [baseLayer, setBaseLayer] =
    useState<BaseLayerType>("osm");
  const [satelliteOpacity, setSatelliteOpacity] = useState([
    80,
  ]);
  const [overlayLayer, setOverlayLayer] =
    useState<BaseLayerType | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState([50]);

  // Measurement state
  const [measurementMode, setMeasurementMode] = useState<
    "distance" | "area" | null
  >(null);
  const [measurementResult, setMeasurementResult] =
    useState<MeasurementResult | null>(null);
  const [useImperialUnits, setUseImperialUnits] =
    useState(false);

  // Import dialog state
  const [showImportDialog, setShowImportDialog] =
    useState(false);

  // NEW: State for validation error (Phase 1C)
  const [validationError, setValidationError] =
    useState<string | null>(null);

  const mapRef = useRef<MapComponentRef>(null);

  // NEW: Validation helper function (Phase 1C)
  const validateEconomicParameters = (params: DevelopmentParameters): boolean => {
    // Check critical cost and revenue inputs for non-negativity
    const fieldsToCheck: (keyof DevelopmentParameters)[] = [
      'residentialConstructionCost',
      'commercialConstructionCost',
      'mixedUseConstructionCost',
      'studioSalePrice',
      'oneBedSalePrice',
      'commercialSalePricePerSqM',
      'infrastructureCostPerHectare',
      'landAcquisitionCostPerHectare',
    ];

    for (const field of fieldsToCheck) {
      const value = params[field] as number;
      if (value < 0) {
        setValidationError(`Error: Economic parameter "${field}" cannot be negative.`);
        return false;
      }
    }

    // Check percentages for non-negativity
    const percentFields: (keyof DevelopmentParameters)[] = [
      'professionalFeesPercent',
      'contingencyPercent',
      'marketingPercent',
      'landAcquisitionPercent',
    ];

    for (const field of percentFields) {
        const value = params[field] as number;
        if (value < 0) {
            setValidationError(`Error: Percentage parameter "${field}" cannot be negative.`);
            return false;
        }
    }

    setValidationError(null); // Clear any previous errors if all checks pass
    return true;
  };

  const handleCalculate = () => {
    // MODIFIED: Add validation check (Phase 1C)
    if (!selectedPolygon) {
      setValidationError("Please define or select an area of interest.");
      return;
    }

    if (!validateEconomicParameters(parameters)) {
      // Error is set inside validateEconomicParameters
      return;
    }
    
    // Original Calculation Logic (runs only if validation passes)
    const calculationResults = CalculationEngine.calculate(
      selectedPolygon.area,
      parameters,
    );
    setResults(calculationResults);
    setActiveTab("results");
  };

  const handleExportPDF = () => {
    // Mock PDF export
    alert("PDF export functionality would be implemented here");
  };

  const handleExportCSV = () => {
    if (!results) return;

    // Get comprehensive area display for all area values
    const totalAreaDisplay = getComprehensiveAreaDisplay(
      results.totalArea,
      useImperialUnits,
    );
    const residentialAreaDisplay = getComprehensiveAreaDisplay(
      results.residentialArea,
      useImperialUnits,
    );
    const commercialAreaDisplay = getComprehensiveAreaDisplay(
      results.commercialArea,
      useImperialUnits,
    );
    const mixedUseAreaDisplay = getComprehensiveAreaDisplay(
      results.mixedUseArea,
      useImperialUnits,
    );
    const institutionalAreaDisplay = getComprehensiveAreaDisplay(
      results.institutionalArea,
      useImperialUnits,
    );
    const industrialAreaDisplay = getComprehensiveAreaDisplay(
      results.industrialArea,
      useImperialUnits,
    );
    const openSpaceAreaDisplay = getComprehensiveAreaDisplay(
      results.openSpaceArea,
      useImperialUnits,
    );
    const publicRealmAreaDisplay = getComprehensiveAreaDisplay(
      results.publicRealmArea,
      useImperialUnits,
    );

    const primaryUnit = useImperialUnits ? "ft²" : "m²";
    const secondaryUnit = useImperialUnits ? "acres" : "ha";
    const tertiaryUnit = useImperialUnits ? "mi²" : "km²";
    const densityUnit = useImperialUnits ? "Acre" : "Hectare";

    const csvContent = [
      ["Metric", "Value", "Unit"],
      // Area measurements in all units
      [
        "Total Area - Primary",
        totalAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Total Area - Secondary",
        totalAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Total Area - Tertiary",
        totalAreaDisplay.tertiary.split(" ")[0],
        tertiaryUnit,
      ],
      [
        "Residential Area - Primary",
        residentialAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Residential Area - Secondary",
        residentialAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Commercial Area - Primary",
        commercialAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Commercial Area - Secondary",
        commercialAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Mixed-Use Area - Primary",
        mixedUseAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Mixed-Use Area - Secondary",
        mixedUseAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Institutional Area - Primary",
        institutionalAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Institutional Area - Secondary",
        institutionalAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Industrial Area - Primary",
        industrialAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Industrial Area - Secondary",
        industrialAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Open Space - Primary",
        openSpaceAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Open Space - Secondary",
        openSpaceAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      [
        "Public Realm - Primary",
        publicRealmAreaDisplay.primary.split(" ")[0],
        primaryUnit,
      ],
      [
        "Public Realm - Secondary",
        publicRealmAreaDisplay.secondary.split(" ")[0],
        secondaryUnit,
      ],
      // GFA Metrics
      ["Residential GFA", results.residentialGFA.toFixed(0), "m²"],
      ["Commercial GFA", results.commercialGFA.toFixed(0), "m²"],
      ["Mixed-Use GFA", results.mixedUseGFA.toFixed(0), "m²"],
      ["Institutional GFA", results.institutionalGFA.toFixed(0), "m²"],
      ["Industrial GFA", results.industrialGFA.toFixed(0), "m²"],
      ["Total GFA", results.totalGFA.toFixed(0), "m²"],
      // Plot and Block Counts
      ["Residential Plots", results.residentialPlots.toString(), "plots"],
      ["Commercial Plots", results.commercialPlots.toString(), "plots"],
      ["Mixed-Use Plots", results.mixedUsePlots.toString(), "plots"],
      ["Institutional Plots", results.institutionalPlots.toString(), "plots"],
      ["Industrial Plots", results.industrialPlots.toString(), "plots"],
      ["Total Plots", results.totalPlots.toString(), "plots"],
      ["Residential Blocks", results.residentialBlocks.toString(), "blocks"],
      ["Commercial Blocks", results.commercialBlocks.toString(), "blocks"],
      ["Mixed-Use Blocks", results.mixedUseBlocks.toString(), "blocks"],
      ["Institutional Blocks", results.institutionalBlocks.toString(), "blocks"],
      ["Industrial Blocks", results.industrialBlocks.toString(), "blocks"],
      ["Total Blocks", results.totalBlocks.toString(), "blocks"],
      // Floor Area Ratio (FAR)
      ["Residential FAR", results.residentialFAR.toFixed(2), "ratio"],
      ["Commercial FAR", results.commercialFAR.toFixed(2), "ratio"],
      ["Mixed-Use FAR", results.mixedUseFAR.toFixed(2), "ratio"],
      ["Institutional FAR", results.institutionalFAR.toFixed(2), "ratio"],
      ["Industrial FAR", results.industrialFAR.toFixed(2), "ratio"],
      // Unit counts
      ["Total Units", results.totalUnits.toString(), "units"],
      [
        "Total Population",
        results.totalPopulation.toString(),
        "people",
      ],
      [
        "Affordable Units",
        results.affordableUnits.toString(),
        "units",
      ],
      [
        "Market Rate Units",
        results.marketRateUnits.toString(),
        "units",
      ],
      [
        "Executive Units",
        results.executiveUnits.toString(),
        "units",
      ],
      ["Studio Units", results.studioUnits.toString(), "units"],
      [
        "1 Bedroom Units",
        results.oneBedUnits.toString(),
        "units",
      ],
      [
        "2 Bedroom Units",
        results.twoBedUnits.toString(),
        "units",
      ],
      [
        "3 Bedroom Units",
        results.threeBedUnits.toString(),
        "units",
      ],
      [
        "4 Bedroom Units",
        results.fourBedUnits.toString(),
        "units",
      ],
      // Density measurements
      [
        `Units per ${densityUnit}`,
        (!useImperialUnits
          ? results.unitsPerHectare
          : results.unitsPerHectare * 2.47105
        ).toFixed(1),
        `units/${secondaryUnit}`,
      ],
      [
        `People per ${densityUnit}`,
        (!useImperialUnits
          ? results.peoplePerHectare
          : results.peoplePerHectare * 2.47105
        ).toFixed(1),
        `people/${secondaryUnit}`,
      ],
      [
        "Total Parking Spaces",
        results.totalParkingSpaces.toString(),
        "spaces",
      ],
      // PHASE 1A: ECONOMIC METRICS
      ["Total Construction Cost", results.totalConstructionCost.toFixed(0), "AED"],
      ["Total Development Cost", results.totalDevelopmentCost.toFixed(0), "AED"],
      ["Total Revenue", results.totalRevenue.toFixed(0), "AED"],
      ["Net Profit", results.netProfit.toFixed(0), "AED"],
      ["Profit Margin", results.profitMargin.toFixed(2), "%"],
      ["Return on Investment", results.returnOnInvestment.toFixed(2), "%"],
      ["Break-even Years", results.breakEvenYears.toFixed(1), "years"],
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "udat_assessment_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle polygon export
  const handleExportPolygonSpatial = (
    format: "geojson" | "kml" | "shp",
  ) => {
    if (!selectedPolygon) return;

    // Create polygon data for export
    const polygonData: PolygonData = {
      id: selectedPolygon.id,
      coordinates: selectedPolygon.coordinates,
      area: selectedPolygon.area,
      name: `Development Area ${selectedPolygon.id}`,
      description: `Area of Interest defined for urban development assessment. Total area: ${selectedPolygon.area.toFixed(2)} square meters.`,
    };

    // Validate before export
    const validation = validatePolygonForExport(polygonData);
    if (!validation.isValid) {
      alert(
        `Export validation failed:\n${validation.errors.join("\n")}`,
      );
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      const proceed = confirm(
        `Export warnings:\n${validation.warnings.join("\n")}\n\nDo you want to continue?`,
      );
      if (!proceed) return;
    }

    try {
      exportPolygon(polygonData, format);
    } catch (error) {
      alert(
        `Export failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  const canCalculate = selectedPolygon !== null;

  // Sidebar event handlers
  const handleStartDrawing = () => {
    // Clear any existing measurement mode
    if (measurementMode) {
      setMeasurementMode(null);
      setMeasurementResult(null);
      mapRef.current?.clearMeasurements();
    }

    setDrawingMode(true);
    setCurrentPolygon([]);
    mapRef.current?.clearMap();
  };

  const handleFinishDrawing = () => {
    mapRef.current?.finishDrawing();
  };

  const handleClearMap = () => {
    mapRef.current?.clearMap();
  };

  // Measurement event handlers
  const handleStartMeasurement = (
    mode: "distance" | "area",
  ) => {
    // Clear any existing drawing mode
    if (drawingMode) {
      setDrawingMode(false);
    }

    // Clear previous measurements
    mapRef.current?.clearMeasurements();

    setMeasurementMode(mode);
    setMeasurementResult(null);
  };

  const handleClearMeasurements = () => {
    mapRef.current?.clearMeasurements();
  };

  // Enhanced measurement handlers
  const handleMeasurementResult = (
    result: MeasurementResult | null,
  ) => {
    setMeasurementResult(result);
  };

  const handleToggleUnits = (useImperial: boolean) => {
    setUseImperialUnits(useImperial);
  };

  // Handle imported polygons
  const handleImportPolygons = (
    polygons: ImportedPolygon[],
  ) => {
    if (polygons.length > 0) {
      // For now, use the first imported polygon as the selected polygon
      const firstPolygon = polygons[0];
      const convertedPolygon: Polygon = {
        id: firstPolygon.id,
        coordinates: firstPolygon.coordinates,
        area: firstPolygon.area,
      };

      setSelectedPolygon(convertedPolygon);
      setShowImportDialog(false);

      // Switch to area tab to show the imported polygon
      setActiveTab("area");

      // Show success message
      alert(
        `Successfully imported ${polygons.length} polygon${polygons.length > 1 ? "s" : ""}. ${polygons.length > 1 ? "Using the first one as active area." : ""}`,
      );

      // TODO: In the future, this could support multiple polygons
      // and allow users to switch between them
    }
  };

  // Handle opening import dialog
  const handleOpenImportDialog = () => {
    setShowImportDialog(true);
  };

  // Handle zoom to area
  const handleZoomToArea = () => {
    if (selectedPolygon && mapRef.current) {
      mapRef.current.zoomToPolygon(selectedPolygon);
    }
  };

  // Handle clear imported file
  const handleClearImportedFile = () => {
    if (
      selectedPolygon &&
      selectedPolygon.id.startsWith("imported-")
    ) {
      const confirmClear = confirm(
        "Are you sure you want to clear the imported area? This action cannot be undone.",
      );
      if (confirmClear) {
        setSelectedPolygon(null);
        mapRef.current?.clearMap();

        // Show success message
        alert("Imported area has been cleared successfully.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-14">
      {" "}
      {/* Added top padding for fixed header, bottom padding for fixed footer */}
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 border-b bg-card/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* MODIFIED: Added logo to header */}
            <div className="flex items-center gap-3">
              <img 
                src={Logo} 
                alt="Genisys Citylabs Logo" 
                className="h-10 w-10" // Adjust size as needed
              />
              <div>
                <h1 className="text-2xl font-semibold">
                  Citigenisys 
                </h1>
                <p className="text-muted-foreground">
                   Urbanlabs Platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-muted/50">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Switch
                  checked={useImperialUnits}
                  onCheckedChange={setUseImperialUnits}
                />
                <span className="text-sm font-medium">
                  {useImperialUnits ? "Imperial" : "Metric"}
                </span>
              </div>
              <Badge variant="outline">v2.0 Phase 1</Badge> {/* MODIFIED: Version Update */}
              <Badge variant="secondary">
                {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-4">
        {" "}
        {/* Padding handled by main container */}
        {/* Navigation */}
        <div className="mb-4">
          <div className="grid w-full grid-cols-4 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setActiveTab("area")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                activeTab === "area"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MapPin className="w-4 h-4" />
              Area Definition
            </button>
            <button
              onClick={() => setActiveTab("parameters")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                activeTab === "parameters"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              Parameters
            </button>
            <button
              onClick={() => setActiveTab("calculate")}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                activeTab === "calculate"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Calculator className="w-4 h-4" />
              Calculate
            </button>
            <button
              onClick={() => setActiveTab("results")}
              disabled={!results}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                activeTab === "results"
                  ? "bg-background text-foreground shadow-sm"
                  : results
                    ? "text-muted-foreground hover:text-foreground"
                    : "text-muted-foreground/50 cursor-not-allowed"
              }`}
            >
              <FileText className="w-4 h-4" />
              Results
            </button>
          </div>
        </div>
        {/* Persistent Map Container - Always mounted */}
        <div
          className={`${activeTab !== "area" ? "hidden" : ""}`}
        >
          {/* Action Button - Above map */}
          {selectedPolygon && (
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => setActiveTab("parameters")}
              >
                Next: Configure Parameters
              </Button>
            </div>
          )}

          {/* Map Container */}
          <div className="flex gap-6" style={{ height: 'calc(100vh - 280px)' }}>
            {/* Sidebar - Full height */}
            <div className="h-full">
              <MapSidebar
                drawingMode={drawingMode}
                currentPolygonPoints={currentPolygon.length}
                selectedPolygon={selectedPolygon}
                onStartDrawing={handleStartDrawing}
                onFinishDrawing={handleFinishDrawing}
                onClearMap={handleClearMap}
                onOpenImportDialog={handleOpenImportDialog}
                onZoomToArea={handleZoomToArea}
                onClearImportedFile={handleClearImportedFile}
                measurementMode={measurementMode}
                measurementResult={measurementResult}
                useImperialUnits={useImperialUnits}
                onStartMeasurement={handleStartMeasurement}
                onClearMeasurements={handleClearMeasurements}
                onToggleUnits={handleToggleUnits}
                baseLayer={baseLayer}
                satelliteOpacity={satelliteOpacity}
                overlayLayer={overlayLayer}
                overlayOpacity={overlayOpacity}
                onLayerChange={setBaseLayer}
                onOpacityChange={setSatelliteOpacity}
                onOverlayLayerChange={setOverlayLayer}
                onOverlayOpacityChange={setOverlayOpacity}
              />
            </div>
            {/* Map - Full height */}
            <div className="flex-1 h-full relative">
              <EnhancedMapWrapper
                ref={mapRef}
                onPolygonChange={setSelectedPolygon}
                selectedPolygon={selectedPolygon}
                drawingMode={drawingMode}
                currentPolygon={currentPolygon}
                setCurrentPolygon={setCurrentPolygon}
                baseLayer={baseLayer}
                satelliteOpacity={satelliteOpacity}
                overlayLayer={overlayLayer}
                overlayOpacity={overlayOpacity}
                onDrawingModeChange={setDrawingMode}
                measurementMode={measurementMode}
                onMeasurementModeChange={setMeasurementMode}
                onMeasurementResult={handleMeasurementResult}
                useImperialUnits={useImperialUnits}
              />
            </div>
          </div>
        </div>
        {/* Tab Content Areas */}
        <div className="space-y-6 mb-4">
          {" "}
          {/* Optimized bottom margin for footer spacing */}
          {/* Parameters Tab */}
          {activeTab === "parameters" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Step 2: Configure Development Parameters
                </CardTitle>
                <p className="text-muted-foreground">
                  Adjust the development parameters below.
                  Default values are based on industry standards
                  for UAE developments.
                </p>
              </CardHeader>
              <CardContent>
                <ParametersFormEnhanced
                  parameters={parameters}
                  onParametersChange={setParameters}
                />

                <div className="mt-6 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("area")}
                  >
                    Back: Area Definition
                  </Button>
                  <Button
                    onClick={() => setActiveTab("calculate")}
                    disabled={!selectedPolygon}
                  >
                    Next: Calculate Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Calculate Tab */}
          {activeTab === "calculate" && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Step 3: Generate Assessment
                </CardTitle>
                <p className="text-muted-foreground">
                  Review your configuration and generate the
                  comprehensive development assessment.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* NEW: Validation Error Display */}
                {validationError && (
                  <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                      🛑 Calculation Error:
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {validationError}
                    </p>
                  </div>
                )}
                
                {/* Configuration Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4>Area Summary</h4>
                    {selectedPolygon ? (
                      <div className="space-y-3">
                        {(() => {
                          const areaDisplay =
                            getComprehensiveAreaDisplay(
                              selectedPolygon.area,
                              useImperialUnits,
                            );
                          return (
                            <div className="space-y-2">
                              <div>
                                <div className="text-sm font-medium mb-2">
                                  Total Area
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      {useImperialUnits
                                        ? "Square Feet:"
                                        : "Square Meters:"}
                                    </span>
                                    <span className="font-medium">
                                      {areaDisplay.primary}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      {useImperialUnits
                                        ? "Acres:"
                                        : "Hectares:"}
                                    </span>
                                    <span className="font-medium text-primary">
                                      {areaDisplay.secondary}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                      {useImperialUnits
                                        ? "Square Miles:"
                                        : "Square Kilometers:"}
                                    </span>
                                    <span className="font-medium">
                                      {areaDisplay.tertiary}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Polygon Points:
                            </span>
                            <span className="font-medium">
                              {
                                selectedPolygon.coordinates
                                  .length
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No area defined
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4>Development Configuration</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <Badge>
                          {parameters.developmentType}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Density:</span>
                        <Badge variant="outline">
                          {parameters.densityLevel}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Budget Class:</span>
                        <Badge variant="secondary">
                          {parameters.budgetClassification}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Import Alternative for Calculate Tab */}
                {!selectedPolygon && (
                  <div className="text-center p-6 border-2 border-dashed border-muted rounded-lg">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h4 className="font-medium mb-2">
                      No Area Defined
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      You can draw an area on the map or import
                      spatial data to get started.
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("area")}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Go to Map
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleOpenImportDialog}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Area
                      </Button>
                    </div>
                  </div>
                )}

                {/* Calculate Button */}
                {selectedPolygon && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleCalculate}
                      // MODIFIED: Disable button if validation fails
                      disabled={!canCalculate || validationError !== null}
                      size="lg"
                      className="px-8"
                    >
                      <Calculator className="w-5 h-5 mr-2" />
                      Generate Assessment Report
                    </Button>
                  </div>
                )}

                {/* MODIFIED: Check for validationError before showing generic message */}
                {!canCalculate && validationError === null && ( 
                  <p className="text-center text-muted-foreground text-sm">
                    Please define an area of interest to enable
                    calculations
                  </p>
                )}

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("parameters")}
                  >
                    Back: Parameters
                  </Button>
                  {results && (
                    <Button
                      onClick={() => setActiveTab("results")}
                    >
                      View Results
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Results Tab */}
{activeTab === "results" && results && (
  <>
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">
          Development Assessment Report
        </h2>
        <p className="text-muted-foreground">
          Generated on {new Date().toLocaleString()} | Area:{" "}
          {(() => {
            const areaDisplay = getComprehensiveAreaDisplay(
              results.totalArea,
              useImperialUnits,
            );
            return areaDisplay.compact;
          })()}
        </p>
      </div>
      <Button
        variant="outline"
        onClick={() => setActiveTab("calculate")}
      >
        Recalculate
      </Button>
    </div>

    {/* Tabbed Dashboard Interface */}
    <Tabs defaultValue="urban" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="urban" className="flex items-center gap-2">
          🏙️ Urban Planning
        </TabsTrigger>
        <TabsTrigger value="financial" className="flex items-center gap-2">
          💰 Financial Analysis
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="urban">
        <ResultsDashboard
          results={results}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
          useImperialUnits={useImperialUnits}
        />
      </TabsContent>
      
      <TabsContent value="financial">
        <FinancialResultsDashboard
          results={results}
          onExportPDF={handleExportPDF}
          onExportCSV={handleExportCSV}
        />
      </TabsContent>
    </Tabs>
  </>
)}
        </div>
      </main>
      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm z-35">
        <div className="container mx-auto px-4 py-2">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            {/* MODIFIED: Added logo to footer */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <img 
                src={Logo} 
                alt="Genisys Citylabs Logo" 
                className="h-4 w-4" // Smaller for footer
              />
              © 2025 Citigenisys v2.0 Phase 1d
            </div>
            <div className="text-xs text-muted-foreground text-center sm:text-right">
              Professional Disclaimer: This tool provides
              estimates for planning purposes only.
              <span className="hidden sm:inline">
                <br />
              </span>
              <span className="sm:hidden"> </span>
              Actual development parameters may vary based on
              local regulations and site conditions.
            </div>
          </div>
        </div>
      </footer>
      {/* Import Dialog - Rendered at app level for proper z-index stacking */}
      {showImportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <SpatialDataImport
              onImportComplete={handleImportPolygons}
              onClose={() => setShowImportDialog(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}