// Area formatting utilities for comprehensive unit display

export interface AreaUnits {
  primary: { value: number; unit: string; label: string };
  secondary: { value: number; unit: string; label: string };
  tertiary: { value: number; unit: string; label: string };
}

/**
 * Formats area in square meters to comprehensive metric units
 * @param areaInSquareMeters - Area in square meters (base unit)
 * @returns Object with square meters, hectares, and square kilometers
 */
export function formatMetricArea(areaInSquareMeters: number): AreaUnits {
  const squareMeters = areaInSquareMeters;
  const hectares = areaInSquareMeters / 10000;
  const squareKilometers = areaInSquareMeters / 1000000;

  return {
    primary: {
      value: squareMeters,
      unit: 'm²',
      label: 'Square Meters'
    },
    secondary: {
      value: hectares,
      unit: 'ha',
      label: 'Hectares'
    },
    tertiary: {
      value: squareKilometers,
      unit: 'km²',
      label: 'Square Kilometers'
    }
  };
}

/**
 * Formats area in square meters to comprehensive imperial units
 * @param areaInSquareMeters - Area in square meters (base unit)
 * @returns Object with square feet, acres, and square miles
 */
export function formatImperialArea(areaInSquareMeters: number): AreaUnits {
  const squareFeet = areaInSquareMeters * 10.7639;
  const acres = areaInSquareMeters * 0.000247105;
  const squareMiles = areaInSquareMeters * 0.000000386102;

  return {
    primary: {
      value: squareFeet,
      unit: 'ft²',
      label: 'Square Feet'
    },
    secondary: {
      value: acres,
      unit: 'acres',
      label: 'Acres'
    },
    tertiary: {
      value: squareMiles,
      unit: 'mi²',
      label: 'Square Miles'
    }
  };
}

/**
 * Gets the most appropriate unit for display based on value size
 * @param units - AreaUnits object
 * @returns The most appropriate unit for primary display
 */
export function getBestDisplayUnit(units: AreaUnits): { value: number; unit: string; label: string } {
  // For metric: use hectares if >= 1, otherwise square meters
  // For imperial: use acres if >= 1, otherwise square feet
  
  if (units.secondary.value >= 1) {
    return units.secondary; // hectares or acres
  } else if (units.primary.value >= 1) {
    return units.primary; // square meters or square feet
  } else {
    return units.tertiary; // square kilometers or square miles (for very large areas)
  }
}

/**
 * Formats a unit value with appropriate decimal places
 * @param value - Numeric value
 * @param unit - Unit string
 * @returns Formatted string with appropriate precision
 */
export function formatUnitValue(value: number, unit: string): string {
  if (value < 1) {
    return `${value.toFixed(4)} ${unit}`;
  } else if (value < 10) {
    return `${value.toFixed(2)} ${unit}`;
  } else if (value < 1000) {
    return `${value.toFixed(1)} ${unit}`;
  } else {
    return `${Math.round(value).toLocaleString()} ${unit}`;
  }
}

/**
 * Creates a comprehensive area display string
 * @param areaInSquareMeters - Area in square meters
 * @param useImperialUnits - Whether to use imperial units
 * @returns Formatted area display
 */
export function getComprehensiveAreaDisplay(areaInSquareMeters: number, useImperialUnits: boolean): {
  primary: string;
  secondary: string;
  tertiary: string;
  compact: string;
} {
  const units = useImperialUnits 
    ? formatImperialArea(areaInSquareMeters)
    : formatMetricArea(areaInSquareMeters);

  const primary = formatUnitValue(units.primary.value, units.primary.unit);
  const secondary = formatUnitValue(units.secondary.value, units.secondary.unit);
  const tertiary = formatUnitValue(units.tertiary.value, units.tertiary.unit);

  const bestUnit = getBestDisplayUnit(units);
  const compact = formatUnitValue(bestUnit.value, bestUnit.unit);

  return {
    primary,
    secondary,
    tertiary,
    compact
  };
}