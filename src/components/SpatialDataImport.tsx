import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Upload, 
  FileText, 
  Globe, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  X,
  MapPin,
  Info
} from 'lucide-react';
import { 
  importSpatialFile, 
  validateImportedPolygons, 
  ImportResult, 
  ImportedPolygon 
} from '../utils/spatialDataImport';

interface SpatialDataImportProps {
  onImportComplete: (polygons: ImportedPolygon[]) => void;
  onClose?: () => void;
}

export const SpatialDataImport: React.FC<SpatialDataImportProps> = ({ 
  onImportComplete, 
  onClose 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedPolygons, setSelectedPolygons] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setImportResult(null);
    
    try {
      const result = await importSpatialFile(file);
      setImportResult(result);
      
      // Auto-select all valid polygons
      if (result.success) {
        const validation = validateImportedPolygons(result.polygons);
        const validIds = new Set(validation.valid.map(p => p.id));
        setSelectedPolygons(validIds);
      }
    } catch (error) {
      setImportResult({
        success: false,
        polygons: [],
        errors: [`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleImport = () => {
    if (!importResult || selectedPolygons.size === 0) return;
    
    const polygonsToImport = importResult.polygons.filter(p => selectedPolygons.has(p.id));
    const validation = validateImportedPolygons(polygonsToImport);
    
    if (validation.valid.length > 0) {
      onImportComplete(validation.valid);
    }
  };

  const togglePolygonSelection = (polygonId: string) => {
    const newSelection = new Set(selectedPolygons);
    if (newSelection.has(polygonId)) {
      newSelection.delete(polygonId);
    } else {
      newSelection.add(polygonId);
    }
    setSelectedPolygons(newSelection);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatArea = (area: number): string => {
    if (area < 10000) {
      return `${area.toFixed(0)} m²`;
    } else if (area < 1000000) {
      return `${(area / 10000).toFixed(2)} ha`;
    } else {
      return `${(area / 1000000).toFixed(2)} km²`;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Spatial Data
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Upload GeoJSON, KML, or Shapefile data to define areas of interest
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* File Upload Area */}
        {!importResult && (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isProcessing ? (
                <div className="space-y-4">
                  <div className="mx-auto w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <div>
                    <p className="font-medium">Processing file...</p>
                    <p className="text-sm text-muted-foreground">Parsing spatial data</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground">or click to browse</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".geojson,.json,.kml,.shp,.txt"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Supported Formats */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Supported Formats</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium">GeoJSON</div>
                    <div className="text-xs text-muted-foreground">.geojson, .json</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Globe className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium">KML</div>
                    <div className="text-xs text-muted-foreground">.kml</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Database className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium">Shapefile</div>
                    <div className="text-xs text-muted-foreground">.shp, .txt</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Import Results */}
        {importResult && (
          <div className="space-y-4">
            {/* Status Messages */}
            {importResult.errors.length > 0 && (
              <Alert className="border-destructive/50 text-destructive dark:border-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {importResult.errors.map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {importResult.warnings.length > 0 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <div className="font-medium">Warnings:</div>
                    {importResult.warnings.map((warning, index) => (
                      <div key={index} className="text-sm">• {warning}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Import Summary */}
            {importResult.metadata && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <div className="text-xs text-muted-foreground">Format</div>
                  <div className="font-medium uppercase">{importResult.metadata.format}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Features</div>
                  <div className="font-medium">{importResult.metadata.totalFeatures}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Valid Polygons</div>
                  <div className="font-medium">{importResult.metadata.importedFeatures}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Coordinate System</div>
                  <div className="font-medium text-xs">{importResult.metadata.coordinateSystem}</div>
                </div>
              </div>
            )}

            {/* Polygon Selection */}
            {importResult.polygons.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Select Polygons to Import</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPolygons(new Set(importResult.polygons.map(p => p.id)))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPolygons(new Set())}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                  {importResult.polygons.map((polygon, index) => {
                    const isSelected = selectedPolygons.has(polygon.id);
                    const validation = validateImportedPolygons([polygon]);
                    const isValid = validation.valid.length > 0;

                    return (
                      <div
                        key={polygon.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-muted hover:border-muted-foreground/50'
                        } ${!isValid ? 'opacity-50' : ''}`}
                        onClick={() => isValid && togglePolygonSelection(polygon.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="font-medium truncate">{polygon.name}</span>
                              {isSelected && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                            </div>
                            <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {polygon.description}
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span>Area: {formatArea(polygon.area)}</span>
                              <span>Points: {polygon.coordinates.length}</span>
                              {!isValid && (
                                <Badge variant="destructive" className="text-xs">
                                  Invalid
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setImportResult(null);
                  setSelectedPolygons(new Set());
                }}
              >
                Import Another File
              </Button>
              
              <div className="flex gap-2">
                {onClose && (
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                )}
                <Button
                  onClick={handleImport}
                  disabled={selectedPolygons.size === 0}
                >
                  Import {selectedPolygons.size} Polygon{selectedPolygons.size !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};