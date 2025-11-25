import React from 'react';
import { MeasurementHistoryItem } from './MeasurementHistory';

interface MeasurementAnnotationsProps {
  measurements: MeasurementHistoryItem[];
  useImperialUnits: boolean;
  onAnnotationClick?: (measurementId: string) => void;
}

export const MeasurementAnnotations: React.FC<MeasurementAnnotationsProps> = ({
  measurements,
  useImperialUnits,
  onAnnotationClick
}) => {
  // Unit conversion functions
  const convertDistance = (meters: number): string => {
    if (useImperialUnits) {
      const feet = meters * 3.28084;
      const yards = feet / 3;
      const miles = meters / 1609.34;
      
      if (miles >= 1) {
        return `${miles.toFixed(2)} mi`;
      } else if (yards >= 100) {
        return `${yards.toFixed(0)} yd`;
      } else {
        return `${feet.toFixed(1)} ft`;
      }
    } else {
      if (meters >= 1000) {
        return `${(meters / 1000).toFixed(2)} km`;
      } else {
        return `${meters.toFixed(1)} m`;
      }
    }
  };

  const convertArea = (squareMeters: number): string => {
    if (useImperialUnits) {
      const squareFeet = squareMeters * 10.7639;
      const acres = squareMeters * 0.000247105;
      const squareMiles = squareMeters / 2589988.11;
      
      if (squareMiles >= 1) {
        return `${squareMiles.toFixed(3)} sq mi`;
      } else if (acres >= 1) {
        return `${acres.toFixed(2)} ac`;
      } else {
        return `${squareFeet.toFixed(0)} sq ft`;
      }
    } else {
      const hectares = squareMeters / 10000;
      const squareKilometers = squareMeters / 1000000;
      
      if (squareKilometers >= 1) {
        return `${squareKilometers.toFixed(3)} km²`;
      } else if (hectares >= 1) {
        return `${hectares.toFixed(2)} ha`;
      } else {
        return `${squareMeters.toFixed(1)} m²`;
      }
    }
  };

  // Calculate center point for annotation placement
  const getCenterPoint = (coordinates: [number, number][]): [number, number] => {
    const latSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
    const lngSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
    return [latSum / coordinates.length, lngSum / coordinates.length];
  };

  return (
    <div className="measurement-annotations">
      {measurements.map((measurement) => {
        const centerPoint = getCenterPoint(measurement.coordinates);
        const value = measurement.type === 'distance' 
          ? convertDistance(measurement.value)
          : convertArea(measurement.value);
        
        return (
          <div
            key={measurement.id}
            className="measurement-annotation"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              pointerEvents: 'auto'
            }}
            onClick={() => onAnnotationClick?.(measurement.id)}
          >
            <div 
              className={`
                px-2 py-1 rounded-lg shadow-lg text-xs font-medium cursor-pointer
                transition-all duration-200 hover:scale-105 hover:shadow-xl
                ${measurement.type === 'distance' 
                  ? 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-200' 
                  : 'bg-teal-100 text-teal-800 border border-teal-200 hover:bg-teal-200'
                }
              `}
            >
              <div className="flex items-center gap-1">
                <span className="font-mono">{value}</span>
                <span className="text-xs opacity-75">
                  {measurement.type === 'distance' ? '📏' : '📐'}
                </span>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  <div>{measurement.name}</div>
                  <div className="text-xs opacity-75">
                    {measurement.timestamp.toLocaleString()}
                  </div>
                  <div className="text-xs opacity-75">
                    {measurement.coordinates.length} points
                  </div>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-black"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// CSS for the measurement annotations (to be added to global styles)
export const measurementAnnotationStyles = `
  .measurement-annotation {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }
  
  .measurement-annotation:hover .tooltip {
    opacity: 1;
    transform: translateY(-100%) translateX(-50%);
  }
`;