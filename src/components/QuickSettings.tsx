import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Settings, 
  Globe,
  Eye,
  EyeOff,
  FileText,
  BarChart3,
  History,
  Download
} from 'lucide-react';
import { MeasurementHistoryItem } from './MeasurementHistory';

interface QuickSettingsProps {
  useImperialUnits: boolean;
  onToggleUnits: (useImperial: boolean) => void;
  
  showMeasurementAnnotations: boolean;
  onToggleAnnotations: (show: boolean) => void;
  
  measurementHistory: MeasurementHistoryItem[];
  onExportAllMeasurements: () => void;
  onClearAllMeasurements: () => void;
  
  // Feature toggles
  onOpenMeasurementHistory: () => void;
  onOpenMeasurementTemplates: () => void;
  onOpenAreaComparison: () => void;
}

export const QuickSettings: React.FC<QuickSettingsProps> = ({
  useImperialUnits,
  onToggleUnits,
  showMeasurementAnnotations,
  onToggleAnnotations,
  measurementHistory,
  onExportAllMeasurements,
  onClearAllMeasurements,
  onOpenMeasurementHistory,
  onOpenMeasurementTemplates,
  onOpenAreaComparison
}) => {
  return (
    <Card className="absolute top-4 right-4 z-20 w-64 shadow-lg">
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <Label className="text-sm font-medium">Quick Settings</Label>
          </div>
          
          <Separator />
          
          {/* Units Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm">Units</Label>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {useImperialUnits ? 'Imperial' : 'Metric'}
              </span>
              <Switch
                checked={useImperialUnits}
                onCheckedChange={onToggleUnits}
                size="sm"
              />
            </div>
          </div>
          
          {/* Annotations Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showMeasurementAnnotations ? (
                <Eye className="w-4 h-4 text-muted-foreground" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
              <Label className="text-sm">Map Annotations</Label>
            </div>
            <Switch
              checked={showMeasurementAnnotations}
              onCheckedChange={onToggleAnnotations}
              size="sm"
            />
          </div>
          
          <Separator />
          
          {/* Measurement Stats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Measurements:</span>
              <span className="font-medium">{measurementHistory.length}</span>
            </div>
            
            {measurementHistory.length > 0 && (
              <div className="grid grid-cols-2 gap-1 text-xs">
                <div className="text-center p-1 bg-red-100 dark:bg-red-900/20 rounded">
                  <div className="font-medium">
                    {measurementHistory.filter(m => m.type === 'distance').length}
                  </div>
                  <div className="text-red-600 dark:text-red-400">Distance</div>
                </div>
                <div className="text-center p-1 bg-teal-100 dark:bg-teal-900/20 rounded">
                  <div className="font-medium">
                    {measurementHistory.filter(m => m.type === 'area').length}
                  </div>
                  <div className="text-teal-600 dark:text-teal-400">Area</div>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Quick Actions */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-1">
              <Button
                onClick={onOpenMeasurementHistory}
                variant="outline"
                size="sm"
                className="text-xs p-1"
              >
                <History className="w-3 h-3" />
              </Button>
              <Button
                onClick={onOpenMeasurementTemplates}
                variant="outline"
                size="sm"
                className="text-xs p-1"
              >
                <FileText className="w-3 h-3" />
              </Button>
              <Button
                onClick={onOpenAreaComparison}
                variant="outline"
                size="sm"
                className="text-xs p-1"
              >
                <BarChart3 className="w-3 h-3" />
              </Button>
            </div>
            
            {measurementHistory.length > 0 && (
              <div className="grid grid-cols-2 gap-1">
                <Button
                  onClick={onExportAllMeasurements}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
                <Button
                  onClick={onClearAllMeasurements}
                  variant="outline"
                  size="sm"
                  className="text-xs text-destructive hover:text-destructive"
                >
                  Clear
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};