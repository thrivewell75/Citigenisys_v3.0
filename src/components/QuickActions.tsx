import React from 'react';
import { Button } from './ui/button';
import { FileX, Zap } from 'lucide-react';

interface Polygon {
  id: string;
  coordinates: [number, number][];
  area: number;
}

interface QuickActionsProps {
  selectedPolygon: Polygon | null;
  onClearImportedFile?: () => void;
  onZoomToArea?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  selectedPolygon,
  onClearImportedFile,
  onZoomToArea
}) => {
  if (!selectedPolygon) return null;

  const isImported = selectedPolygon.id.startsWith('imported-');

  return (
    <div className="space-y-2">
      {/* Clear Imported Area Button - Only show when polygon exists and is imported */}
      {isImported && onClearImportedFile && (
        <Button
          onClick={onClearImportedFile}
          variant="outline"
          size="sm"
          className="w-full justify-start text-orange-700 border-orange-200 hover:bg-orange-50 dark:text-orange-300 dark:border-orange-700 dark:hover:bg-orange-950/30"
        >
          <FileX className="w-4 h-4 mr-2" />
          Clear Imported Area
        </Button>
      )}

      {/* Zoom to Area Button - Always show when polygon exists */}
      {onZoomToArea && (
        <Button
          onClick={onZoomToArea}
          variant="outline"
          size="sm"
          className="w-full justify-start text-purple-700 border-purple-200 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-700 dark:hover:bg-purple-950/30"
        >
          <Zap className="w-4 h-4 mr-2" />
          Zoom to Area
        </Button>
      )}
    </div>
  );
};