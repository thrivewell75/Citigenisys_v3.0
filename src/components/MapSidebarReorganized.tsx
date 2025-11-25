import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { QuickActions } from './QuickActions';
import { exportPolygon, validatePolygonForExport, PolygonData } from '../utils/spatialDataExport';
import { 
  Map, 
  Satellite, 
  Mountain, 
  Moon, 
  Layers,
  Edit3,
  Square,
  Trash2,
  StickyNote,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Mouse,
  Hand,
  Ruler,
  Calculator,
  X,
  MoveHorizontal,
  Zap,
  Globe,
  Download,
  Save,
  Database,
  Upload,
  FolderOpen,
  FileText
} from 'lucide-react';

interface Polygon {
  id: string;
  coordinates: [number, number][];
  area: number;
}

interface MeasurementResult {
  type: 'distance' | 'area';
  value: number; // in meters for distance, square meters for area
  unit: string; // primary unit label
  coordinates: [number, number][];
  // Additional computed values for enhanced display
  alternativeUnits?: {
    squareMeters?: number;
    squareKilometers?: number;
    hectares?: number;
    meters?: number;
    kilometers?: number;
  };
}

type BaseLayerType = 'osm' | 'satellite' | 'topographic' | 'dark';

interface MapSidebarProps {
  // Drawing controls
  drawingMode: boolean;
  currentPolygonPoints: number;
  selectedPolygon: Polygon | null;
  onStartDrawing: () => void;
  onFinishDrawing: () => void;
  onClearMap: () => void;
  onOpenImportDialog?: () => void;
  onZoomToArea?: () => void;
  onClearImportedFile?: () => void;
  
  // Measurement controls
  measurementMode: 'distance' | 'area' | null;
  measurementResult: MeasurementResult | null;
  useImperialUnits: boolean;
  onStartMeasurement: (mode: 'distance' | 'area') => void;
  onClearMeasurements: () => void;
  onToggleUnits: (useImperial: boolean) => void;
  
  // Layer controls
  baseLayer: BaseLayerType;
  satelliteOpacity: number[];
  overlayLayer: BaseLayerType | null;
  overlayOpacity: number[];
  onLayerChange: (layer: BaseLayerType) => void;
  onOpacityChange: (opacity: number[]) => void;
  onOverlayLayerChange: (layer: BaseLayerType | null) => void;
  onOverlayOpacityChange: (opacity: number[]) => void;
}

export const MapSidebar: React.FC<MapSidebarProps> = ({
  drawingMode,
  currentPolygonPoints,
  selectedPolygon,
  onStartDrawing,
  onFinishDrawing,
  onClearMap,
  onOpenImportDialog,
  onZoomToArea,
  onClearImportedFile,
  measurementMode,
  measurementResult,
  useImperialUnits,
  onStartMeasurement,
  onClearMeasurements,
  onToggleUnits,
  baseLayer,
  satelliteOpacity,
  overlayLayer,
  overlayOpacity,
  onLayerChange,
  onOpacityChange,
  onOverlayLayerChange,
  onOverlayOpacityChange
}) => {
  const [notes, setNotes] = useState('');
  const [drawingToolsOpen, setDrawingToolsOpen] = useState(true);
  const [areaInfoOpen, setAreaInfoOpen] = useState(true);
  const [measurementToolsOpen, setMeasurementToolsOpen] = useState(true);
  const [layerControlsOpen, setLayerControlsOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const getLayerIcon = (layerType: BaseLayerType) => {
    switch (layerType) {
      case 'osm': return <Map className="w-4 h-4" />;
      case 'satellite': return <Satellite className="w-4 h-4" />;
      case 'topographic': return <Mountain className="w-4 h-4" />;
      case 'dark': return <Moon className="w-4 h-4" />;
      default: return <Map className="w-4 h-4" />;
    }
  };

  const getLayerName = (layerType: BaseLayerType) => {
    switch (layerType) {
      case 'osm': return 'Street Map';
      case 'satellite': return 'Satellite';
      case 'topographic': return 'Topographic';
      case 'dark': return 'Dark Mode';
      default: return 'Street Map';
    }
  };

  // Calculate additional area metrics
  const calculateAreaMetrics = (polygon: Polygon) => {
    const areaHectares = polygon.area / 10000;
    const areaAcres = polygon.area * 0.000247105; // Convert m² to acres
    const areaKm2 = polygon.area / 1000000; // Convert m² to km²
    
    // Calculate perimeter (approximate)
    let perimeter = 0;
    for (let i = 0; i < polygon.coordinates.length; i++) {
      const current = polygon.coordinates[i];
      const next = polygon.coordinates[(i + 1) % polygon.coordinates.length];
      
      // Haversine formula for distance between two lat/lng points
      const R = 6371000; // Earth's radius in meters
      const lat1 = current[0] * Math.PI / 180;
      const lat2 = next[0] * Math.PI / 180;
      const deltaLat = (next[0] - current[0]) * Math.PI / 180;
      const deltaLng = (next[1] - current[1]) * Math.PI / 180;
      
      const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
               Math.cos(lat1) * Math.cos(lat2) *
               Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      perimeter += distance;
    }
    
    return {
      areaHectares,
      areaAcres,
      areaKm2,
      perimeter
    };
  };

  // Get available overlay layers (exclude current base layer)
  const getAvailableOverlayLayers = (): BaseLayerType[] => {
    const allLayers: BaseLayerType[] = ['osm', 'satellite', 'topographic', 'dark'];
    return allLayers.filter(layer => layer !== baseLayer);
  };

  // Format measurement result for display - enhanced with multiple units
  const formatMeasurementValue = (result: MeasurementResult) => {
    if (result.type === 'distance') {
      const valueInM = result.value;
      if (useImperialUnits) {
        const feet = valueInM * 3.28084;
        const yards = feet / 3;
        const miles = valueInM / 1609.34;
        
        if (miles >= 1) {
          return `${miles.toFixed(2)} mi`;
        } else if (yards >= 100) {
          return `${yards.toFixed(0)} yd`;
        } else {
          return `${feet.toFixed(1)} ft`;
        }
      } else {
        if (valueInM >= 1000) {
          return `${(valueInM / 1000).toFixed(2)} km`;
        }
        return `${valueInM.toFixed(1)} m`;
      }
    } else if (result.type === 'area') {
      const valueInM2 = result.value;
      if (useImperialUnits) {
        const squareFeet = valueInM2 * 10.7639;
        const acres = valueInM2 * 0.000247105;
        const squareMiles = valueInM2 / 2589988.11;
        
        if (squareMiles >= 1) {
          return `${squareMiles.toFixed(3)} sq mi`;
        } else if (acres >= 1) {
          return `${acres.toFixed(2)} ac`;
        } else {
          return `${squareFeet.toFixed(0)} sq ft`;
        }
      } else {
        const hectares = valueInM2 / 10000;
        const squareKilometers = valueInM2 / 1000000;
        
        if (squareKilometers >= 1) {
          return `${squareKilometers.toFixed(3)} km²`;
        } else if (hectares >= 1) {
          return `${hectares.toFixed(2)} ha`;
        } else {
          return `${valueInM2.toFixed(1)} m²`;
        }
      }
    }
    return '';
  };

  // Handle polygon export
  const handleExportPolygon = (format: 'geojson' | 'kml' | 'shp') => {
    if (!selectedPolygon) return;

    // Create polygon data for export
    const polygonData: PolygonData = {
      id: selectedPolygon.id,
      coordinates: selectedPolygon.coordinates,
      area: selectedPolygon.area,
      name: `Development Area ${selectedPolygon.id}`,
      description: `Area of Interest defined for urban development assessment. Total area: ${selectedPolygon.area.toFixed(2)} square meters.`
    };

    // Validate before export
    const validation = validatePolygonForExport(polygonData);
    if (!validation.isValid) {
      alert(`Export validation failed:\n${validation.errors.join('\n')}`);
      return;
    }

    // Show warnings if any
    if (validation.warnings.length > 0) {
      const proceed = confirm(`Export warnings:\n${validation.warnings.join('\n')}\n\nDo you want to continue?`);
      if (!proceed) return;
    }

    try {
      exportPolygon(polygonData, format);
    } catch (error) {
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle opening import dialog
  const handleOpenImport = () => {
    if (onOpenImportDialog) {
      onOpenImportDialog();
    }
  };

  return (
    <div className="w-80 h-full bg-sidebar border-r border-sidebar-border">
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-sidebar-foreground">Map Controls</h3>
            <p className="text-sm text-sidebar-foreground/70">
              Define your Area of Interest and configure map settings
            </p>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* Area Information - Always show */}
          <Collapsible open={areaInfoOpen} onOpenChange={setAreaInfoOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">Area Information</span>
                  {selectedPolygon && (
                    <Badge variant="secondary" className="text-xs">
                      Defined
                    </Badge>
                  )}
                </div>
                {areaInfoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {selectedPolygon ? (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 space-y-4">
                    {/* Area Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">Area Defined</span>
                      </div>
                      
                      {(() => {
                        const metrics = calculateAreaMetrics(selectedPolygon);
                        return (
                          <div className="space-y-2">
                            {/* Primary Area Display */}
                            <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <div className="text-lg font-semibold text-green-800 dark:text-green-200">
                                {useImperialUnits ? `${metrics.areaAcres.toFixed(2)} ac` : `${metrics.areaHectares.toFixed(2)} ha`}
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                Primary Area
                              </div>
                            </div>
                            
                            {/* Alternative Units */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-white dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                <div className="font-medium text-green-800 dark:text-green-200">
                                  {useImperialUnits 
                                    ? (selectedPolygon.area * 10.7639).toLocaleString(undefined, {maximumFractionDigits: 0}) + ' sq ft'
                                    : selectedPolygon.area.toLocaleString() + ' m²'
                                  }
                                </div>
                                <div className="text-green-600 dark:text-green-400">
                                  {useImperialUnits ? 'Square Feet' : 'Square Meters'}
                                </div>
                              </div>
                              <div className="text-center p-2 bg-white dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                <div className="font-medium text-green-800 dark:text-green-200">
                                  {useImperialUnits ? `${metrics.areaHectares.toFixed(2)} ha` : `${metrics.areaAcres.toFixed(2)} ac`}
                                </div>
                                <div className="text-green-600 dark:text-green-400">
                                  {useImperialUnits ? 'Hectares (metric)' : 'Acres'}
                                </div>
                              </div>
                            </div>
                            
                            {/* Additional Imperial/Metric Units */}
                            {(useImperialUnits && metrics.areaAcres >= 640) || (!useImperialUnits && metrics.areaKm2 >= 0.01) ? (
                              <div className="text-center p-2 bg-white dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                <div className="text-xs">
                                  <span className="font-medium text-green-800 dark:text-green-200">
                                    {useImperialUnits 
                                      ? `${(metrics.areaAcres / 640).toFixed(3)} sq mi`
                                      : `${metrics.areaKm2.toFixed(3)} km²`
                                    }
                                  </span>
                                  <span className="text-green-600 dark:text-green-400 ml-1">
                                    {useImperialUnits ? 'Square Miles' : 'Square Kilometers'}
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/20 border-dashed border-sidebar-border">
                  <CardContent className="p-4 text-center">
                    <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No area defined yet. Use the drawing tools to create a polygon.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Export Options - Only show when polygon exists */}
              {selectedPolygon && (
                <Collapsible open={exportOpen} onOpenChange={setExportOpen}>
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="font-medium">Export Spatial Data</span>
                      </div>
                      {exportOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pt-2">
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Database className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Spatial Formats</span>
                        </div>
                        
                        <div className="space-y-3">
                          {/* GeoJSON Export */}
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleExportPolygon('geojson')}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-950/30"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Export as GeoJSON
                            </Button>
                            <p className="text-xs text-blue-600 dark:text-blue-400 px-2">
                              Standard web mapping format. Compatible with most GIS software and web applications.
                            </p>
                          </div>

                          {/* KML Export */}
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleExportPolygon('kml')}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-950/30"
                            >
                              <Globe className="w-4 h-4 mr-2" />
                              Export as KML
                            </Button>
                            <p className="text-xs text-blue-600 dark:text-blue-400 px-2">
                              Google Earth format. Best for visualization and sharing with stakeholders.
                            </p>
                          </div>

                          {/* Shapefile Export */}
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleExportPolygon('shp')}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-950/30"
                            >
                              <Database className="w-4 h-4 mr-2" />
                              Export as Shapefile
                            </Button>
                            <p className="text-xs text-blue-600 dark:text-blue-400 px-2">
                              Traditional GIS format. Downloads multiple files for complete shapefile structure.
                            </p>
                          </div>
                        </div>

                        {/* Export Info */}
                        <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                          <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                            <div className="flex justify-between">
                              <span>Coordinate System:</span>
                              <span className="font-medium">WGS84 (EPSG:4326)</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Points:</span>
                              <span className="font-medium">{selectedPolygon.coordinates.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Area:</span>
                              <span className="font-medium">{(selectedPolygon.area / 10000).toFixed(2)} ha</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Import/Export Section */}
          <Collapsible open={importOpen} onOpenChange={setImportOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span className="font-medium">Import & Export</span>
                </div>
                {importOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <Card className="bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 space-y-4">
                  {/* Import Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Import Spatial Data</span>
                    </div>
                    
                    <Button
                      onClick={handleOpenImport}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-700 dark:hover:bg-blue-950/30"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Area from File
                    </Button>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-400 px-2">
                      Upload GeoJSON, KML, or Shapefile to define areas of interest. Supports multiple formats for professional GIS integration.
                    </p>
                  </div>

                  {/* Export Section - Only show when polygon exists */}
                  {selectedPolygon && (
                    <>
                      <Separator className="bg-slate-200 dark:bg-slate-700" />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Download className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Export Current Area</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-1">
                          <Button
                            onClick={() => handleExportPolygon('geojson')}
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 text-green-700 border-green-200 hover:bg-green-50 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-950/30"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            JSON
                          </Button>
                          <Button
                            onClick={() => handleExportPolygon('kml')}
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 text-green-700 border-green-200 hover:bg-green-50 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-950/30"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            KML
                          </Button>
                          <Button
                            onClick={() => handleExportPolygon('shp')}
                            variant="outline"
                            size="sm"
                            className="text-xs h-8 text-green-700 border-green-200 hover:bg-green-50 dark:text-green-300 dark:border-green-700 dark:hover:bg-green-950/30"
                          >
                            <Database className="w-3 h-3 mr-1" />
                            SHP
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Quick Actions for Imported Areas and Zoom */}
          <QuickActions
            selectedPolygon={selectedPolygon}
            onClearImportedFile={onClearImportedFile}
            onZoomToArea={onZoomToArea}
          />

          {/* Drawing Tools - Moved above Measurement Tools */}
          <Collapsible open={drawingToolsOpen} onOpenChange={setDrawingToolsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span className="font-medium">Drawing Tools</span>
                  {drawingMode && (
                    <Badge variant="secondary" className="text-xs animate-pulse">
                      Active
                    </Badge>
                  )}
                </div>
                {drawingToolsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={onStartDrawing}
                  variant={drawingMode ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Square className="w-4 h-4" />
                  {drawingMode ? "Drawing..." : "Draw Area"}
                </Button>
                
                <Button
                  onClick={onFinishDrawing}
                  variant="outline"
                  size="sm"
                  disabled={!drawingMode || currentPolygonPoints < 3}
                  className="flex items-center gap-2"
                >
                  <Mouse className="w-4 h-4" />
                  Finish
                </Button>
              </div>
              
              <Button
                onClick={onClearMap}
                variant="destructive"
                size="sm"
                className="w-full flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </Button>
              
              {drawingMode && (
                <Card className="bg-sidebar-accent/50 border-sidebar-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Hand className="w-4 h-4 text-blue-600" />
                      <span>Click on map to add points</span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Points: {currentPolygonPoints} | Min: 3 required
                    </div>
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Measurement Tools */}
          <Collapsible open={measurementToolsOpen} onOpenChange={setMeasurementToolsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  <span className="font-medium">Measurement Tools</span>
                </div>
                {measurementToolsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => onStartMeasurement('distance')} 
                      disabled={measurementMode === 'distance'}
                      variant={measurementMode === 'distance' ? "secondary" : "outline"}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      size="sm"
                    >
                      <MoveHorizontal className="w-4 h-4" />
                      <span className="text-xs">Distance</span>
                    </Button>
                    
                    <Button 
                      onClick={() => onStartMeasurement('area')} 
                      disabled={measurementMode === 'area'}
                      variant={measurementMode === 'area' ? "secondary" : "outline"}
                      className="flex flex-col items-center gap-1 h-auto py-3"
                      size="sm"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="text-xs">Area</span>
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={onClearMeasurements} 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/10"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Measurements
                  </Button>
                </CardContent>
              </Card>

              {/* Measurement Status */}
              {measurementMode && (
                <div className={`p-3 border rounded-lg ${
                  measurementMode === 'distance' 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                    : 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {measurementMode === 'distance' ? 
                      <MoveHorizontal className="w-4 h-4 text-red-600" /> : 
                      <Zap className="w-4 h-4 text-teal-600" />
                    }
                    <span className={`text-sm font-medium ${
                      measurementMode === 'distance' 
                        ? 'text-red-800 dark:text-red-200' 
                        : 'text-teal-800 dark:text-teal-200'
                    }`}>
                      {measurementMode === 'distance' ? 'Distance' : 'Area'} Measurement Active
                    </span>
                  </div>
                  <p className={`text-xs ${
                    measurementMode === 'distance' 
                      ? 'text-red-600 dark:text-red-300' 
                      : 'text-teal-600 dark:text-teal-300'
                  }`}>
                    {measurementMode === 'distance' 
                      ? 'Click points on the map to measure distance.' 
                      : 'Click points on the map to measure area. Need at least 3 points.'}
                  </p>
                </div>
              )}

              {/* Measurement Result */}
              {measurementResult && (
                <Card className={`${
                  measurementResult.type === 'distance' 
                    ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' 
                    : 'bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800'
                }`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {measurementResult.type === 'distance' ? 
                        <MoveHorizontal className="w-4 h-4 text-red-600" /> : 
                        <Zap className="w-4 h-4 text-teal-600" />
                      }
                      <span className={`text-sm font-medium ${
                        measurementResult.type === 'distance' 
                          ? 'text-red-800 dark:text-red-200' 
                          : 'text-teal-800 dark:text-teal-200'
                      }`}>
                        {measurementResult.type === 'distance' ? 'Distance' : 'Area'} Measurement
                      </span>
                    </div>
                    
                    <div className="text-center p-3 bg-white dark:bg-black/20 rounded-lg">
                      <div className="text-lg font-semibold">
                        {formatMeasurementValue(measurementResult)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {measurementResult.coordinates.length} point{measurementResult.coordinates.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Layer Controls */}
          <Collapsible open={layerControlsOpen} onOpenChange={setLayerControlsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span className="font-medium">Map Layers</span>
                </div>
                {layerControlsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              {/* Base Layer Selection */}
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Base Layer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {(['osm', 'satellite', 'topographic', 'dark'] as BaseLayerType[]).map((layer) => (
                      <Button
                        key={layer}
                        onClick={() => onLayerChange(layer)}
                        variant={baseLayer === layer ? "default" : "outline"}
                        size="sm"
                        className="flex flex-col items-center gap-1 h-auto py-2"
                      >
                        {getLayerIcon(layer)}
                        <span className="text-xs">{getLayerName(layer)}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Opacity Control for Base Layer */}
                  <div className="space-y-2">
                    <Label className="text-xs">Base Layer Opacity: {satelliteOpacity[0]}%</Label>
                    <Slider
                      value={satelliteOpacity}
                      onValueChange={onOpacityChange}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Overlay Layer Selection */}
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Overlay Layer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    <Button
                      onClick={() => onOverlayLayerChange(null)}
                      variant={overlayLayer === null ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      None
                    </Button>
                    
                    {getAvailableOverlayLayers().map((layer) => (
                      <Button
                        key={layer}
                        onClick={() => onOverlayLayerChange(layer)}
                        variant={overlayLayer === layer ? "default" : "outline"}
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                      >
                        {getLayerIcon(layer)}
                        <span>{getLayerName(layer)}</span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* Overlay Opacity Control */}
                  {overlayLayer && (
                    <div className="space-y-2">
                      <Label className="text-xs">Overlay Opacity: {overlayOpacity[0]}%</Label>
                      <Slider
                        value={overlayOpacity}
                        onValueChange={onOverlayOpacityChange}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Notes Section */}
          <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <StickyNote className="w-4 h-4" />
                  <span className="font-medium">Notes</span>
                </div>
                {notesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <Textarea
                placeholder="Add project notes, observations, or reminders..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] bg-sidebar-accent/50 border-sidebar-border"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Instructions */}
          <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  <span className="font-medium">Instructions</span>
                </div>
                {instructionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Drawing Areas</h5>
                    <ul className="text-xs space-y-1 text-sidebar-foreground/70">
                      <li>• Click "Draw Area" to start</li>
                      <li>• Click on map to add points</li>
                      <li>• Need minimum 3 points</li>
                      <li>• Click "Finish" to complete</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Measurements</h5>
                    <ul className="text-xs space-y-1 text-sidebar-foreground/70">
                      <li>• Choose Distance or Area mode</li>
                      <li>• Click points to measure</li>
                      <li>• All measurements are saved</li>
                      <li>• Export data as CSV/JSON</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Map Layers</h5>
                    <ul className="text-xs space-y-1 text-sidebar-foreground/70">
                      <li>• Choose different base maps</li>
                      <li>• Add overlay for comparison</li>
                      <li>• Adjust opacity as needed</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
};