import React, { useState, useRef, RefObject } from 'react';
import html2canvas from 'html2canvas'; // <--- CRITICAL FIX: Explicitly importing the library
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { FileText, Table, RotateCcw, Camera } from 'lucide-react';
import { CalculationResults } from './CalculationEngine';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// NOTE FOR THE USER:
// You must still ensure the html2canvas package is installed in your project:
// npm install html2canvas 
// OR
// yarn add html2canvas

interface ResultsDashboardProps {
  results: CalculationResults;
  onExportPDF: () => void;
  onExportCSV: () => void;
  useImperialUnits?: boolean;
  onRecalculate?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  results, 
  onExportPDF, 
  onExportCSV,
  useImperialUnits = false,
  onRecalculate
}) => {
  const [activeUnitMixTab, setActiveUnitMixTab] = useState('overall');

  // --- REFS FOR IMAGE EXPORT ---
  const headerSummaryRef = useRef<HTMLDivElement>(null);
  const landUseRef = useRef<HTMLDivElement>(null);
  const unitMixDistRef = useRef<HTMLDivElement>(null);
  const farRef = useRef<HTMLDivElement>(null);
  const unitMixSummaryRef = useRef<HTMLDivElement>(null);
  const areaBreakdownRef = useRef<HTMLDivElement>(null);
  const buildingMetricsRef = useRef<HTMLDivElement>(null);
  const infrastructureRef = useRef<HTMLDivElement>(null);
  const populationRef = useRef<HTMLDivElement>(null);
  const densityRef = useRef<HTMLDivElement>(null);
  const financialRef = useRef<HTMLDivElement>(null);

  // --- EXPORT LOGIC (FIXED TO USE IMPORTED html2canvas) ---
  const handleExportImage = async (ref: RefObject<HTMLDivElement>, fileName: string) => {
    if (ref.current) { 
      try {
        // Direct call to the imported html2canvas function
        const canvas = await html2canvas(ref.current, { 
          scale: 2, // Use a higher scale for better resolution
          logging: false,
          useCORS: true,
        });
        
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create a temporary link element for download
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${fileName.replace(/\s/g, '_')}_Dashboard.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error('Error generating image. Did you install html2canvas?', error);
        alert('Could not export image. Please check your console and ensure html2canvas is installed.');
      }
    } else {
      console.warn(`Attempted to export card, but reference for ${fileName} was null.`);
    }
  };

  // --- EXPORT BUTTON HELPER COMPONENT ---
  const ExportButton: React.FC<{ ref: RefObject<HTMLDivElement>, fileName: string }> = ({ ref, fileName }) => (
    <Button 
      onClick={() => handleExportImage(ref, fileName)} 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
    >
      <Camera className="w-4 h-4" />
    </Button>
  );

  // Prepare data for charts
  const landUseData = [
    { name: 'Residential', value: results.residentialArea, color: '#8884d8' },
    { name: 'Commercial', value: results.commercialArea, color: '#82ca9d' },
    { name: 'Mixed-Use', value: results.mixedUseArea, color: '#a78bfa' },
    { name: 'Institutional', value: results.institutionalArea, color: '#f472b6' },
    { name: 'Industrial', value: results.industrialArea, color: '#94a3b8' },
    { name: 'Open Space', value: results.openSpaceArea, color: '#ffc658' },
    { name: 'Public Realm', value: results.publicRealmArea, color: '#ff7c7c' }
  ].filter(item => item.value > 0);

  // Mixed-Use Unit Mix Data
  const mixedUseUnitData = [
    { name: 'Studio', value: results.mixedUseStudioUnits, color: '#8dd1e1' },
    { name: '1 Bedroom', value: results.mixedUseOneBedUnits, color: '#d084d0' },
    { name: '2 Bedroom', value: results.mixedUseTwoBedUnits, color: '#ffb347' },
    { name: '3 Bedroom', value: results.mixedUseThreeBedUnits, color: '#87ceeb' },
    { name: '4 Bedroom', value: results.mixedUseFourBedUnits, color: '#dda0dd' }
  ].filter(item => item.value > 0);

  // Residential Unit Mix Data
  const residentialUnitData = [
    { name: 'Studio', value: results.regularStudioUnits, color: '#8dd1e1' },
    { name: '1 Bedroom', value: results.regularOneBedUnits, color: '#d084d0' },
    { name: '2 Bedroom', value: results.regularTwoBedUnits, color: '#ffb347' },
    { name: '3 Bedroom', value: results.regularThreeBedUnits, color: '#87ceeb' },
    { name: '4 Bedroom', value: results.regularFourBedUnits, color: '#dda0dd' }
  ].filter(item => item.value > 0);

  // Combined Unit Mix Data (for the overall chart)
  const combinedUnitData = [
    { name: 'Studio', value: results.studioUnits, color: '#8dd1e1' },
    { name: '1 Bedroom', value: results.oneBedUnits, color: '#d084d0' },
    { name: '2 Bedroom', value: results.twoBedUnits, color: '#ffb347' },
    { name: '3 Bedroom', value: results.threeBedUnits, color: '#87ceeb' },
    { name: '4 Bedroom', value: results.fourBedUnits, color: '#dda0dd' }
  ];

  // Helper function to get the currently active unit mix data for the summary
  const getCurrentUnitMix = () => {
    switch (activeUnitMixTab) {
      case 'residential':
        return {
          studio: results.regularStudioUnits,
          oneBed: results.regularOneBedUnits,
          twoBed: results.regularTwoBedUnits,
          threeBed: results.regularThreeBedUnits,
          fourBed: results.regularFourBedUnits,
          total: results.regularStudioUnits + results.regularOneBedUnits + results.regularTwoBedUnits + results.regularThreeBedUnits + results.regularFourBedUnits,
        };
      case 'mixeduse':
        return {
          studio: results.mixedUseStudioUnits,
          oneBed: results.mixedUseOneBedUnits,
          twoBed: results.mixedUseTwoBedUnits,
          threeBed: results.mixedUseThreeBedUnits,
          fourBed: results.mixedUseFourBedUnits,
          total: results.mixedUseStudioUnits + results.mixedUseOneBedUnits + results.mixedUseTwoBedUnits + results.mixedUseThreeBedUnits + results.mixedUseFourBedUnits,
        };
      case 'overall':
      default:
        return {
          studio: results.studioUnits,
          oneBed: results.oneBedUnits,
          twoBed: results.twoBedUnits,
          threeBed: results.threeBedUnits,
          fourBed: results.fourBedUnits,
          total: results.totalUnits,
        };
    }
  };

  const currentMix = getCurrentUnitMix();

  const densityData = useImperialUnits ? [
    { name: 'Units/Acre', value: (results.unitsPerHectare * 2.47105).toFixed(1) },
    { name: 'People/Acre', value: (results.peoplePerHectare * 2.47105).toFixed(1) },
    { name: 'Plot Ratio', value: (results.plotRatio * 100).toFixed(1) }
  ] : [
    { name: 'Units/Hectare', value: results.unitsPerHectare.toFixed(1) },
    { name: 'People/Hectare', value: results.peoplePerHectare.toFixed(1) },
    { name: 'Plot Ratio', value: (results.plotRatio * 100).toFixed(1) }
  ];

  const formatArea = (area: number) => {
    if (useImperialUnits) {
      const acres = area * 0.000247105;
      const squareFeet = area * 10.7639;
      if (acres >= 1) {
        return `${acres.toFixed(2)} ac (${squareFeet.toLocaleString(undefined, {maximumFractionDigits: 0})} sq ft)`;
      } else {
        return `${squareFeet.toLocaleString(undefined, {maximumFractionDigits: 0})} sq ft (${acres.toFixed(4)} ac)`;
      }
    } else {
      return `${(area / 10000).toFixed(2)} ha (${area.toLocaleString()} m²)`;
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
  };

  // --- LOGIC FOR UNIT SIZE DISPLAY ---
  // Mock data for unit sizes (assuming these values would come from the results object)
  const unitSizeInfo = {
    studio: {
      overallMin: 30, overallMax: 50, residentialAvg: 40, mixedUseAvg: 45
    },
    oneBed: {
      overallMin: 60, overallMax: 85, residentialAvg: 75, mixedUseAvg: 80
    },
    twoBed: {
      overallMin: 90, overallMax: 120, residentialAvg: 105, mixedUseAvg: 110
    },
    threeBed: {
      overallMin: 140, overallMax: 180, residentialAvg: 160, mixedUseAvg: 165
    },
    fourBed: {
      overallMin: 200, overallMax: 250, residentialAvg: 220, mixedUseAvg: 230
    }
  };

  const formatUnitSize = (
    unitType: 'studio' | 'oneBed' | 'twoBed' | 'threeBed' | 'fourBed',
    activeTab: string
  ): string => {
    const data = unitSizeInfo[unitType];
    
    // Function to convert and format a single size value (m² to sq ft if needed)
    const convertAndFormat = (value: number) => {
      // Assuming size data (30, 50, etc.) is in m²
      if (useImperialUnits) {
        const sqft = value * 10.7639;
        return formatNumber(sqft);
      } else {
        return formatNumber(value);
      }
    };
    
    const unit = useImperialUnits ? 'sq ft' : 'm²';

    if (activeTab === 'overall') {
      const min = convertAndFormat(data.overallMin);
      const max = convertAndFormat(data.overallMax);
      return `${min} - ${max} ${unit}`;
    } else if (activeTab === 'residential') {
      const avg = convertAndFormat(data.residentialAvg);
      return `${avg} ${unit} (Avg)`;
    } else { // mixeduse
      const avg = convertAndFormat(data.mixedUseAvg);
      return `${avg} ${unit} (Avg)`;
    }
  };
  // ----------------------------------------

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <Card ref={headerSummaryRef as RefObject<HTMLDivElement>}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Urban Planning Assessment Results</CardTitle>
            <div className="flex gap-2">
              <ExportButton ref={headerSummaryRef} fileName="Summary_Header" />
              {onRecalculate && (
                <Button onClick={onRecalculate} variant="default" size="sm" className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Recalculate
                </Button>
              )}
              <Button onClick={onExportPDF} variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export PDF
              </Button>
              <Button onClick={onExportCSV} variant="outline" size="sm" className="flex items-center gap-2">
                <Table className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-semibold">{formatArea(results.totalArea)}</div>
              <div className="text-sm text-muted-foreground">Total Area</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{formatNumber(results.totalUnits)}</div>
              <div className="text-sm text-muted-foreground">Total Units</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{formatNumber(results.totalPopulation)}</div>
              <div className="text-sm text-muted-foreground">Total Population</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">
                {useImperialUnits 
                  ? (results.unitsPerHectare * 2.47105).toFixed(1)
                  : results.unitsPerHectare.toFixed(1)
                }
              </div>
              <div className="text-sm text-muted-foreground">
                {useImperialUnits ? 'Units/Acre' : 'Units/Hectare'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Grid container for aligned cards (auto-rows-fr ensures row-wise height alignment) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
        
        {/* ROW 1, COLUMN 1: Land Use Distribution (Chart) */}
        <Card ref={landUseRef as RefObject<HTMLDivElement>} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Land Use Distribution</CardTitle>
            <ExportButton ref={landUseRef} fileName="Land_Use_Distribution" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={landUseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {landUseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatArea(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROW 1, COLUMN 2: Unit Mix with Tabs (Chart) */}
        <Card ref={unitMixDistRef as RefObject<HTMLDivElement>} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Unit Mix Distribution</CardTitle>
            <ExportButton ref={unitMixDistRef} fileName="Unit_Mix_Distribution" />
          </CardHeader>
          <CardContent>
            <Tabs value={activeUnitMixTab} onValueChange={setActiveUnitMixTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overall">Overall</TabsTrigger>
                <TabsTrigger value="residential">Residential</TabsTrigger>
                <TabsTrigger value="mixeduse">Mixed-Use</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overall" className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={combinedUnitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {combinedUnitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total Units: {formatNumber(currentMix.total)}
                </div>
              </TabsContent>
              
              <TabsContent value="residential" className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={residentialUnitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {residentialUnitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total Residential Units: {formatNumber(currentMix.total)}
                </div>
              </TabsContent>
              
              <TabsContent value="mixeduse" className="mt-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mixedUseUnitData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {mixedUseUnitData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  Total Mixed-Use Units: {formatNumber(currentMix.total)}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>


        {/* ROW 2, COLUMN 1: Floor Area Ratio (FAR) by Land Use Type */}
        <Card ref={farRef as RefObject<HTMLDivElement>} className="h-full">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-semibold">Floor Area Ratio (FAR) by Land Use Type</CardTitle>
              <p className="text-sm text-muted-foreground">
                FAR represents the ratio of total building floor area to the land area of the plot
              </p>
            </div>
            <ExportButton ref={farRef} fileName="FAR_by_Land_Use" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {results.residentialFAR > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-semibold text-blue-600">{results.residentialFAR.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Residential FAR</div>
                </div>
              )}
              {results.commercialFAR > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-semibold text-green-600">{results.commercialFAR.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Commercial FAR</div>
                </div>
              )}
              {results.mixedUseFAR > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-semibold text-purple-600">{results.mixedUseFAR.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Mixed-Use FAR</div>
                </div>
              )}
              {results.institutionalFAR > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-semibold text-pink-600">{results.institutionalFAR.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Institutional FAR</div>
                </div>
              )}
              {results.industrialFAR > 0 && (
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-semibold text-slate-600">{results.industrialFAR.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Industrial FAR</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>


        {/* ROW 2, COLUMN 2: Unit Mix Summary Table */}
        <Card ref={unitMixSummaryRef as RefObject<HTMLDivElement>} className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Unit Mix Summary</CardTitle>
            <ExportButton ref={unitMixSummaryRef} fileName="Unit_Mix_Summary" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-semibold text-blue-600">{currentMix.studio}</div>
                <div className="text-sm text-muted-foreground">Studio Units</div>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentage(currentMix.studio, currentMix.total)}%
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {formatUnitSize('studio', activeUnitMixTab)}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-semibold text-purple-600">{currentMix.oneBed}</div>
                <div className="text-sm text-muted-foreground">1 Bedroom</div>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentage(currentMix.oneBed, currentMix.total)}%
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {formatUnitSize('oneBed', activeUnitMixTab)}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-semibold text-orange-600">{currentMix.twoBed}</div>
                <div className="text-sm text-muted-foreground">2 Bedroom</div>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentage(currentMix.twoBed, currentMix.total)}%
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {formatUnitSize('twoBed', activeUnitMixTab)}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-semibold text-cyan-600">{currentMix.threeBed}</div>
                <div className="text-sm text-muted-foreground">3 Bedroom</div>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentage(currentMix.threeBed, currentMix.total)}%
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {formatUnitSize('threeBed', activeUnitMixTab)}
                </div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-semibold text-pink-600">{currentMix.fourBed}</div>
                <div className="text-sm text-muted-foreground">4 Bedroom</div>
                <div className="text-xs text-muted-foreground">
                  {calculatePercentage(currentMix.fourBed, currentMix.total)}%
                </div>
                <div className="text-xs font-medium text-gray-500 mt-1">
                  {formatUnitSize('fourBed', activeUnitMixTab)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Breakdown */}
        <Card ref={areaBreakdownRef as RefObject<HTMLDivElement>}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Area Breakdown</CardTitle>
            <ExportButton ref={areaBreakdownRef} fileName="Area_Breakdown" />
          </CardHeader>
          <CardContent className="space-y-4">
            {results.residentialArea > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Residential</span>
                  <span>{formatArea(results.residentialArea)}</span>
                </div>
                <Progress value={(results.residentialArea / results.totalArea) * 100} />
              </div>
            )}
            
            {results.commercialArea > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Commercial</span>
                  <span>{formatArea(results.commercialArea)}</span>
                </div>
                <Progress value={(results.commercialArea / results.totalArea) * 100} />
              </div>
            )}
            
            {results.mixedUseArea > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Mixed-Use</span>
                  <span>{formatArea(results.mixedUseArea)}</span>
                </div>
                <Progress value={(results.mixedUseArea / results.totalArea) * 100} />
              </div>
            )}
            
            {results.institutionalArea > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Institutional</span>
                  <span>{formatArea(results.institutionalArea)}</span>
                </div>
                <Progress value={(results.institutionalArea / results.totalArea) * 100} />
              </div>
            )}
            
            {results.industrialArea > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Industrial</span>
                  <span>{formatArea(results.industrialArea)}</span>
                </div>
                <Progress value={(results.industrialArea / results.totalArea) * 100} />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Open Space</span>
                <span>{formatArea(results.openSpaceArea)}</span>
              </div>
              <Progress value={(results.openSpaceArea / results.totalArea) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Public Realm</span>
                <span>{formatArea(results.publicRealmArea)}</span>
              </div>
              <Progress value={(results.publicRealmArea / results.totalArea) * 100} />
            </div>
          </CardContent>
        </Card>

        {/* Building Metrics */}
        <Card ref={buildingMetricsRef as RefObject<HTMLDivElement>}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Building Metrics</CardTitle>
            <ExportButton ref={buildingMetricsRef} fileName="Building_Metrics" />
          </CardHeader>
          <CardContent className="space-y-3">
            {results.residentialGFA > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Residential GFA</span>
                  <Badge variant="secondary">{formatArea(results.residentialGFA)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Residential FAR</span>
                  <span className="font-medium">{results.residentialFAR.toFixed(2)}</span>
                </div>
              </>
            )}
            {results.commercialGFA > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Commercial GFA</span>
                  <Badge variant="secondary">{formatArea(results.commercialGFA)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commercial FAR</span>
                  <span className="font-medium">{results.commercialFAR.toFixed(2)}</span>
                </div>
              </>
            )}
            {results.mixedUseGFA > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Mixed-Use GFA</span>
                  <Badge variant="secondary">{formatArea(results.mixedUseGFA)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mixed-Use FAR</span>
                  <span className="font-medium">{results.mixedUseFAR.toFixed(2)}</span>
                </div>
              </>
            )}
            {results.institutionalGFA > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Institutional GFA</span>
                  <Badge variant="secondary">{formatArea(results.institutionalGFA)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Institutional FAR</span>
                  <span className="font-medium">{results.institutionalFAR.toFixed(2)}</span>
                </div>
              </>
            )}
            {results.industrialGFA > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Industrial GFA</span>
                  <Badge variant="secondary">{formatArea(results.industrialGFA)}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Industrial FAR</span>
                  <span className="font-medium">{results.industrialFAR.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Total GFA</span>
              <Badge variant="outline">{formatArea(results.totalGFA)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Total Plots</span>
              <Badge>{formatNumber(results.totalPlots)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Total Blocks</span>
              <Badge>{formatNumber(results.totalBlocks)}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Plot Ratio</span>
              <Badge>{(results.plotRatio * 100).toFixed(1)}%</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure */}
        <Card ref={infrastructureRef as RefObject<HTMLDivElement>}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Infrastructure</CardTitle>
            <ExportButton ref={infrastructureRef} fileName="Infrastructure" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Total Parking</span>
              <Badge variant="secondary">{formatNumber(results.totalParkingSpaces)} spaces</Badge>
            </div>
            <div className="flex justify-between">
              <span>Resident Parking</span>
              <span>{formatNumber(results.residentParking)}</span>
            </div>
            <div className="flex justify-between">
              <span>Guest Parking</span>
              <span>{formatNumber(results.guestParking)}</span>
            </div>
            <div className="flex justify-between">
              <span>Disabled Parking</span>
              <span>{formatNumber(results.disabledParking)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics and Density */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card ref={populationRef as RefObject<HTMLDivElement>}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Population Demographics</CardTitle>
            <ExportButton ref={populationRef} fileName="Population_Demographics" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Adults</span>
                <span>{formatNumber(results.adults)} ({((results.adults / results.totalPopulation) * 100).toFixed(1)}%)</span>
              </div>
              <Progress value={(results.adults / results.totalPopulation) * 100} />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Children</span>
                <span>{formatNumber(results.children)} ({((results.children / results.totalPopulation) * 100).toFixed(1)}%)</span>
              </div>
              <Progress value={(results.children / results.totalPopulation) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card ref={densityRef as RefObject<HTMLDivElement>}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Density Metrics</CardTitle>
            <ExportButton ref={densityRef} fileName="Density_Metrics" />
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={densityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 💳 FINANCIAL SUMMARY - MOVED TO BOTTOM */}
      <Card ref={financialRef as RefObject<HTMLDivElement>}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg font-semibold">Financial Summary</CardTitle>
            <p className="text-sm text-muted-foreground">Key metrics for initial project viability assessment.</p>
          </div>
          <ExportButton ref={financialRef} fileName="Financial_Summary" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Development Cost */}
            <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Development Cost (TDC)</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                {`AED ${formatNumber(results.totalDevelopmentCost)}`}
              </div>
            </div>
            {/* Total Potential Revenue */}
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-sm text-muted-foreground">Total Potential Revenue</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                {`AED ${formatNumber(results.totalRevenue)}`}
              </div>
            </div>
            {/* Gross Profit Margin */}
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-sm text-muted-foreground">Gross Profit Margin</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {`${results.profitMargin.toFixed(2)}%`}
              </div>
            </div>
          </div>

          {/* Revenue Model Indicator */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue Model:</span>
              <Badge variant={results.revenueModel === 'mixed' ? 'default' : 'secondary'}>
                {results.revenueModel === 'sale' && 'For Sale Only'}
                {results.revenueModel === 'rental' && 'For Rent Only'}
                {results.revenueModel === 'mixed' && 'Mixed (Sale & Rent)'}
              </Badge>
            </div>
            {results.revenueModel === 'mixed' && (
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">
                    {formatCurrency(results.totalRevenue)}
                  </div>
                  <div className="text-muted-foreground">Sale Revenue</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">
                    {formatCurrency(results.totalRentalRevenue)}
                  </div>
                  <div className="text-muted-foreground">Rental Revenue</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};