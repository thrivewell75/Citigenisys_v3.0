// Spatial data export utilities for GeoJSON, KML, and SHP formats

export interface PolygonData {
  id: string;
  coordinates: [number, number][];
  area: number;
  name?: string;
  description?: string;
}

/**
 * Converts polygon to GeoJSON format
 * @param polygon - Polygon data
 * @param properties - Additional properties to include
 * @returns GeoJSON object
 */
export function convertToGeoJSON(polygon: PolygonData, properties: Record<string, any> = {}): object {
  // Ensure the polygon is closed (first point = last point)
  const coordinates = [...polygon.coordinates];
  if (coordinates.length > 0) {
    const firstPoint = coordinates[0];
    const lastPoint = coordinates[coordinates.length - 1];
    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
      coordinates.push(firstPoint);
    }
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: polygon.id,
          name: polygon.name || `Area ${polygon.id}`,
          description: polygon.description || `Development area with ${polygon.area.toFixed(2)} square meters`,
          area_sqm: polygon.area,
          area_hectares: polygon.area / 10000,
          area_acres: polygon.area * 0.000247105,
          created_date: new Date().toISOString(),
          ...properties
        },
        geometry: {
          type: "Polygon",
          coordinates: [coordinates]
        }
      }
    ]
  };
}

/**
 * Converts polygon to KML format
 * @param polygon - Polygon data
 * @param properties - Additional properties to include
 * @returns KML string
 */
export function convertToKML(polygon: PolygonData, properties: Record<string, any> = {}): string {
  // Ensure the polygon is closed
  const coordinates = [...polygon.coordinates];
  if (coordinates.length > 0) {
    const firstPoint = coordinates[0];
    const lastPoint = coordinates[coordinates.length - 1];
    if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
      coordinates.push(firstPoint);
    }
  }

  // Convert coordinates to KML format (lon,lat,alt)
  const kmlCoordinates = coordinates
    .map(coord => `${coord[0]},${coord[1]},0`)
    .join(' ');

  const name = polygon.name || `Development Area ${polygon.id}`;
  const description = polygon.description || `
    <![CDATA[
      <h3>Development Area Analysis</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><td><b>Area ID:</b></td><td>${polygon.id}</td></tr>
        <tr><td><b>Area (m²):</b></td><td>${polygon.area.toFixed(2)}</td></tr>
        <tr><td><b>Area (hectares):</b></td><td>${(polygon.area / 10000).toFixed(4)}</td></tr>
        <tr><td><b>Area (acres):</b></td><td>${(polygon.area * 0.000247105).toFixed(4)}</td></tr>
        <tr><td><b>Perimeter Points:</b></td><td>${polygon.coordinates.length}</td></tr>
        <tr><td><b>Created:</b></td><td>${new Date().toLocaleString()}</td></tr>
      </table>
    ]]>
  `;

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Urban Development Assessment - ${name}</name>
    <description>Exported from Urban Development Assessment Tool (UDAT)</description>
    <Style id="developmentAreaStyle">
      <LineStyle>
        <color>ff0000ff</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>330000ff</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>${name}</name>
      <description>${description}</description>
      <styleUrl>#developmentAreaStyle</styleUrl>
      <Polygon>
        <extrude>1</extrude>
        <altitudeMode>relativeToGround</altitudeMode>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${kmlCoordinates}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>
  </Document>
</kml>`;
}

/**
 * Creates a simplified SHP-like format (actually a ZIP with multiple files)
 * Note: This creates a basic shapefile structure. For full SHP support, 
 * a specialized library would be needed.
 * @param polygon - Polygon data
 * @param properties - Additional properties to include
 * @returns Object with file contents for download
 */
export function convertToShapefileData(polygon: PolygonData, properties: Record<string, any> = {}): {
  prj: string;
  dbf: string;
  shp: string;
  readme: string;
} {
  // WGS84 projection definition
  const prjContent = `GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]`;

  // DBF header and data (simplified)
  const dbfContent = `DBF File for ${polygon.name || `Area ${polygon.id}`}
Field definitions:
- ID: ${polygon.id}
- NAME: ${polygon.name || `Development Area ${polygon.id}`}
- AREA_SQM: ${polygon.area.toFixed(2)}
- AREA_HA: ${(polygon.area / 10000).toFixed(4)}
- AREA_ACRES: ${(polygon.area * 0.000247105).toFixed(4)}
- POINTS: ${polygon.coordinates.length}
- CREATED: ${new Date().toISOString()}

Note: This is a simplified representation. Use GIS software to properly import spatial data.`;

  // SHP content description (actual SHP files are binary)
  const shpContent = `Shapefile Description for ${polygon.name || `Area ${polygon.id}`}

Geometry Type: Polygon
Coordinate System: WGS84 (EPSG:4326)

Coordinates (Longitude, Latitude):
${polygon.coordinates.map((coord, index) => `Point ${index + 1}: ${coord[0]}, ${coord[1]}`).join('\n')}

Bounding Box:
West: ${Math.min(...polygon.coordinates.map(c => c[0]))}
East: ${Math.max(...polygon.coordinates.map(c => c[0]))}
South: ${Math.min(...polygon.coordinates.map(c => c[1]))}
North: ${Math.max(...polygon.coordinates.map(c => c[1]))}

Note: This is a text representation. For true shapefile format, use specialized GIS software.`;

  const readmeContent = `Urban Development Assessment Tool - Shapefile Export
================================================================

This archive contains spatial data exported from the Urban Development Assessment Tool (UDAT).

Files included:
- area.prj: Projection definition (WGS84)
- area.dbf: Attribute data description
- area.shp: Geometry data description  
- README.txt: This file

Note: These are simplified text representations of shapefile components.
For full GIS compatibility, we recommend using the GeoJSON export format.

Area Information:
- ID: ${polygon.id}
- Area: ${polygon.area.toFixed(2)} square meters
- Area: ${(polygon.area / 10000).toFixed(4)} hectares  
- Area: ${(polygon.area * 0.000247105).toFixed(4)} acres
- Points: ${polygon.coordinates.length}
- Exported: ${new Date().toLocaleString()}

To use this data in GIS software:
1. Use the GeoJSON export for best compatibility
2. Import coordinates manually using the values in area.shp
3. Set coordinate system to WGS84 (EPSG:4326)

Urban Development Assessment Tool (UDAT)
Generated on ${new Date().toLocaleString()}`;

  return {
    prj: prjContent,
    dbf: dbfContent,
    shp: shpContent,
    readme: readmeContent
  };
}

/**
 * Downloads a file with given content
 * @param content - File content
 * @param filename - Name of the file
 * @param mimeType - MIME type of the file
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates and downloads a ZIP file with multiple files
 * Note: This creates individual files instead of a real ZIP due to browser limitations
 * @param files - Object with filename as key and content as value
 * @param baseName - Base name for the files
 */
export function downloadMultipleFiles(files: Record<string, string>, baseName: string): void {
  Object.entries(files).forEach(([filename, content]) => {
    downloadFile(content, `${baseName}_${filename}`, 'text/plain');
  });
}

/**
 * Main export function that handles all formats
 * @param polygon - Polygon data
 * @param format - Export format
 * @param properties - Additional properties
 */
export function exportPolygon(
  polygon: PolygonData, 
  format: 'geojson' | 'kml' | 'shp',
  properties: Record<string, any> = {}
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const baseName = `udat_area_${polygon.id}_${timestamp}`;

  switch (format) {
    case 'geojson':
      const geoJson = convertToGeoJSON(polygon, properties);
      downloadFile(
        JSON.stringify(geoJson, null, 2),
        `${baseName}.geojson`,
        'application/geo+json'
      );
      break;

    case 'kml':
      const kml = convertToKML(polygon, properties);
      downloadFile(
        kml,
        `${baseName}.kml`,
        'application/vnd.google-earth.kml+xml'
      );
      break;

    case 'shp':
      const shapefileData = convertToShapefileData(polygon, properties);
      downloadMultipleFiles(
        {
          'area.prj': shapefileData.prj,
          'area.dbf': shapefileData.dbf,
          'area.shp': shapefileData.shp,
          'README.txt': shapefileData.readme
        },
        baseName
      );
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Validates polygon data before export
 * @param polygon - Polygon data to validate
 * @returns Validation result
 */
export function validatePolygonForExport(polygon: PolygonData): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if polygon has enough points
  if (polygon.coordinates.length < 3) {
    errors.push('Polygon must have at least 3 points');
  }

  // Check if coordinates are valid
  polygon.coordinates.forEach((coord, index) => {
    if (!Array.isArray(coord) || coord.length !== 2) {
      errors.push(`Invalid coordinate at index ${index}`);
    } else {
      const [lon, lat] = coord;
      if (typeof lon !== 'number' || typeof lat !== 'number') {
        errors.push(`Invalid coordinate values at index ${index}`);
      }
      if (lon < -180 || lon > 180) {
        errors.push(`Longitude out of range at index ${index}: ${lon}`);
      }
      if (lat < -90 || lat > 90) {
        errors.push(`Latitude out of range at index ${index}: ${lat}`);
      }
    }
  });

  // Check for very small areas
  if (polygon.area < 1) {
    warnings.push('Very small area detected (< 1 m²). Check coordinate precision.');
  }

  // Check for very large areas
  if (polygon.area > 1000000000) { // 1,000 km²
    warnings.push('Very large area detected. Verify coordinates are correct.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}