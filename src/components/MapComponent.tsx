import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Polygon {
  id: string;
  coordinates: [number, number][];
  area: number; // in square meters
}

interface MapComponentProps {
  onPolygonChange: (polygon: Polygon | null) => void;
  selectedPolygon: Polygon | null;
  // Controlled props from sidebar
  drawingMode: boolean;
  currentPolygon: [number, number][];
  setCurrentPolygon: (polygon: [number, number][]) => void;
  baseLayer: 'osm' | 'satellite' | 'topographic' | 'dark';
  satelliteOpacity: number[];
  overlayLayer: 'osm' | 'satellite' | 'topographic' | 'dark' | null;
  overlayOpacity: number[];
  onDrawingModeChange: (mode: boolean) => void;
  // Measurement props
  measurementMode: 'distance' | 'area' | null;
  onMeasurementModeChange: (mode: 'distance' | 'area' | null) => void;
  onMeasurementResult: (result: MeasurementResult | null) => void;
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

export interface MapComponentRef {
  finishDrawing: () => void;
  clearMap: () => void;
  clearMeasurements: () => void;
  zoomToPolygon: (polygon: Polygon) => void;
}

export const MapComponent = forwardRef<MapComponentRef, MapComponentProps>(({ 
  onPolygonChange, 
  selectedPolygon,
  drawingMode,
  currentPolygon,
  setCurrentPolygon,
  baseLayer,
  satelliteOpacity,
  overlayLayer,
  overlayOpacity,
  onDrawingModeChange,
  measurementMode,
  onMeasurementModeChange,
  onMeasurementResult
}, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [drawnLayers, setDrawnLayers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseLayers, setBaseLayers] = useState<Record<string, any>>({});
  const [overlayLayers, setOverlayLayers] = useState<Record<string, any>>({});
  const [currentOverlayLayer, setCurrentOverlayLayer] = useState<any>(null);
  // Measurement state
  const [measurementLayers, setMeasurementLayers] = useState<any[]>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<[number, number][]>([]);
  const pendingUpdatesRef = useRef<NodeJS.Timeout[]>([]);
  const [isDrawingComplete, setIsDrawingComplete] = useState(false);
  const [lastAutoZoomedPolygonId, setLastAutoZoomedPolygonId] = useState<string | null>(null);
  const [showAutoZoomNotification, setShowAutoZoomNotification] = useState(false);

  // Zoom to polygon bounds
  const zoomToPolygonBounds = useCallback((polygon: Polygon) => {
    if (!map || !L || !polygon.coordinates.length) return;
    
    try {
      const bounds = L.latLngBounds(polygon.coordinates);
      
      // Use setTimeout to ensure the polygon is rendered before zooming
      setTimeout(() => {
        map.fitBounds(bounds, { 
          padding: [50, 50], // Increased padding for better visual context
          maxZoom: 18 // Prevent over-zooming on small polygons
        });
        
        // Show notification that auto-zoom occurred
        setShowAutoZoomNotification(true);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setShowAutoZoomNotification(false);
        }, 3000);
      }, 100); // Small delay to ensure rendering is complete
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [map, L]);

  // Handle external polygon changes (imported polygons)
  useEffect(() => {
    if (!map || !L || !selectedPolygon) {
      setLastAutoZoomedPolygonId(null);
      return;
    }
    
    // Check if this polygon was created from drawing (avoid redrawing during drawing)
    if (drawingMode || isDrawingComplete) {
      setIsDrawingComplete(false);
      return;
    }
    
    // Clear existing layers
    drawnLayers.forEach(layer => {
      map.removeLayer(layer);
    });
    
    // Add the imported/external polygon
    const importedPolygon = L.polygon(selectedPolygon.coordinates, {
      color: '#22c55e',
      fillColor: '#22c55e', 
      fillOpacity: 0.3,
      weight: 3
    }).addTo(map);
    
    setDrawnLayers([importedPolygon]);
    
    // Auto-zoom to fit the polygon only if it's a new polygon and hasn't been auto-zoomed before
    const shouldAutoZoom = selectedPolygon.id !== lastAutoZoomedPolygonId;
    if (shouldAutoZoom) {
      // Directly call zoom logic instead of using callback to avoid dependency issues
      try {
        const bounds = L.latLngBounds(selectedPolygon.coordinates);
        
        setTimeout(() => {
          map.fitBounds(bounds, { 
            padding: [50, 50],
            maxZoom: 18
          });
          
          setShowAutoZoomNotification(true);
          
          setTimeout(() => {
            setShowAutoZoomNotification(false);
          }, 3000);
        }, 100);
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
      
      setLastAutoZoomedPolygonId(selectedPolygon.id);
    }
    
  }, [selectedPolygon, map, L, drawingMode, isDrawingComplete, lastAutoZoomedPolygonId]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Dynamically import Leaflet
          const leaflet = await import('leaflet');
          
          // Import Leaflet CSS
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
          
          // Fix marker icons
          delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
          leaflet.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
          });

          setL(leaflet);
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading Leaflet:', error);
          setIsLoading(false);
        }
      }
    };

    loadLeaflet();
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    const R = 6371000; // Earth's radius in meters
    const lat1 = point1[0] * Math.PI / 180;
    const lat2 = point2[0] * Math.PI / 180;
    const deltaLat = (point2[0] - point1[0]) * Math.PI / 180;
    const deltaLng = (point2[1] - point1[1]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate total distance for a polyline
  const calculateTotalDistance = (points: [number, number][]): number => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateDistance(points[i], points[i + 1]);
    }
    return totalDistance;
  };

  // Memoized map click handler
  const handleMapClick = useCallback((e: any) => {
    if (!L || (!drawingMode && !measurementMode)) return;

    const newPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
    
    if (drawingMode) {
      setCurrentPolygon(prevPolygon => {
        const updatedPolygon = [...prevPolygon, newPoint];
        
        // Add marker for the point
        const marker = L.marker(newPoint, {
          icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(map);

        setDrawnLayers(prev => [...prev, marker]);

        // If we have at least 3 points, show the polygon
        if (updatedPolygon.length >= 3) {
          // Remove existing temporary polygon but keep markers
          setDrawnLayers(prevLayers => {
            const tempPolygons = prevLayers.filter(layer => layer._isTemporary);
            tempPolygons.forEach(layer => {
              map.removeLayer(layer);
            });
            return prevLayers.filter(layer => !layer._isTemporary);
          });

          // Add new temporary polygon
          const polygon = L.polygon(updatedPolygon, {
            color: '#3388ff',
            fillColor: '#3388ff',
            fillOpacity: 0.2,
            weight: 2
          }).addTo(map);
          
          polygon._isTemporary = true;
          setDrawnLayers(prev => [...prev, polygon]);

          // Calculate area and update parent (defer to avoid render cycle issues)
          const timeoutId = setTimeout(() => {
            const area = calculatePolygonArea(updatedPolygon);
            const polygonData: Polygon = {
              id: Date.now().toString(),
              coordinates: updatedPolygon,
              area: area
            };
            onPolygonChange(polygonData);
            pendingUpdatesRef.current = pendingUpdatesRef.current.filter(id => id !== timeoutId);
          }, 0);
          pendingUpdatesRef.current.push(timeoutId);
        }
        
        return updatedPolygon;
      });
    } else if (measurementMode) {
      setCurrentMeasurement(prevMeasurement => {
        const updatedMeasurement = [...prevMeasurement, newPoint];
        
        // Add measurement marker
        const measurementMarker = L.circleMarker(newPoint, {
          color: measurementMode === 'distance' ? '#ff6b6b' : '#4ecdc4',
          fillColor: measurementMode === 'distance' ? '#ff6b6b' : '#4ecdc4',
          fillOpacity: 0.8,
          radius: 6,
          weight: 2
        }).addTo(map);
        
        measurementMarker._isMeasurement = true;
        setMeasurementLayers(prev => [...prev, measurementMarker]);

        if (measurementMode === 'distance') {
          // For distance measurement, draw lines between points
          if (updatedMeasurement.length >= 2) {
            // Remove previous temporary line
            setMeasurementLayers(prevLayers => {
              const tempLines = prevLayers.filter(layer => layer._isTemporaryLine);
              tempLines.forEach(layer => {
                map.removeLayer(layer);
              });
              return prevLayers.filter(layer => !layer._isTemporaryLine);
            });

            // Draw new line
            const polyline = L.polyline(updatedMeasurement, {
              color: '#ff6b6b',
              weight: 3,
              opacity: 0.8,
              dashArray: '5, 10'
            }).addTo(map);
            
            polyline._isTemporaryLine = true;
            setMeasurementLayers(prev => [...prev, polyline]);

            // Calculate and display distance (defer to avoid render cycle issues)
            const timeoutId = setTimeout(() => {
              const distance = calculateTotalDistance(updatedMeasurement);
              const result: MeasurementResult = {
                type: 'distance',
                value: distance,
                unit: distance > 1000 ? 'km' : 'm',
                coordinates: updatedMeasurement,
                alternativeUnits: {
                  meters: distance,
                  kilometers: distance / 1000
                }
              };
              onMeasurementResult(result);
              pendingUpdatesRef.current = pendingUpdatesRef.current.filter(id => id !== timeoutId);
            }, 0);
            pendingUpdatesRef.current.push(timeoutId);
          }
        } else if (measurementMode === 'area') {
          // For area measurement, show polygon when we have at least 3 points
          if (updatedMeasurement.length >= 3) {
            // Remove previous temporary polygon
            setMeasurementLayers(prevLayers => {
              const tempPolygons = prevLayers.filter(layer => layer._isTemporaryMeasurementPolygon);
              tempPolygons.forEach(layer => {
                map.removeLayer(layer);
              });
              return prevLayers.filter(layer => !layer._isTemporaryMeasurementPolygon);
            });

            // Draw new measurement polygon
            const polygon = L.polygon(updatedMeasurement, {
              color: '#4ecdc4',
              fillColor: '#4ecdc4',
              fillOpacity: 0.3,
              weight: 3,
              dashArray: '5, 10'
            }).addTo(map);
            
            polygon._isTemporaryMeasurementPolygon = true;
            setMeasurementLayers(prev => [...prev, polygon]);

            // Calculate and display area (defer to avoid render cycle issues)
            const timeoutId = setTimeout(() => {
              const area = calculatePolygonArea(updatedMeasurement);
              const result: MeasurementResult = {
                type: 'area',
                value: area,
                unit: area > 10000 ? 'hectares' : 'm²',
                coordinates: updatedMeasurement,
                alternativeUnits: {
                  squareMeters: area,
                  squareKilometers: area / 1000000,
                  hectares: area / 10000
                }
              };
              onMeasurementResult(result);
              pendingUpdatesRef.current = pendingUpdatesRef.current.filter(id => id !== timeoutId);
            }, 0);
            pendingUpdatesRef.current.push(timeoutId);
          }
        }
        
        return updatedMeasurement;
      });
    }
  }, [drawingMode, measurementMode, L, map, setCurrentPolygon, onPolygonChange, onMeasurementResult]);

  // Initialize base layers
  const initializeBaseLayers = useCallback((leaflet: any) => {
    const layers = {
      osm: leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }),
      satellite: leaflet.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: '© Google',
        maxZoom: 20,
        opacity: satelliteOpacity[0] / 100
      }),
      topographic: leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
      }),
      dark: leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO',
        maxZoom: 19
      })
    };
    
    setBaseLayers(layers);
    return layers;
  }, [satelliteOpacity[0]]);

  // Initialize overlay layers (same as base layers but for overlaying)
  const initializeOverlayLayers = useCallback((leaflet: any) => {
    const layers = {
      osm: leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        opacity: overlayOpacity[0] / 100
      }),
      satellite: leaflet.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: '© Google',
        maxZoom: 20,
        opacity: overlayOpacity[0] / 100
      }),
      topographic: leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19,
        opacity: overlayOpacity[0] / 100
      }),
      dark: leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© CARTO',
        maxZoom: 19,
        opacity: overlayOpacity[0] / 100
      })
    };
    
    setOverlayLayers(layers);
    return layers;
  }, [overlayOpacity[0]]);

  useEffect(() => {
    if (L && mapRef.current && !map) {
      try {
        // Initialize map centered on Abu Dhabi
        const mapInstance = L.map(mapRef.current, {
          center: [24.4539, 54.3773], // Abu Dhabi coordinates
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: false
        });

        // Initialize and add base layers
        const layers = initializeBaseLayers(L);
        const overlays = initializeOverlayLayers(L);
        layers.osm.addTo(mapInstance); // Default layer

        setMap(mapInstance);
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    }
  }, [L, map, initializeBaseLayers, initializeOverlayLayers]);

  // Handle base layer switching from sidebar
  useEffect(() => {
    if (!map || !baseLayers) return;
    
    // Remove current base layer
    Object.values(baseLayers).forEach((layer: any) => {
      map.removeLayer(layer);
    });
    
    // Add new base layer
    const newLayer = baseLayers[baseLayer];
    if (newLayer) {
      newLayer.addTo(map);
    }
  }, [baseLayer, map, baseLayers]);

  // Update satellite opacity
  useEffect(() => {
    if (baseLayer === 'satellite' && baseLayers.satellite) {
      baseLayers.satellite.setOpacity(satelliteOpacity[0] / 100);
    }
  }, [satelliteOpacity, baseLayers, baseLayer]);

  // Handle overlay layer changes
  useEffect(() => {
    if (!map || !overlayLayers) return;
    
    // Remove current overlay layer
    if (currentOverlayLayer) {
      map.removeLayer(currentOverlayLayer);
      setCurrentOverlayLayer(null);
    }
    
    // Add new overlay layer if specified
    if (overlayLayer && overlayLayers[overlayLayer]) {
      const newOverlay = overlayLayers[overlayLayer];
      newOverlay.addTo(map);
      setCurrentOverlayLayer(newOverlay);
    }
  }, [overlayLayer, map, overlayLayers]);

  // Update overlay opacity
  useEffect(() => {
    if (currentOverlayLayer) {
      currentOverlayLayer.setOpacity(overlayOpacity[0] / 100);
    }
  }, [overlayOpacity, currentOverlayLayer]);

  // Cleanup pending updates on unmount
  useEffect(() => {
    return () => {
      pendingUpdatesRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      pendingUpdatesRef.current = [];
    };
  }, []);

  // Clear pending updates when measurement mode changes
  useEffect(() => {
    if (!measurementMode) {
      pendingUpdatesRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      pendingUpdatesRef.current = [];
    }
  }, [measurementMode]);

  // Set up map click handler
  useEffect(() => {
    if (map && handleMapClick) {
      map.off('click');
      map.on('click', handleMapClick);

      return () => {
        map.off('click', handleMapClick);
      };
    }
  }, [map, handleMapClick]);

  // Simple area calculation using shoelace formula
  const calculatePolygonArea = (coordinates: [number, number][]): number => {
    if (coordinates.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < coordinates.length; i++) {
      const j = (i + 1) % coordinates.length;
      area += coordinates[i][0] * coordinates[j][1];
      area -= coordinates[j][0] * coordinates[i][1];
    }
    area = Math.abs(area) / 2;
    
    // Convert from decimal degrees to approximate square meters
    const avgLat = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length;
    const latToMeters = 111320; // meters per degree latitude
    const lonToMeters = 111320 * Math.cos(avgLat * Math.PI / 180); // adjust for longitude
    
    return area * latToMeters * lonToMeters;
  };

  // Methods exposed via ref
  const finishDrawing = useCallback(() => {
    onDrawingModeChange(false);
    setIsDrawingComplete(true);
    
    if (currentPolygon.length >= 3) {
      const area = calculatePolygonArea(currentPolygon);
      const polygonData: Polygon = {
        id: Date.now().toString(),
        coordinates: currentPolygon,
        area: area
      };
      onPolygonChange(polygonData);
      
      // Remove temporary markers and replace with final polygon
      setDrawnLayers(prevLayers => {
        const markers = prevLayers.filter(layer => layer instanceof L.Marker);
        const tempPolygons = prevLayers.filter(layer => layer._isTemporary);
        
        // Remove markers and temp polygons
        [...markers, ...tempPolygons].forEach(layer => {
          map.removeLayer(layer);
        });
        
        // Add final polygon
        const finalPolygon = L.polygon(currentPolygon, {
          color: '#22c55e',
          fillColor: '#22c55e',
          fillOpacity: 0.3,
          weight: 2
        }).addTo(map);
        
        return [finalPolygon];
      });
    }
    
    setCurrentPolygon([]);
  }, [currentPolygon, onDrawingModeChange, onPolygonChange, setCurrentPolygon, map, L]);

  const clearMap = useCallback(() => {
    if (map) {
      // Get current layers to avoid stale closure
      setDrawnLayers(currentLayers => {
        if (currentLayers.length > 0) {
          currentLayers.forEach(layer => {
            map.removeLayer(layer);
          });
        }
        return [];
      });
    }
    setCurrentPolygon([]);
    if (drawingMode) {
      onDrawingModeChange(false);
    }
    setLastAutoZoomedPolygonId(null); // Reset auto-zoom tracking when clearing map
    onPolygonChange(null);
  }, [map, setCurrentPolygon, drawingMode, onDrawingModeChange, onPolygonChange]);

  const clearMeasurements = useCallback(() => {
    // Clear pending timeouts
    pendingUpdatesRef.current.forEach(timeoutId => clearTimeout(timeoutId));
    pendingUpdatesRef.current = [];
    
    if (map) {
      setMeasurementLayers(currentLayers => {
        if (currentLayers.length > 0) {
          currentLayers.forEach(layer => {
            map.removeLayer(layer);
          });
        }
        return [];
      });
    }
    setCurrentMeasurement([]);
    if (measurementMode) {
      onMeasurementModeChange(null);
    }
    onMeasurementResult(null);
  }, [map, measurementMode, onMeasurementModeChange, onMeasurementResult]);

  // Manual zoom to polygon (doesn't update auto-zoom tracking)
  const manualZoomToPolygon = useCallback((polygon: Polygon) => {
    if (!map || !L || !polygon.coordinates.length) return;
    
    try {
      const bounds = L.latLngBounds(polygon.coordinates);
      map.fitBounds(bounds, { 
        padding: [50, 50],
        maxZoom: 18
      });
    } catch (error) {
      console.error('Error fitting bounds:', error);
    }
  }, [map, L]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    finishDrawing,
    clearMap,
    clearMeasurements,
    zoomToPolygon: manualZoomToPolygon // Use manual zoom for external calls
  }), [finishDrawing, clearMap, clearMeasurements, manualZoomToPolygon]);

  const getLayerIcon = (layerType: string) => {
    switch (layerType) {
      case 'osm': return '🗺️';
      case 'satellite': return '🛰️';
      case 'topographic': return '🏔️';
      case 'dark': return '🌙';
      default: return '🗺️';
    }
  };

  const getLayerName = (layerType: string) => {
    switch (layerType) {
      case 'osm': return 'Street Map';
      case 'satellite': return 'Satellite';
      case 'topographic': return 'Topographic';
      case 'dark': return 'Dark Mode';
      default: return 'Street Map';
    }
  };

  if (isLoading) {
    return (
      <Card className="flex-1 p-4">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 h-full">
      {/* Map Container */}
      <div
        ref={mapRef}
        className="w-full h-full border border-border rounded-lg bg-muted relative"
        style={{
          cursor: drawingMode || measurementMode ? 'crosshair' : 'default'
        }}
      >
        {/* Current Layer Indicator */}
        <div className="absolute top-4 left-4 z-[1000] space-y-2">
          <Badge variant="secondary" className="flex items-center gap-1 bg-background/90 backdrop-blur-sm">
            <span>{getLayerIcon(baseLayer)}</span>
            {getLayerName(baseLayer)}
            {overlayLayer && <span className="text-xs">+ {getLayerName(overlayLayer)}</span>}
          </Badge>
        </div>

        {/* Drawing Mode Indicator */}
        {drawingMode && (
          <div className="absolute top-4 right-4 z-[1000]">
            <Badge className="bg-blue-600 text-white animate-pulse">
              Drawing Mode Active
            </Badge>
          </div>
        )}

        {/* Measurement Mode Indicator */}
        {measurementMode && (
          <div className="absolute top-4 right-4 z-[1000]">
            <Badge className={`${measurementMode === 'distance' ? 'bg-red-600' : 'bg-teal-600'} text-white animate-pulse`}>
              {measurementMode === 'distance' ? 'Distance' : 'Area'} Measurement Active
            </Badge>
          </div>
        )}

        {/* Auto-Zoom Notification */}
        {showAutoZoomNotification && (
          <div className="absolute top-16 left-4 z-[1000]">
            <Badge className="bg-blue-600 text-white animate-fade-in-out">
              🎯 Auto-zoomed to imported area - You can now zoom freely
            </Badge>
          </div>
        )}

        {/* Imported Area Indicator */}
        {selectedPolygon && !drawingMode && !measurementMode && selectedPolygon.id.startsWith('imported-') && (
          <div className="absolute bottom-4 right-4 z-[1000]">
            <Badge className="bg-green-600 text-white">
              📁 Imported Area
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
});

MapComponent.displayName = 'MapComponent';

export type { MeasurementResult };