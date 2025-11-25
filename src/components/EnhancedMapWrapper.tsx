import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { MapComponent, MapComponentRef, MeasurementResult } from './MapComponent';

interface Polygon {
  id: string;
  coordinates: [number, number][];
  area: number;
}

type BaseLayerType = 'osm' | 'satellite' | 'topographic' | 'dark';

interface EnhancedMapWrapperProps {
  onPolygonChange: (polygon: Polygon | null) => void;
  selectedPolygon: Polygon | null;
  drawingMode: boolean;
  currentPolygon: [number, number][];
  setCurrentPolygon: (polygon: [number, number][]) => void;
  baseLayer: BaseLayerType;
  satelliteOpacity: number[];
  overlayLayer: BaseLayerType | null;
  overlayOpacity: number[];
  onDrawingModeChange: (mode: boolean) => void;
  measurementMode: 'distance' | 'area' | null;
  onMeasurementModeChange: (mode: 'distance' | 'area' | null) => void;
  onMeasurementResult: (result: MeasurementResult | null) => void;
  
  // Enhanced props
  useImperialUnits: boolean;
}

export const EnhancedMapWrapper = forwardRef<MapComponentRef, EnhancedMapWrapperProps>(
  (props, ref) => {
    const mapRef = useRef<MapComponentRef>(null);
    
    // Forward ref methods
    useImperativeHandle(ref, () => ({
      clearMap: () => mapRef.current?.clearMap(),
      finishDrawing: () => mapRef.current?.finishDrawing(),
      clearMeasurements: () => mapRef.current?.clearMeasurements(),
      zoomToPolygon: (polygon: Polygon) => mapRef.current?.zoomToPolygon(polygon),
    }));

    return (
      <div className="relative w-full h-full">
        <MapComponent
          ref={mapRef}
          {...props}
        />
        
        {/* Additional overlay for comparison polygons could go here */}
        {/* This would be implemented based on the actual map library being used */}
      </div>
    );
  }
);

EnhancedMapWrapper.displayName = 'EnhancedMapWrapper';