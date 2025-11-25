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
import { MeasurementHistory, MeasurementHistoryItem } from './MeasurementHistory';
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
  History,
  Globe
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
  
  // Measurement controls
  measurementMode: 'distance' | 'area' | null;
  measurementResult: MeasurementResult | null;
  measurementHistory: MeasurementHistoryItem[];
  useImperialUnits: boolean;
  onStartMeasurement: (mode: 'distance' | 'area') => void;
  onClearMeasurements: () => void;
  onClearMeasurementHistory: () => void;
  onDeleteMeasurement: (id: string) => void;
  onExportMeasurements: (format: 'csv' | 'json') => void;
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
  measurementMode,
  measurementResult,
  measurementHistory,
  useImperialUnits,
  onStartMeasurement,
  onClearMeasurements,
  onClearMeasurementHistory,
  onDeleteMeasurement,
  onExportMeasurements,
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
  const [measurementHistoryOpen, setMeasurementHistoryOpen] = useState(false);
  const [layerControlsOpen, setLayerControlsOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

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
      if (valueInM >= 1000) {
        return `${(valueInM / 1000).toFixed(2)} km`;
      }
      return `${valueInM.toFixed(1)} m`;
    } else if (result.type === 'area') {
      const valueInM2 = result.value;
      if (valueInM2 >= 10000) {
        return `${(valueInM2 / 10000).toFixed(2)} hectares`;
      }
      return `${valueInM2.toFixed(1)} m²`;
    }
    return '';
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

          {/* Area Information - Only show when polygon is selected */}
          {selectedPolygon && !drawingMode && (
            <Collapsible open={areaInfoOpen} onOpenChange={setAreaInfoOpen}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    <span className="font-medium">Area Information</span>
                  </div>
                  {areaInfoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-2">
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
                                {metrics.areaHectares.toFixed(2)} ha
                              </div>
                              <div className="text-xs text-green-600 dark:text-green-400">
                                Primary Area
                              </div>
                            </div>
                            
                            {/* Alternative Units */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 bg-white dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                <div className="font-medium text-green-800 dark:text-green-200">
                                  {selectedPolygon.area.toLocaleString()} m²
                                </div>
                                <div className="text-green-600 dark:text-green-400">Square Meters</div>
                              </div>
                              <div className="text-center p-2 bg-white dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                <div className="font-medium text-green-800 dark:text-green-200">
                                  {metrics.areaAcres.toFixed(2)} ac
                                </div>
                                <div className="text-green-600 dark:text-green-400">Acres</div>
                              </div>
                            </div>
                            
                            {metrics.areaKm2 >= 0.01 && (
                              <div className="text-center p-2 bg-white dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
                                <div className="text-xs">
                                  <span className="font-medium text-green-800 dark:text-green-200">
                                    {metrics.areaKm2.toFixed(3)} km²
                                  </span>
                                  <span className="text-green-600 dark:text-green-400 ml-1">Square Kilometers</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <Separator className="bg-green-200 dark:bg-green-800" />

                    {/* Polygon Details */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-green-800 dark:text-green-200">Polygon Details</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-green-600 dark:text-green-400">Vertices:</span>
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {selectedPolygon.coordinates.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600 dark:text-green-400">Perimeter:</span>
                          <span className="font-medium text-green-800 dark:text-green-200">
                            {(calculateAreaMetrics(selectedPolygon).perimeter / 1000).toFixed(2)} km
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-green-200 dark:bg-green-800" />

                    {/* Coordinates Summary */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-green-800 dark:text-green-200">Boundary Box</h5>
                      {(() => {
                        const lats = selectedPolygon.coordinates.map(coord => coord[0]);
                        const lngs = selectedPolygon.coordinates.map(coord => coord[1]);
                        const minLat = Math.min(...lats);
                        const maxLat = Math.max(...lats);
                        const minLng = Math.min(...lngs);
                        const maxLng = Math.max(...lngs);
                        
                        return (
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-green-600 dark:text-green-400">North:</span>
                              <span className="font-mono text-green-800 dark:text-green-200">
                                {maxLat.toFixed(6)}°
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600 dark:text-green-400">South:</span>
                              <span className="font-mono text-green-800 dark:text-green-200">
                                {minLat.toFixed(6)}°
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600 dark:text-green-400">East:</span>
                              <span className="font-mono text-green-800 dark:text-green-200">
                                {maxLng.toFixed(6)}°
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-600 dark:text-green-400">West:</span>
                              <span className="font-mono text-green-800 dark:text-green-200">
                                {minLng.toFixed(6)}°
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          )}

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
                    
                    {measurementResult.type === 'distance' ? (
                      // Distance measurement - enhanced with multiple formats
                      (() => {
                        const distanceM = measurementResult.alternativeUnits?.meters || measurementResult.value;
                        const distanceKm = measurementResult.alternativeUnits?.kilometers || (distanceM / 1000);
                        
                        return (
                          <div className="space-y-2">
                            {/* Primary Distance Display */}
                            <div className="text-center p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                              <div className="text-lg font-semibold text-red-800 dark:text-red-200">
                                {formatMeasurementValue(measurementResult)}
                              </div>
                              <div className="text-xs text-red-600 dark:text-red-400">
                                Primary Measurement
                              </div>
                            </div>
                            
                            {/* Additional Units */}
                            <div className="space-y-2 text-xs">
                              {/* Always show meters */}
                              <div className="text-center p-2 bg-white dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                                <div className="font-medium text-red-800 dark:text-red-200">
                                  {Math.round(distanceM).toLocaleString()} m
                                </div>
                                <div className="text-red-600 dark:text-red-400">Meters</div>
                              </div>
                              
                              {/* Always show kilometers */}
                              <div className="text-center p-2 bg-white dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                                <div className="font-medium text-red-800 dark:text-red-200">
                                  {distanceKm >= 0.1 ? distanceKm.toFixed(2) : distanceKm.toFixed(4)} km
                                </div>
                                <div className="text-red-600 dark:text-red-400">Kilometers</div>
                              </div>
                            </div>
                            
                            {/* Point count */}
                            <div className="text-center text-xs text-red-600 dark:text-red-400">
                              {measurementResult.coordinates.length} point{measurementResult.coordinates.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      // Area measurement - multiple formats
                      (() => {
                        // Use alternativeUnits if available, otherwise calculate
                        const areaM2 = measurementResult.alternativeUnits?.squareMeters || measurementResult.value;
                        const areaKm2 = measurementResult.alternativeUnits?.squareKilometers || (areaM2 / 1000000);
                        const areaHa = measurementResult.alternativeUnits?.hectares || (areaM2 / 10000);
                        
                        return (
                          <div className="space-y-2">
                            {/* Primary Area Display */}
                            <div className="text-center p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                              <div className="text-lg font-semibold text-teal-800 dark:text-teal-200">
                                {formatMeasurementValue(measurementResult)}
                              </div>
                              <div className="text-xs text-teal-600 dark:text-teal-400">
                                Primary Measurement
                              </div>
                            </div>
                            
                            {/* All Units Grid */}
                            <div className="space-y-2 text-xs">
                              {/* Always show square meters */}
                              <div className="text-center p-2 bg-white dark:bg-teal-950/20 rounded border border-teal-200 dark:border-teal-800">
                                <div className="font-medium text-teal-800 dark:text-teal-200">
                                  {Math.round(areaM2).toLocaleString()} m²
                                </div>
                                <div className="text-teal-600 dark:text-teal-400">Square Meters</div>
                              </div>
                              
                              {/* Always show square kilometers with appropriate precision */}
                              <div className="text-center p-2 bg-white dark:bg-teal-950/20 rounded border border-teal-200 dark:border-teal-800">
                                <div className="font-medium text-teal-800 dark:text-teal-200">
                                  {areaKm2 >= 0.01 ? areaKm2.toFixed(3) : areaKm2.toFixed(6)} km²
                                </div>
                                <div className="text-teal-600 dark:text-teal-400">Square Kilometers</div>
                              </div>
                              
                              {/* Show hectares when relevant */}
                              {areaHa >= 0.001 && (
                                <div className="text-center p-2 bg-white dark:bg-teal-950/20 rounded border border-teal-200 dark:border-teal-800">
                                  <div className="font-medium text-teal-800 dark:text-teal-200">
                                    {areaHa >= 0.1 ? areaHa.toFixed(2) : areaHa.toFixed(4)} ha
                                  </div>
                                  <div className="text-teal-600 dark:text-teal-400">Hectares</div>
                                </div>
                              )}
                            </div>
                            
                            {/* Point count */}
                            <div className="text-center text-xs text-teal-600 dark:text-teal-400">
                              {measurementResult.coordinates.length} point{measurementResult.coordinates.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </CardContent>
                </Card>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Measurement Settings */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">Measurement Settings</span>
                </div>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Imperial Units</Label>
                    <Switch
                      checked={useImperialUnits}
                      onCheckedChange={onToggleUnits}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {useImperialUnits 
                      ? 'Showing measurements in feet, yards, miles, and acres'
                      : 'Showing measurements in meters, kilometers, and hectares'
                    }
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          {/* Measurement History */}
          <Collapsible open={measurementHistoryOpen} onOpenChange={setMeasurementHistoryOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="font-medium">Measurement History</span>
                  {measurementHistory.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {measurementHistory.length}
                    </Badge>
                  )}
                </div>
                {measurementHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <MeasurementHistory
                measurements={measurementHistory}
                useImperialUnits={useImperialUnits}
                onClearHistory={onClearMeasurementHistory}
                onDeleteMeasurement={onDeleteMeasurement}
                onExportMeasurements={onExportMeasurements}
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Drawing Tools */}
          <Collapsible open={drawingToolsOpen} onOpenChange={setDrawingToolsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  <span className="font-medium">Drawing Tools</span>
                </div>
                {drawingToolsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4 space-y-3">
                  <Button 
                    onClick={onStartDrawing} 
                    disabled={drawingMode}
                    variant={drawingMode ? "secondary" : "default"}
                    className="w-full"
                    size="sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    {drawingMode ? "Drawing Active" : "Start Drawing AOI"}
                  </Button>
                  
                  <Button 
                    onClick={onFinishDrawing} 
                    disabled={!drawingMode || currentPolygonPoints < 3}
                    variant="outline"
                    className="w-full"
                    size="sm"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Finish Polygon ({currentPolygonPoints} points)
                  </Button>
                  
                  <Button 
                    onClick={onClearMap} 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/10"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </CardContent>
              </Card>

              {/* Drawing Status */}
              {drawingMode && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Mouse className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Drawing Mode Active</span>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    Click on the map to add points. Need at least 3 points for a polygon.
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Map Layer Controls */}
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
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4 space-y-4">
                  {/* Current Layer */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sidebar-foreground">Base Layer</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getLayerIcon(baseLayer)}
                      {getLayerName(baseLayer)}
                    </Badge>
                  </div>

                  {/* Base Layer Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-sidebar-foreground">Choose Base Layer</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => onLayerChange('osm')}
                        variant={baseLayer === 'osm' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Map className="w-3 h-3" />
                        Street
                      </Button>
                      
                      <Button
                        onClick={() => onLayerChange('satellite')}
                        variant={baseLayer === 'satellite' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Satellite className="w-3 h-3" />
                        Satellite
                      </Button>
                      
                      <Button
                        onClick={() => onLayerChange('topographic')}
                        variant={baseLayer === 'topographic' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Mountain className="w-3 h-3" />
                        Topo
                      </Button>
                      
                      <Button
                        onClick={() => onLayerChange('dark')}
                        variant={baseLayer === 'dark' ? 'default' : 'outline'}
                        size="sm"
                        className="flex items-center gap-1 text-xs"
                      >
                        <Moon className="w-3 h-3" />
                        Dark
                      </Button>
                    </div>
                  </div>

                  {/* Satellite Opacity */}
                  {baseLayer === 'satellite' && (
                    <>
                      <Separator className="bg-sidebar-border" />
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-sidebar-foreground">Base Opacity</label>
                          <Badge variant="secondary">{satelliteOpacity[0]}%</Badge>
                        </div>
                        <Slider
                          value={satelliteOpacity}
                          onValueChange={onOpacityChange}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-sidebar-foreground/70">
                          Adjust satellite imagery transparency
                        </p>
                      </div>
                    </>
                  )}

                  {/* Overlay Layer Controls */}
                  <Separator className="bg-sidebar-border" />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-sidebar-foreground">Overlay Layer</span>
                      {overlayLayer ? (
                        <Button
                          onClick={() => onOverlayLayerChange(null)}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Remove
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-xs">None</Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-sidebar-foreground/70">Add overlay on top of base layer</label>
                      <div className="grid grid-cols-2 gap-2">
                        {getAvailableOverlayLayers().map((layer) => (
                          <Button
                            key={layer}
                            onClick={() => onOverlayLayerChange(layer)}
                            variant={overlayLayer === layer ? 'default' : 'outline'}
                            size="sm"
                            className="flex items-center gap-1 text-xs"
                          >
                            {getLayerIcon(layer)}
                            {layer === 'osm' ? 'Street' : 
                             layer === 'satellite' ? 'Satellite' :
                             layer === 'topographic' ? 'Topo' : 'Dark'}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Overlay Opacity */}
                    {overlayLayer && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium text-sidebar-foreground">Overlay Opacity</label>
                          <Badge variant="secondary">{overlayOpacity[0]}%</Badge>
                        </div>
                        <Slider
                          value={overlayOpacity}
                          onValueChange={onOverlayOpacityChange}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                        <p className="text-xs text-sidebar-foreground/70">
                          Adjust overlay transparency to blend with base layer
                        </p>
                      </div>
                    )}
                  </div>
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
              <Card className="bg-sidebar-accent/50 border-sidebar-border">
                <CardContent className="p-4">
                  <Textarea
                    placeholder="Add notes about your area of interest, design considerations, or planning requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-24 bg-background border-sidebar-border"
                    rows={4}
                  />
                  <p className="text-xs text-sidebar-foreground/70 mt-2">
                    Notes are saved locally and will be included in reports
                  </p>
                </CardContent>
              </Card>
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
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">1</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-sidebar-foreground">Select Base Layer</p>
                        <p className="text-xs text-sidebar-foreground/70">Choose your primary map view (Street, Satellite, Topographic, or Dark)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">2</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-sidebar-foreground">Add Overlay (Optional)</p>
                        <p className="text-xs text-sidebar-foreground/70">Layer additional map data on top with adjustable transparency</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">3</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-sidebar-foreground">Start Drawing</p>
                        <p className="text-xs text-sidebar-foreground/70">Click "Start Drawing AOI" and then click points on the map to define your area</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">4</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-sidebar-foreground">Complete Polygon</p>
                        <p className="text-xs text-sidebar-foreground/70">Add at least 3 points, then click "Finish Polygon" to complete your area</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-sidebar-border" />

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-sidebar-foreground">Hybrid Layer Tips:</p>
                    <ul className="space-y-1 text-xs text-sidebar-foreground/70">
                      <li>• Use satellite base with street overlay for labeled aerial views</li>
                      <li>• Try topographic overlay on satellite for terrain + imagery</li>
                      <li>• Combine any layers for custom hybrid views</li>
                      <li>• Adjust overlay opacity to find the perfect blend</li>
                      <li>• Remove overlay anytime by clicking "Remove"</li>
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