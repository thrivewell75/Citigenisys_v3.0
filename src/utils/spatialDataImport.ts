// Spatial data import utilities for GeoJSON, KML, and SHP formats

import { PolygonData } from './spatialDataExport';

export interface ImportedPolygon {
  id: string;
  coordinates: [number, number][];
  area: number;
  name?: string;
  description?: string;
  properties?: Record<string, any>;
}

export interface ImportResult {
  success: boolean;
  polygons: ImportedPolygon[];
  errors: string[];
  warnings: string[];
  metadata?: {
    format: 'geojson' | 'kml' | 'shp';
    coordinateSystem?: string;
    totalFeatures: number;
    importedFeatures: number;
  };
}

/**
 * Calculates the area of a polygon using the shoelace formula
 * Assumes coordinates are in WGS84 (degrees)
 * @param coordinates - Array of [longitude, latitude] coordinate pairs
 * @returns Area in square meters (approximate)
 */
function calculatePolygonArea(coordinates: [number, number][]): number {
  if (coordinates.length < 3) return 0;
  
  // Convert to approximate planar coordinates for area calculation
  // This is a simplified approach - for precise calculations, proper projection would be needed
  const R = 6371000; // Earth's radius in meters
  
  let area = 0;
  const n = coordinates.length;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[j];
    
    // Convert to radians
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const deltaLonRad = (lon2 - lon1) * Math.PI / 180;
    
    // Use spherical excess formula for area calculation
    area += deltaLonRad * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }
  
  area = Math.abs(area) * R * R / 2;
  return area;
}

/**
 * Validates and normalizes coordinates
 * @param coords - Raw coordinate array
 * @returns Validated coordinates or null if invalid
 */
function validateCoordinates(coords: any[]): [number, number][] | null {
  if (!Array.isArray(coords) || coords.length < 3) {
    return null;
  }
  
  const validCoords: [number, number][] = [];
  
  for (const coord of coords) {
    if (!Array.isArray(coord) || coord.length < 2) {
      return null;
    }
    
    const [lon, lat] = coord;
    if (typeof lon !== 'number' || typeof lat !== 'number') {
      return null;
    }
    
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      return null;
    }
    
    validCoords.push([lon, lat]);
  }
  
  return validCoords;
}

/**
 * Parses GeoJSON content
 * @param content - GeoJSON string content
 * @returns Import result
 */
export function parseGeoJSON(content: string): ImportResult {
  const result: ImportResult = {
    success: false,
    polygons: [],
    errors: [],
    warnings: []
  };
  
  try {
    const geoJson = JSON.parse(content);
    
    if (!geoJson || typeof geoJson !== 'object') {
      result.errors.push('Invalid GeoJSON: Not a valid JSON object');
      return result;
    }
    
    // Handle both FeatureCollection and single Feature
    let features: any[] = [];
    
    if (geoJson.type === 'FeatureCollection') {
      features = geoJson.features || [];
    } else if (geoJson.type === 'Feature') {
      features = [geoJson];
    } else if (geoJson.type === 'Polygon') {
      // Direct geometry object
      features = [{
        type: 'Feature',
        geometry: geoJson,
        properties: {}
      }];
    } else {
      result.errors.push(`Unsupported GeoJSON type: ${geoJson.type}`);
      return result;
    }
    
    let importedCount = 0;
    
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      
      if (!feature.geometry || feature.geometry.type !== 'Polygon') {
        result.warnings.push(`Feature ${i + 1}: Not a polygon geometry, skipped`);
        continue;
      }
      
      const coordinates = feature.geometry.coordinates?.[0]; // Exterior ring only
      if (!coordinates) {
        result.warnings.push(`Feature ${i + 1}: No coordinates found`);
        continue;
      }
      
      const validCoords = validateCoordinates(coordinates);
      if (!validCoords) {
        result.warnings.push(`Feature ${i + 1}: Invalid coordinates`);
        continue;
      }
      
      const area = calculatePolygonArea(validCoords);
      const properties = feature.properties || {};
      
      const polygon: ImportedPolygon = {
        id: `imported-${Date.now()}-${i}`,
        coordinates: validCoords,
        area,
        name: properties.name || properties.Name || `Imported Polygon ${i + 1}`,
        description: properties.description || properties.Description || `Imported from GeoJSON`,
        properties
      };
      
      result.polygons.push(polygon);
      importedCount++;
    }
    
    result.success = importedCount > 0;
    result.metadata = {
      format: 'geojson',
      coordinateSystem: 'WGS84 (EPSG:4326)',
      totalFeatures: features.length,
      importedFeatures: importedCount
    };
    
    if (importedCount === 0) {
      result.errors.push('No valid polygon features found in GeoJSON');
    }
    
  } catch (error) {
    result.errors.push(`GeoJSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return result;
}

/**
 * Parses KML content
 * @param content - KML string content
 * @returns Import result
 */
export function parseKML(content: string): ImportResult {
  const result: ImportResult = {
    success: false,
    polygons: [],
    errors: [],
    warnings: []
  };
  
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, 'text/xml');
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      result.errors.push('Invalid KML: XML parsing error');
      return result;
    }
    
    // Find all Polygon elements
    const polygons = xmlDoc.querySelectorAll('Polygon');
    let importedCount = 0;
    
    for (let i = 0; i < polygons.length; i++) {
      const polygonElement = polygons[i];
      
      // Get the outer boundary coordinates
      const outerBoundary = polygonElement.querySelector('outerBoundaryIs LinearRing coordinates, outerBoundaryIs coordinates');
      if (!outerBoundary) {
        result.warnings.push(`Polygon ${i + 1}: No outer boundary coordinates found`);
        continue;
      }
      
      const coordText = outerBoundary.textContent?.trim();
      if (!coordText) {
        result.warnings.push(`Polygon ${i + 1}: Empty coordinates`);
        continue;
      }
      
      // Parse KML coordinates (lon,lat,alt format, space-separated)
      const coordPairs = coordText.split(/\s+/).filter(pair => pair.length > 0);
      const coordinates: [number, number][] = [];
      
      for (const pair of coordPairs) {
        const parts = pair.split(',');
        if (parts.length >= 2) {
          const lon = parseFloat(parts[0]);
          const lat = parseFloat(parts[1]);
          
          if (!isNaN(lon) && !isNaN(lat)) {
            coordinates.push([lon, lat]);
          }
        }
      }
      
      const validCoords = validateCoordinates(coordinates);
      if (!validCoords) {
        result.warnings.push(`Polygon ${i + 1}: Invalid coordinates`);
        continue;
      }
      
      // Try to find associated Placemark for name and description
      const placemark = polygonElement.closest('Placemark');
      const name = placemark?.querySelector('name')?.textContent || `Imported Polygon ${i + 1}`;
      const description = placemark?.querySelector('description')?.textContent || 'Imported from KML';
      
      const area = calculatePolygonArea(validCoords);
      
      const polygon: ImportedPolygon = {
        id: `imported-kml-${Date.now()}-${i}`,
        coordinates: validCoords,
        area,
        name,
        description,
        properties: {
          source: 'KML',
          originalIndex: i
        }
      };
      
      result.polygons.push(polygon);
      importedCount++;
    }
    
    result.success = importedCount > 0;
    result.metadata = {
      format: 'kml',
      coordinateSystem: 'WGS84 (EPSG:4326)',
      totalFeatures: polygons.length,
      importedFeatures: importedCount
    };
    
    if (importedCount === 0) {
      result.errors.push('No valid polygon features found in KML');
    }
    
  } catch (error) {
    result.errors.push(`KML parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return result;
}

/**
 * Parses Shapefile content (simplified - handles text-based SHP description files)
 * @param content - Shapefile description content
 * @returns Import result
 */
export function parseShapefile(content: string): ImportResult {
  const result: ImportResult = {
    success: false,
    polygons: [],
    errors: [],
    warnings: []
  };
  
  try {
    // This is a simplified parser for the text-based shapefile descriptions we generate
    // Real shapefile parsing would require binary parsing libraries
    
    const lines = content.split('\n');
    let currentCoordinates: [number, number][] = [];
    let coordinateSection = false;
    let polygonCount = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.includes('Coordinates (Longitude, Latitude):')) {
        coordinateSection = true;
        continue;
      }
      
      if (coordinateSection && trimmedLine.startsWith('Point ')) {
        const coordMatch = trimmedLine.match(/Point \d+: (-?\d+\.?\d*), (-?\d+\.?\d*)/);
        if (coordMatch) {
          const lon = parseFloat(coordMatch[1]);
          const lat = parseFloat(coordMatch[2]);
          if (!isNaN(lon) && !isNaN(lat)) {
            currentCoordinates.push([lon, lat]);
          }
        }
      }
      
      if (trimmedLine.includes('Bounding Box:') && currentCoordinates.length > 0) {
        coordinateSection = false;
        
        const validCoords = validateCoordinates(currentCoordinates);
        if (validCoords && validCoords.length >= 3) {
          const area = calculatePolygonArea(validCoords);
          
          const polygon: ImportedPolygon = {
            id: `imported-shp-${Date.now()}-${polygonCount}`,
            coordinates: validCoords,
            area,
            name: `Imported Shapefile Polygon ${polygonCount + 1}`,
            description: 'Imported from Shapefile description',
            properties: {
              source: 'Shapefile',
              originalIndex: polygonCount
            }
          };
          
          result.polygons.push(polygon);
          polygonCount++;
        }
        
        currentCoordinates = [];
      }
    }
    
    result.success = polygonCount > 0;
    result.metadata = {
      format: 'shp',
      coordinateSystem: 'WGS84 (EPSG:4326)',
      totalFeatures: polygonCount,
      importedFeatures: polygonCount
    };
    
    if (polygonCount === 0) {
      result.errors.push('No valid polygon coordinates found in shapefile description');
      result.warnings.push('Note: This parser only supports text-based shapefile descriptions, not binary .shp files');
    }
    
  } catch (error) {
    result.errors.push(`Shapefile parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return result;
}

/**
 * Detects file format based on content
 * @param content - File content
 * @param filename - Optional filename for format detection
 * @returns Detected format or null
 */
export function detectFormat(content: string, filename?: string): 'geojson' | 'kml' | 'shp' | null {
  // Check file extension first
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop();
    if (ext === 'geojson' || ext === 'json') return 'geojson';
    if (ext === 'kml') return 'kml';
    if (ext === 'shp' || ext === 'txt') return 'shp';
  }
  
  // Check content patterns
  const trimmed = content.trim();
  
  // GeoJSON detection
  if (trimmed.startsWith('{') && (
    trimmed.includes('"type":"FeatureCollection"') ||
    trimmed.includes('"type":"Feature"') ||
    trimmed.includes('"type":"Polygon"')
  )) {
    return 'geojson';
  }
  
  // KML detection
  if (trimmed.includes('<?xml') && (
    trimmed.includes('<kml') ||
    trimmed.includes('<Polygon') ||
    trimmed.includes('<coordinates')
  )) {
    return 'kml';
  }
  
  // Shapefile description detection
  if (trimmed.includes('Shapefile Description') || 
      trimmed.includes('Coordinates (Longitude, Latitude):') ||
      trimmed.includes('Bounding Box:')) {
    return 'shp';
  }
  
  return null;
}

/**
 * Main import function that handles multiple formats
 * @param file - File object to import
 * @returns Promise<ImportResult>
 */
export async function importSpatialFile(file: File): Promise<ImportResult> {
  const result: ImportResult = {
    success: false,
    polygons: [],
    errors: [],
    warnings: []
  };
  
  try {
    // Check file size (limit to 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      result.errors.push(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size is 10MB.`);
      return result;
    }
    
    // Read file content
    const content = await file.text();
    
    // Detect format
    const format = detectFormat(content, file.name);
    if (!format) {
      result.errors.push('Unsupported file format. Please upload a .geojson, .kml, or .shp file.');
      return result;
    }
    
    // Parse based on format
    let parseResult: ImportResult;
    
    switch (format) {
      case 'geojson':
        parseResult = parseGeoJSON(content);
        break;
      case 'kml':
        parseResult = parseKML(content);
        break;
      case 'shp':
        parseResult = parseShapefile(content);
        break;
      default:
        result.errors.push(`Unsupported format: ${format}`);
        return result;
    }
    
    return parseResult;
    
  } catch (error) {
    result.errors.push(`Import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return result;
  }
}

/**
 * Validates imported polygons for use in the application
 * @param polygons - Array of imported polygons
 * @returns Validation results
 */
export function validateImportedPolygons(polygons: ImportedPolygon[]): {
  valid: ImportedPolygon[];
  invalid: { polygon: ImportedPolygon; errors: string[] }[];
} {
  const valid: ImportedPolygon[] = [];
  const invalid: { polygon: ImportedPolygon; errors: string[] }[] = [];
  
  for (const polygon of polygons) {
    const errors: string[] = [];
    
    // Check minimum points
    if (polygon.coordinates.length < 3) {
      errors.push('Polygon must have at least 3 points');
    }
    
    // Check area
    if (polygon.area <= 0) {
      errors.push('Polygon area must be positive');
    }
    
    // Check for very large polygons (sanity check)
    const maxArea = 1000 * 1000000; // 1000 km²
    if (polygon.area > maxArea) {
      errors.push(`Polygon area too large: ${(polygon.area / 1000000).toFixed(2)} km²`);
    }
    
    // Check coordinate bounds
    for (const [lon, lat] of polygon.coordinates) {
      if (lon < -180 || lon > 180) {
        errors.push(`Invalid longitude: ${lon}`);
        break;
      }
      if (lat < -90 || lat > 90) {
        errors.push(`Invalid latitude: ${lat}`);
        break;
      }
    }
    
    if (errors.length === 0) {
      valid.push(polygon);
    } else {
      invalid.push({ polygon, errors });
    }
  }
  
  return { valid, invalid };
}