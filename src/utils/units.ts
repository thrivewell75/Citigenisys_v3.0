// Comprehensive unit conversion utilities for the UDAT app

export interface UnitConversion {
  primary: string;
  secondary?: string;
  full: string;
}

// Distance conversions
export const convertDistance = (meters: number, useImperial: boolean): UnitConversion => {
  if (useImperial) {
    const feet = meters * 3.28084;
    const yards = feet / 3;
    const miles = meters / 1609.34;
    
    if (miles >= 1) {
      return {
        primary: `${miles.toFixed(2)} mi`,
        secondary: `${feet.toFixed(0)} ft`,
        full: `${miles.toFixed(2)} miles (${feet.toFixed(0)} feet)`
      };
    } else if (yards >= 100) {
      return {
        primary: `${yards.toFixed(0)} yd`,
        secondary: `${feet.toFixed(0)} ft`,
        full: `${yards.toFixed(0)} yards (${feet.toFixed(0)} feet)`
      };
    } else {
      return {
        primary: `${feet.toFixed(1)} ft`,
        secondary: `${yards.toFixed(1)} yd`,
        full: `${feet.toFixed(1)} feet (${yards.toFixed(1)} yards)`
      };
    }
  } else {
    const kilometers = meters / 1000;
    
    if (meters >= 1000) {
      return {
        primary: `${kilometers.toFixed(2)} km`,
        secondary: `${meters.toFixed(0)} m`,
        full: `${kilometers.toFixed(2)} kilometers (${meters.toFixed(0)} meters)`
      };
    } else {
      return {
        primary: `${meters.toFixed(1)} m`,
        secondary: `${kilometers.toFixed(3)} km`,
        full: `${meters.toFixed(1)} meters (${kilometers.toFixed(3)} kilometers)`
      };
    }
  }
};

// Area conversions
export const convertArea = (squareMeters: number, useImperial: boolean): UnitConversion => {
  if (useImperial) {
    const squareFeet = squareMeters * 10.7639;
    const acres = squareMeters * 0.000247105;
    const squareMiles = squareMeters / 2589988.11;
    
    if (squareMiles >= 1) {
      return {
        primary: `${squareMiles.toFixed(3)} sq mi`,
        secondary: `${acres.toFixed(1)} ac`,
        full: `${squareMiles.toFixed(3)} square miles (${acres.toFixed(1)} acres)`
      };
    } else if (acres >= 1) {
      return {
        primary: `${acres.toFixed(2)} ac`,
        secondary: `${squareFeet.toLocaleString(undefined, {maximumFractionDigits: 0})} sq ft`,
        full: `${acres.toFixed(2)} acres (${squareFeet.toLocaleString(undefined, {maximumFractionDigits: 0})} square feet)`
      };
    } else {
      return {
        primary: `${squareFeet.toFixed(0)} sq ft`,
        secondary: `${acres.toFixed(4)} ac`,
        full: `${squareFeet.toFixed(0)} square feet (${acres.toFixed(4)} acres)`
      };
    }
  } else {
    const hectares = squareMeters / 10000;
    const squareKilometers = squareMeters / 1000000;
    
    if (squareKilometers >= 1) {
      return {
        primary: `${squareKilometers.toFixed(3)} km²`,
        secondary: `${hectares.toFixed(1)} ha`,
        full: `${squareKilometers.toFixed(3)} square kilometers (${hectares.toFixed(1)} hectares)`
      };
    } else if (hectares >= 1) {
      return {
        primary: `${hectares.toFixed(2)} ha`,
        secondary: `${squareMeters.toLocaleString()} m²`,
        full: `${hectares.toFixed(2)} hectares (${squareMeters.toLocaleString()} square meters)`
      };
    } else {
      return {
        primary: `${squareMeters.toFixed(1)} m²`,
        secondary: `${hectares.toFixed(4)} ha`,
        full: `${squareMeters.toFixed(1)} square meters (${hectares.toFixed(4)} hectares)`
      };
    }
  }
};

// Density conversions
export const convertDensity = (
  unitsPerHectare: number, 
  peoplePerHectare: number, 
  useImperial: boolean
): { units: UnitConversion; people: UnitConversion } => {
  if (useImperial) {
    const unitsPerAcre = unitsPerHectare * 2.47105;
    const peoplePerAcre = peoplePerHectare * 2.47105;
    
    return {
      units: {
        primary: `${unitsPerAcre.toFixed(1)} units/ac`,
        secondary: `${unitsPerHectare.toFixed(1)} units/ha`,
        full: `${unitsPerAcre.toFixed(1)} units per acre (${unitsPerHectare.toFixed(1)} units per hectare)`
      },
      people: {
        primary: `${peoplePerAcre.toFixed(1)} people/ac`,
        secondary: `${peoplePerHectare.toFixed(1)} people/ha`,
        full: `${peoplePerAcre.toFixed(1)} people per acre (${peoplePerHectare.toFixed(1)} people per hectare)`
      }
    };
  } else {
    const unitsPerAcre = unitsPerHectare * 2.47105;
    const peoplePerAcre = peoplePerHectare * 2.47105;
    
    return {
      units: {
        primary: `${unitsPerHectare.toFixed(1)} units/ha`,
        secondary: `${unitsPerAcre.toFixed(1)} units/ac`,
        full: `${unitsPerHectare.toFixed(1)} units per hectare (${unitsPerAcre.toFixed(1)} units per acre)`
      },
      people: {
        primary: `${peoplePerHectare.toFixed(1)} people/ha`,
        secondary: `${peoplePerAcre.toFixed(1)} people/ac`,
        full: `${peoplePerHectare.toFixed(1)} people per hectare (${peoplePerAcre.toFixed(1)} people per acre)`
      }
    };
  }
};

// Format area with proper imperial/metric display
export const formatArea = (squareMeters: number, useImperial: boolean = false): string => {
  const conversion = convertArea(squareMeters, useImperial);
  return conversion.full;
};

// Format distance with proper imperial/metric display
export const formatDistance = (meters: number, useImperial: boolean = false): string => {
  const conversion = convertDistance(meters, useImperial);
  return conversion.full;
};

// Get unit label for display
export const getAreaUnitLabel = (useImperial: boolean): string => {
  return useImperial ? 'acres' : 'hectares';
};

export const getDistanceUnitLabel = (useImperial: boolean): string => {
  return useImperial ? 'feet' : 'meters';
};

// Quick conversion functions for simple displays
export const quickAreaConversion = (squareMeters: number, useImperial: boolean): string => {
  if (useImperial) {
    const acres = squareMeters * 0.000247105;
    if (acres >= 1) {
      return `${acres.toFixed(2)} ac`;
    } else {
      const squareFeet = squareMeters * 10.7639;
      return `${squareFeet.toFixed(0)} sq ft`;
    }
  } else {
    const hectares = squareMeters / 10000;
    if (hectares >= 1) {
      return `${hectares.toFixed(2)} ha`;
    } else {
      return `${squareMeters.toFixed(1)} m²`;
    }
  }
};

export const quickDistanceConversion = (meters: number, useImperial: boolean): string => {
  if (useImperial) {
    const miles = meters / 1609.34;
    if (miles >= 1) {
      return `${miles.toFixed(2)} mi`;
    } else {
      const feet = meters * 3.28084;
      const yards = feet / 3;
      if (yards >= 100) {
        return `${yards.toFixed(0)} yd`;
      } else {
        return `${feet.toFixed(1)} ft`;
      }
    }
  } else {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    } else {
      return `${meters.toFixed(1)} m`;
    }
  }
};