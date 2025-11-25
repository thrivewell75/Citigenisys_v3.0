import { DevelopmentParameters } from './ParametersFormEnhanced';

export interface CalculationResults {
  // Area Breakdown
  totalArea: number;
  openSpaceArea: number;
  publicRealmArea: number;
  publicRealmPercent: number;
  residentialArea: number;
  commercialArea: number;
  institutionalArea: number;
  industrialArea: number;
  mixedUseArea: number;
  
  // GFA by Type
  residentialGFA: number;
  commercialGFA: number;
  institutionalGFA: number;
  industrialGFA: number;
  mixedUseGFA: number;
  mixedUseResidentialGFA: number;
  mixedUseCommercialGFA: number;
  mixedUseInstitutionalGFA: number;
  totalGFA: number;
  
  // Plot and Block Counts
  residentialPlots: number;
  commercialPlots: number;
  institutionalPlots: number;
  industrialPlots: number;
  mixedUsePlots: number;
  totalPlots: number;
  
  // NEW: Plot counts by unit type
  residentialStudioPlots: number;
  residentialOneBedPlots: number;
  residentialTwoBedPlots: number;
  residentialThreeBedPlots: number;
  residentialFourBedPlots: number;
  
  residentialBlocks: number;
  commercialBlocks: number;
  institutionalBlocks: number;
  industrialBlocks: number;
  mixedUseBlocks: number;
  totalBlocks: number;
  
  // Unit Distribution
  totalUnits: number;
  affordableUnits: number;
  marketRateUnits: number;
  executiveUnits: number;
  
  // Unit Mix
  studioUnits: number;
  oneBedUnits: number;
  twoBedUnits: number;
  threeBedUnits: number;
  fourBedUnits: number;
  
  // Mixed-Use Specific Units
  mixedUseStudioUnits: number;
  mixedUseOneBedUnits: number;
  mixedUseTwoBedUnits: number;
  mixedUseThreeBedUnits: number;
  mixedUseFourBedUnits: number;
  
  // Regular Residential Specific Units
  regularStudioUnits: number;
  regularOneBedUnits: number;
  regularTwoBedUnits: number;
  regularThreeBedUnits: number;
  regularFourBedUnits: number;
  
  // GFA Allocation
  mixedUseStudioGFA: number;
  mixedUseOneBedGFA: number;
  mixedUseTwoBedGFA: number;
  mixedUseThreeBedGFA: number;
  mixedUseFourBedGFA: number;
  regularStudioGFA: number;
  regularOneBedGFA: number;
  regularTwoBedGFA: number;
  regularThreeBedGFA: number;
  regularFourBedGFA: number;
  
  // NEW: GFA per plot
  residentialGFAperPlot: number;
  mixedUseGFAperPlot: number;
  
  // Population
  totalPopulation: number;
  adults: number;
  children: number;
  
  // Infrastructure
  totalParkingSpaces: number;
  residentParking: number;
  guestParking: number;
  disabledParking: number;
  
  // Density Metrics
  unitsPerHectare: number;
  peoplePerHectare: number;
  plotRatio: number;
  
  // FAR
  residentialFAR: number;
  commercialFAR: number;
  mixedUseFAR: number;
  institutionalFAR: number;
  industrialFAR: number;

  // PHASE 1A: ECONOMIC RESULTS
  // Construction Costs
  totalConstructionCost: number;
  residentialConstructionCost: number;
  commercialConstructionCost: number;
  mixedUseConstructionCost: number;
  institutionalConstructionCost: number;
  industrialConstructionCost: number;
  infrastructureCost: number;
  
  // Development Costs
  landAcquisitionCost: number;
  professionalFees: number;
  contingencyCost: number;
  marketingCost: number;
  totalDevelopmentCost: number;
  
  // Revenue
  totalRevenue: number;
  residentialRevenue: number;
  mixedUseRevenue: number;
  commercialRevenue: number;
  
  // Revenue Breakdown by Unit Type
  studioRevenue: number;
  oneBedRevenue: number;
  twoBedRevenue: number;
  threeBedRevenue: number;
  fourBedRevenue: number;
  mixedUseStudioRevenue: number;
  mixedUseOneBedRevenue: number;
  mixedUseTwoBedRevenue: number;
  mixedUseThreeBedRevenue: number;
  mixedUseFourBedRevenue: number;
  commercialSaleRevenue: number;
  commercialRentalRevenue: number;
  
  // Financial Metrics
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  returnOnInvestment: number;
  breakEvenYears: number;
  
  // Financing
  totalLoanAmount: number;
  totalEquityAmount: number;
  annualInterestCost: number;
  totalInterestCost: number;
  
  // Development Timeline
  developmentTimelineMonths: number;
  
  // Unit Economics
  averageUnitPrice: number;
  constructionCostPerUnit: number;
  profitPerUnit: number;

  // PHASE 1A: NEW RENTAL REVENUE FIELDS
  // Rental Revenue Streams
  totalRentalRevenue: number;
  annualRentalRevenue: number;
  residentialRentalRevenue: number;
  commercialRentalRevenue: number;
  
  // Rental Revenue Breakdown by Unit Type
  studioRentalRevenue: number;
  oneBedRentalRevenue: number;
  twoBedRentalRevenue: number;
  threeBedRentalRevenue: number;
  fourBedRentalRevenue: number;
  
  // Rental Operating Metrics
  grossPotentialRent: number;
  effectiveGrossRent: number;
  netOperatingIncome: number;
  vacancyLoss: number;
  managementFees: number;
  totalOperatingCosts: number;
  
  // Combined Revenue (for mixed revenue models)
  totalCombinedRevenue: number;
  
  // Revenue Model Type
  revenueModel: 'sale' | 'rental' | 'mixed';
}

interface CalculationConstants {
  mixedUseBreakdown: {
    residential: number;
    commercial: number;
    institutional: number;
  };
  occupancyRates: {
    studio: number;
    oneBed: number;
    twoBed: number;
    threeBed: number;
    fourBed: number;
  };
  unitDistributions: {
    mixedUse: {
      affordable: number;
      marketRate: number;
      executive: number;
    };
    gatedCommunity: {
      affordable: number;
      marketRate: number;
      executive: number;
    };
  };
  // PHASE 1A: ECONOMIC CONSTANTS
  economicConstants: {
    landCostPerSqm: number;
    constructionCostMultipliers: {
      highDensity: number;
      mediumDensity: number;
      lowDensity: number;
    };
    rentalYield: number;
    operatingExpensesPercent: number;
    taxRate: number;
  };
}

const DEFAULT_CONSTANTS: CalculationConstants = {
  mixedUseBreakdown: {
    residential: 0.6,
    commercial: 0.3,
    institutional: 0.1
  },
  occupancyRates: {
    studio: 1.5,
    oneBed: 2,
    twoBed: 2.5,
    threeBed: 3.5,
    fourBed: 4.5
  },
  unitDistributions: {
    mixedUse: {
      affordable: 0.4,
      marketRate: 0.4,
      executive: 0.2
    },
    gatedCommunity: {
      affordable: 0.2,
      marketRate: 0.5,
      executive: 0.3
    }
  },
  // PHASE 1A: ECONOMIC CONSTANTS
  economicConstants: {
    landCostPerSqm: 2000, // AED per sqm - typical UAE land cost
    constructionCostMultipliers: {
      highDensity: 1.1,
      mediumDensity: 1.0,
      lowDensity: 0.9
    },
    rentalYield: 0.07, // 7% annual rental yield for commercial
    operatingExpensesPercent: 0.15, // 15% of revenue for operating expenses
    taxRate: 0.05 // 5% corporate tax rate in UAE free zones
  }
};

export class CalculationEngine {
  private static validateParameters(parameters: DevelopmentParameters): string[] {
    const errors: string[] = [];
    
    const areaPercentages = 
      parameters.residentialPercent +
      parameters.commercialPercent +
      parameters.institutionalPercent +
      parameters.industrialPercent +
      parameters.mixedUsePercent +
      parameters.openSpacePercent +
      parameters.publicRealmPercent;
    
    if (Math.abs(areaPercentages - 100) > 0.1) {
      errors.push(`Land use percentages sum to ${areaPercentages}%, should be exactly 100%`);
    }
    
    const mixedUseUnitPercentages = 
      parameters.mixedUseStudioPercent +
      parameters.mixedUseOneBedPercent +
      parameters.mixedUseTwoBedPercent +
      parameters.mixedUseThreeBedPercent +
      parameters.mixedUseFourBedPercent;
    
    if (Math.abs(mixedUseUnitPercentages - 100) > 0.1) {
      errors.push(`Mixed-use unit mix percentages sum to ${mixedUseUnitPercentages}%, should be exactly 100%`);
    }

    const residentialUnitPercentages = 
      parameters.residentialStudioPercent +
      parameters.residentialOneBedPercent +
      parameters.residentialTwoBedPercent +
      parameters.residentialThreeBedPercent +
      parameters.residentialFourBedPercent;
    
    if (Math.abs(residentialUnitPercentages - 100) > 0.1) {
      errors.push(`Residential unit mix percentages sum to ${residentialUnitPercentages}%, should be exactly 100%`);
    }

    // NEW: Validate mixed-use breakdown percentages
    const mixedUseBreakdownTotal = 
      (parameters.mixedUseResidentialPercent || 0) +
      (parameters.mixedUseCommercialPercent || 0) +
      (parameters.mixedUseInstitutionalPercent || 0);
    
    if (Math.abs(mixedUseBreakdownTotal - 100) > 0.1) {
      errors.push(`Mixed-use breakdown percentages sum to ${mixedUseBreakdownTotal}%, should be exactly 100%`);
    }
    
    return errors;
  }

  private static calculateUnitsByArea(
    availableGFA: number,
    unitSizes: { studio: number; oneBed: number; twoBed: number; threeBed: number; fourBed: number },
    unitPercentages: { studio: number; oneBed: number; twoBed: number; threeBed: number; fourBed: number }
  ) {
    const studioGFA = availableGFA * (unitPercentages.studio / 100);
    const oneBedGFA = availableGFA * (unitPercentages.oneBed / 100);
    const twoBedGFA = availableGFA * (unitPercentages.twoBed / 100);
    const threeBedGFA = availableGFA * (unitPercentages.threeBed / 100);
    const fourBedGFA = availableGFA * (unitPercentages.fourBed / 100);
    
    const studioUnits = unitSizes.studio > 0 ? Math.floor(studioGFA / unitSizes.studio) : 0;
    const oneBedUnits = unitSizes.oneBed > 0 ? Math.floor(oneBedGFA / unitSizes.oneBed) : 0;
    const twoBedUnits = unitSizes.twoBed > 0 ? Math.floor(twoBedGFA / unitSizes.twoBed) : 0;
    const threeBedUnits = unitSizes.threeBed > 0 ? Math.floor(threeBedGFA / unitSizes.threeBed) : 0;
    const fourBedUnits = unitSizes.fourBed > 0 ? Math.floor(fourBedGFA / unitSizes.fourBed) : 0;
    
    return {
      studioUnits,
      oneBedUnits,
      twoBedUnits,
      threeBedUnits,
      fourBedUnits,
      studioGFA: studioUnits * (unitSizes.studio > 0 ? unitSizes.studio : 0),
      oneBedGFA: oneBedUnits * (unitSizes.oneBed > 0 ? unitSizes.oneBed : 0),
      twoBedGFA: twoBedUnits * (unitSizes.twoBed > 0 ? unitSizes.twoBed : 0),
      threeBedGFA: threeBedUnits * (unitSizes.threeBed > 0 ? unitSizes.threeBed : 0),
      fourBedGFA: fourBedUnits * (unitSizes.fourBed > 0 ? unitSizes.fourBed : 0)
    };
  }

  // NEW: Calculate plots and GFA using plot-based approach with parameter-based sizes
  private static calculateResidentialPlotsAndGFA(
    residentialArea: number,
    parameters: DevelopmentParameters
  ) {
    // Use parameter-based plot sizes
    const plotSizes = {
      studio: parameters.residentialStudioPlotSize,
      oneBed: parameters.residentialOneBedPlotSize,
      twoBed: parameters.residentialTwoBedPlotSize,
      threeBed: parameters.residentialThreeBedPlotSize,
      fourBed: parameters.residentialFourBedPlotSize
    };

    // Calculate area allocation by unit type using residential percentages
    const areaByUnitType = {
      studio: residentialArea * (parameters.residentialStudioPercent / 100),
      oneBed: residentialArea * (parameters.residentialOneBedPercent / 100),
      twoBed: residentialArea * (parameters.residentialTwoBedPercent / 100),
      threeBed: residentialArea * (parameters.residentialThreeBedPercent / 100),
      fourBed: residentialArea * (parameters.residentialFourBedPercent / 100)
    };

    // Calculate plot counts by unit type using parameter-based plot sizes
    const plotsByUnitType = {
      studio: plotSizes.studio > 0 ? Math.floor(areaByUnitType.studio / plotSizes.studio) : 0,
      oneBed: plotSizes.oneBed > 0 ? Math.floor(areaByUnitType.oneBed / plotSizes.oneBed) : 0,
      twoBed: plotSizes.twoBed > 0 ? Math.floor(areaByUnitType.twoBed / plotSizes.twoBed) : 0,
      threeBed: plotSizes.threeBed > 0 ? Math.floor(areaByUnitType.threeBed / plotSizes.threeBed) : 0,
      fourBed: plotSizes.fourBed > 0 ? Math.floor(areaByUnitType.fourBed / plotSizes.fourBed) : 0
    };

    // Calculate GFA per plot for each unit type
    const gfaPerPlotByUnitType = {
      studio: plotSizes.studio * (parameters.residentialPlotCoverage / 100) * parameters.residentialFloors,
      oneBed: plotSizes.oneBed * (parameters.residentialPlotCoverage / 100) * parameters.residentialFloors,
      twoBed: plotSizes.twoBed * (parameters.residentialPlotCoverage / 100) * parameters.residentialFloors,
      threeBed: plotSizes.threeBed * (parameters.residentialPlotCoverage / 100) * parameters.residentialFloors,
      fourBed: plotSizes.fourBed * (parameters.residentialPlotCoverage / 100) * parameters.residentialFloors
    };

    // Calculate total GFA by unit type
    const gfaByUnitType = {
      studio: plotsByUnitType.studio * gfaPerPlotByUnitType.studio,
      oneBed: plotsByUnitType.oneBed * gfaPerPlotByUnitType.oneBed,
      twoBed: plotsByUnitType.twoBed * gfaPerPlotByUnitType.twoBed,
      threeBed: plotsByUnitType.threeBed * gfaPerPlotByUnitType.threeBed,
      fourBed: plotsByUnitType.fourBed * gfaPerPlotByUnitType.fourBed
    };

    // Calculate total residential GFA and plots
    const totalResidentialGFA = gfaByUnitType.studio + gfaByUnitType.oneBed + gfaByUnitType.twoBed + 
                               gfaByUnitType.threeBed + gfaByUnitType.fourBed;
    
    const totalResidentialPlots = plotsByUnitType.studio + plotsByUnitType.oneBed + plotsByUnitType.twoBed + 
                                 plotsByUnitType.threeBed + plotsByUnitType.fourBed;

    // Calculate average GFA per plot
    const avgGFAperPlot = totalResidentialPlots > 0 ? totalResidentialGFA / totalResidentialPlots : 0;

    return {
      totalResidentialGFA,
      totalResidentialPlots,
      avgGFAperPlot,
      plotsByUnitType,
      gfaByUnitType,
      areaByUnitType
    };
  }

  // PHASE 1A: NEW RENTAL REVENUE CALCULATIONS
  private static calculateRentalRevenue(
    results: CalculationResults,
    parameters: DevelopmentParameters
  ) {
    const developmentYears = parameters.developmentTimelineMonths / 12;
    
    // Calculate annual rental revenue by unit type
    const studioAnnualRent = results.regularStudioUnits * parameters.studioRentPerMonth * 12;
    const oneBedAnnualRent = results.regularOneBedUnits * parameters.oneBedRentPerMonth * 12;
    const twoBedAnnualRent = results.regularTwoBedUnits * parameters.twoBedRentPerMonth * 12;
    const threeBedAnnualRent = results.regularThreeBedUnits * parameters.threeBedRentPerMonth * 12;
    const fourBedAnnualRent = results.regularFourBedUnits * parameters.fourBedRentPerMonth * 12;
    
    // Mixed-use rental revenue
    const mixedUseStudioAnnualRent = results.mixedUseStudioUnits * parameters.studioRentPerMonth * 12;
    const mixedUseOneBedAnnualRent = results.mixedUseOneBedUnits * parameters.oneBedRentPerMonth * 12;
    const mixedUseTwoBedAnnualRent = results.mixedUseTwoBedUnits * parameters.twoBedRentPerMonth * 12;
    const mixedUseThreeBedAnnualRent = results.mixedUseThreeBedUnits * parameters.threeBedRentPerMonth * 12;
    const mixedUseFourBedAnnualRent = results.mixedUseFourBedUnits * parameters.fourBedRentPerMonth * 12;
    
    // Commercial rental revenue (using new per-sqm monthly rate)
    const commercialAnnualRent = results.commercialGFA * parameters.commercialRentPerSqM * 12;
    
    // Total residential rental revenue
    const residentialRentalRevenue = studioAnnualRent + oneBedAnnualRent + twoBedAnnualRent + 
                                   threeBedAnnualRent + fourBedAnnualRent +
                                   mixedUseStudioAnnualRent + mixedUseOneBedAnnualRent + 
                                   mixedUseTwoBedAnnualRent + mixedUseThreeBedAnnualRent + 
                                   mixedUseFourBedAnnualRent;
    
    const commercialRentalRevenue = commercialAnnualRent;
    
    // Gross Potential Rent (assuming 100% occupancy)
    const grossPotentialRent = residentialRentalRevenue + commercialRentalRevenue;
    
    // Vacancy Loss
    const vacancyLoss = grossPotentialRent * (parameters.rentalVacancyRate / 100);
    
    // Effective Gross Rent
    const effectiveGrossRent = grossPotentialRent - vacancyLoss;
    
    // Management Fees
    const managementFees = effectiveGrossRent * (parameters.propertyManagementFee / 100);
    
    // Operating Costs
    const totalResidentialUnits = results.regularStudioUnits + results.regularOneBedUnits + 
                                 results.regularTwoBedUnits + results.regularThreeBedUnits + 
                                 results.regularFourBedUnits + results.mixedUseStudioUnits + 
                                 results.mixedUseOneBedUnits + results.mixedUseTwoBedUnits + 
                                 results.mixedUseThreeBedUnits + results.mixedUseFourBedUnits;
    
    const totalOperatingCosts = totalResidentialUnits * parameters.rentalOperatingCosts * 12;
    
    // Net Operating Income
    const netOperatingIncome = effectiveGrossRent - managementFees - totalOperatingCosts;
    
    // Annual Rental Revenue (for cash flow analysis)
    const annualRentalRevenue = netOperatingIncome;
    
    // Total Rental Revenue over development period (simplified - no rent escalation in first calculation)
    const totalRentalRevenue = annualRentalRevenue * developmentYears;

    return {
      totalRentalRevenue,
      annualRentalRevenue,
      residentialRentalRevenue,
      commercialRentalRevenue,
      studioRentalRevenue: studioAnnualRent + mixedUseStudioAnnualRent,
      oneBedRentalRevenue: oneBedAnnualRent + mixedUseOneBedAnnualRent,
      twoBedRentalRevenue: twoBedAnnualRent + mixedUseTwoBedAnnualRent,
      threeBedRentalRevenue: threeBedAnnualRent + mixedUseThreeBedAnnualRent,
      fourBedRentalRevenue: fourBedAnnualRent + mixedUseFourBedAnnualRent,
      grossPotentialRent,
      effectiveGrossRent,
      netOperatingIncome,
      vacancyLoss,
      managementFees,
      totalOperatingCosts,
      revenueModel: parameters.revenueModel
    };
  }

  // PHASE 1A: ENHANCED ECONOMIC CALCULATIONS
  private static calculateEconomicResults(
    results: CalculationResults,
    parameters: DevelopmentParameters,
    totalArea: number
  ) {
    // Apply density multiplier to construction costs
    const densityMultiplier = this.getDensityMultiplier(parameters.densityLevel);
    
    // Construction Costs
    const residentialConstructionCost = results.residentialGFA * parameters.residentialConstructionCost * densityMultiplier;
    const commercialConstructionCost = results.commercialGFA * parameters.commercialConstructionCost * densityMultiplier;
    const mixedUseConstructionCost = results.mixedUseGFA * parameters.mixedUseConstructionCost * densityMultiplier;
    const institutionalConstructionCost = results.institutionalGFA * parameters.institutionalConstructionCost * densityMultiplier;
    const industrialConstructionCost = results.industrialGFA * parameters.industrialConstructionCost * densityMultiplier;
    const infrastructureCost = totalArea * parameters.infrastructureCostPerSqm;
    
    const totalConstructionCost = residentialConstructionCost + commercialConstructionCost + 
                                 mixedUseConstructionCost + institutionalConstructionCost + 
                                 industrialConstructionCost + infrastructureCost;

    // Land Acquisition Cost (if not provided, calculate based on area)
    const landAcquisitionCost = parameters.landAcquisitionCost > 0 ? 
                               parameters.landAcquisitionCost : 
                               totalArea * DEFAULT_CONSTANTS.economicConstants.landCostPerSqm;

    // Development Costs
    const professionalFees = totalConstructionCost * (parameters.professionalFeesPercent / 100);
    const contingencyCost = totalConstructionCost * (parameters.contingencyPercent / 100);
    const marketingCost = totalConstructionCost * (parameters.marketingCostPercent / 100);
    
    const totalDevelopmentCost = totalConstructionCost + landAcquisitionCost + 
                                professionalFees + contingencyCost + marketingCost;

    // Calculate rental revenue if applicable
    const rentalResults = this.calculateRentalRevenue(results, parameters);
    
    // Calculate revenue based on revenue model
    let totalRevenue = 0;
    let residentialRevenue = 0;
    let mixedUseRevenue = 0;
    let commercialRevenue = 0;
    
    if (parameters.revenueModel === 'sale' || parameters.revenueModel === 'mixed') {
      // Residential Revenue
      const studioRevenue = results.regularStudioUnits * parameters.studioSalePrice;
      const oneBedRevenue = results.regularOneBedUnits * parameters.oneBedSalePrice;
      const twoBedRevenue = results.regularTwoBedUnits * parameters.twoBedSalePrice;
      const threeBedRevenue = results.regularThreeBedUnits * parameters.threeBedSalePrice;
      const fourBedRevenue = results.regularFourBedUnits * parameters.fourBedSalePrice;
      
      residentialRevenue = studioRevenue + oneBedRevenue + twoBedRevenue + threeBedRevenue + fourBedRevenue;

      // Mixed-Use Revenue
      const mixedUseStudioRevenue = results.mixedUseStudioUnits * parameters.mixedUseStudioSalePrice;
      const mixedUseOneBedRevenue = results.mixedUseOneBedUnits * parameters.mixedUseOneBedSalePrice;
      const mixedUseTwoBedRevenue = results.mixedUseTwoBedUnits * parameters.mixedUseTwoBedSalePrice;
      const mixedUseThreeBedRevenue = results.mixedUseThreeBedUnits * parameters.mixedUseThreeBedSalePrice;
      const mixedUseFourBedRevenue = results.mixedUseFourBedUnits * parameters.mixedUseFourBedSalePrice;
      
      mixedUseRevenue = mixedUseStudioRevenue + mixedUseOneBedRevenue + mixedUseTwoBedRevenue + 
                       mixedUseThreeBedRevenue + mixedUseFourBedRevenue;

      // Commercial Revenue
      const commercialSaleRevenue = results.commercialGFA * parameters.commercialSalePrice;
      const commercialRentalRevenue = results.commercialGFA * parameters.commercialRentalRate;
      
      commercialRevenue = commercialSaleRevenue + commercialRentalRevenue;

      // Base sale revenue
      const baseSaleRevenue = residentialRevenue + mixedUseRevenue + commercialRevenue;
      
      if (parameters.revenueModel === 'sale') {
        totalRevenue = baseSaleRevenue;
      } else { // mixed model
        totalRevenue = baseSaleRevenue + rentalResults.totalRentalRevenue;
      }
    } else {
      // Rental model only
      totalRevenue = rentalResults.totalRentalRevenue;
      residentialRevenue = rentalResults.residentialRentalRevenue;
      commercialRevenue = rentalResults.commercialRentalRevenue;
    }
    
    // Calculate total combined revenue for reporting
    const totalCombinedRevenue = totalRevenue;

    // Financing Calculations
    const totalLoanAmount = totalDevelopmentCost * (parameters.loanToValueRatio / 100);
    const totalEquityAmount = totalDevelopmentCost * (parameters.equityPercentage / 100);
    
    const developmentYears = parameters.developmentTimelineMonths / 12;
    const annualInterestCost = totalLoanAmount * (parameters.financingInterestRate / 100);
    const totalInterestCost = annualInterestCost * developmentYears;

    // Profit Calculations
    const operatingExpenses = totalRevenue * DEFAULT_CONSTANTS.economicConstants.operatingExpensesPercent;
    const taxAmount = (totalRevenue - totalDevelopmentCost - operatingExpenses - totalInterestCost) * 
                     DEFAULT_CONSTANTS.economicConstants.taxRate;
    
    const grossProfit = totalRevenue - totalDevelopmentCost;
    const netProfit = grossProfit - operatingExpenses - totalInterestCost - taxAmount;
    
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const returnOnInvestment = totalEquityAmount > 0 ? (netProfit / totalEquityAmount) * 100 : 0;
    
    // Break-even analysis (simplified)
    const annualNetProfit = netProfit / developmentYears;
    const breakEvenYears = annualNetProfit > 0 ? Math.abs(totalEquityAmount / annualNetProfit) : 0;

    // Unit Economics
    const averageUnitPrice = results.totalUnits > 0 ? totalRevenue / results.totalUnits : 0;
    const constructionCostPerUnit = results.totalUnits > 0 ? totalConstructionCost / results.totalUnits : 0;
    const profitPerUnit = results.totalUnits > 0 ? netProfit / results.totalUnits : 0;

    // Calculate sale-specific revenues for backward compatibility
    const studioRevenue = results.regularStudioUnits * parameters.studioSalePrice;
    const oneBedRevenue = results.regularOneBedUnits * parameters.oneBedSalePrice;
    const twoBedRevenue = results.regularTwoBedUnits * parameters.twoBedSalePrice;
    const threeBedRevenue = results.regularThreeBedUnits * parameters.threeBedSalePrice;
    const fourBedRevenue = results.regularFourBedUnits * parameters.fourBedSalePrice;
    
    const mixedUseStudioRevenue = results.mixedUseStudioUnits * parameters.mixedUseStudioSalePrice;
    const mixedUseOneBedRevenue = results.mixedUseOneBedUnits * parameters.mixedUseOneBedSalePrice;
    const mixedUseTwoBedRevenue = results.mixedUseTwoBedUnits * parameters.mixedUseTwoBedSalePrice;
    const mixedUseThreeBedRevenue = results.mixedUseThreeBedUnits * parameters.mixedUseThreeBedSalePrice;
    const mixedUseFourBedRevenue = results.mixedUseFourBedUnits * parameters.mixedUseFourBedSalePrice;
    
    const commercialSaleRevenue = results.commercialGFA * parameters.commercialSalePrice;
    const commercialRentalRevenue = results.commercialGFA * parameters.commercialRentalRate;

    return {
      // Construction Costs
      totalConstructionCost,
      residentialConstructionCost,
      commercialConstructionCost,
      mixedUseConstructionCost,
      institutionalConstructionCost,
      industrialConstructionCost,
      infrastructureCost,
      
      // Development Costs
      landAcquisitionCost,
      professionalFees,
      contingencyCost,
      marketingCost,
      totalDevelopmentCost,
      
      // Revenue
      totalRevenue,
      residentialRevenue,
      mixedUseRevenue,
      commercialRevenue,
      
      // Revenue Breakdown
      studioRevenue,
      oneBedRevenue,
      twoBedRevenue,
      threeBedRevenue,
      fourBedRevenue,
      mixedUseStudioRevenue,
      mixedUseOneBedRevenue,
      mixedUseTwoBedRevenue,
      mixedUseThreeBedRevenue,
      mixedUseFourBedRevenue,
      commercialSaleRevenue,
      commercialRentalRevenue,
      
      // Financial Metrics
      grossProfit,
      netProfit,
      profitMargin,
      returnOnInvestment,
      breakEvenYears,
      
      // Financing
      totalLoanAmount,
      totalEquityAmount,
      annualInterestCost,
      totalInterestCost,
      
      // Development Timeline
      developmentTimelineMonths: parameters.developmentTimelineMonths,
      
      // Unit Economics
      averageUnitPrice,
      constructionCostPerUnit,
      profitPerUnit,

      // PHASE 1A: NEW RENTAL RESULTS
      ...rentalResults,
      totalCombinedRevenue,
    };
  }

  private static getDensityMultiplier(densityLevel: 'High' | 'Medium' | 'Low'): number {
    switch (densityLevel) {
      case 'High':
        return DEFAULT_CONSTANTS.economicConstants.constructionCostMultipliers.highDensity;
      case 'Medium':
        return DEFAULT_CONSTANTS.economicConstants.constructionCostMultipliers.mediumDensity;
      case 'Low':
        return DEFAULT_CONSTANTS.economicConstants.constructionCostMultipliers.lowDensity;
      default:
        return 1.0;
    }
  }

  static calculate(
    totalArea: number,
    parameters: DevelopmentParameters
  ): CalculationResults {
    try {
      const validationErrors = this.validateParameters(parameters);
      if (validationErrors.length > 0) {
        console.warn('Parameter validation warnings:', validationErrors);
      }

      const totalAreaHectares = totalArea / 10000;
      
      // Area allocations
      const openSpaceArea = totalArea * (parameters.openSpacePercent / 100);
      const publicRealmArea = totalArea * (parameters.publicRealmPercent / 100);
      const residentialArea = totalArea * (parameters.residentialPercent / 100);
      const commercialArea = totalArea * (parameters.commercialPercent / 100);
      const institutionalArea = totalArea * (parameters.institutionalPercent / 100);
      const industrialArea = totalArea * (parameters.industrialPercent / 100);
      const mixedUseArea = totalArea * (parameters.mixedUsePercent / 100);
      
      // GFA calculations for non-residential types
      const commercialPlotCoverageArea = commercialArea * (parameters.commercialPlotCoverage / 100);
      const commercialGFA = commercialPlotCoverageArea * parameters.commercialFloors;
      
      const institutionalPlotCoverageArea = institutionalArea * (parameters.institutionalPlotCoverage / 100);
      const institutionalGFA = institutionalPlotCoverageArea * parameters.institutionalFloors;
      
      const industrialPlotCoverageArea = industrialArea * (parameters.industrialPlotCoverage / 100);
      const industrialGFA = industrialPlotCoverageArea * parameters.industrialFloors;

      // Mixed-Use GFA calculation - NOW USING PARAMETERS INSTEAD OF HARDCODED VALUES
      const mixedUsePlotCoverageArea = mixedUseArea * (parameters.mixedUsePlotCoverage / 100);
      const mixedUseGFA = mixedUsePlotCoverageArea * parameters.mixedUseFloors;
      
      // Use parameter-based mixed-use breakdown or fall back to defaults
      const mixedUseResidentialPercent = parameters.mixedUseResidentialPercent || 60;
      const mixedUseCommercialPercent = parameters.mixedUseCommercialPercent || 30;
      const mixedUseInstitutionalPercent = parameters.mixedUseInstitutionalPercent || 10;
      
      const mixedUseResidentialGFA = mixedUseGFA * (mixedUseResidentialPercent / 100);
      const mixedUseCommercialGFA = mixedUseGFA * (mixedUseCommercialPercent / 100);
      const mixedUseInstitutionalGFA = mixedUseGFA * (mixedUseInstitutionalPercent / 100);

      // Calculate residential plots and GFA using plot-based approach with parameter-based sizes
      const residentialResults = this.calculateResidentialPlotsAndGFA(residentialArea, parameters);
      const residentialGFA = residentialResults.totalResidentialGFA;
      const residentialPlots = residentialResults.totalResidentialPlots;

      // Calculate Mixed-Use Units using parameter-based unit sizes and percentages
      const mixedUseUnitPercentages = {
        studio: parameters.mixedUseStudioPercent,
        oneBed: parameters.mixedUseOneBedPercent,
        twoBed: parameters.mixedUseTwoBedPercent,
        threeBed: parameters.mixedUseThreeBedPercent,
        fourBed: parameters.mixedUseFourBedPercent
      };

      // Use parameter-based mixed-use unit sizes
      const mixedUseUnitSizes = {
        studio: parameters.mixedUseStudioSize,
        oneBed: parameters.mixedUseOneBedSize,
        twoBed: parameters.mixedUseTwoBedSize,
        threeBed: parameters.mixedUseThreeBedSize,
        fourBed: parameters.mixedUseFourBedSize
      };

      const mixedUseUnits = this.calculateUnitsByArea(
        mixedUseResidentialGFA,
        mixedUseUnitSizes,
        mixedUseUnitPercentages
      );
      
      // Calculate Regular Residential Units using residential plot sizes (since we removed residential unit sizes)
      const residentialUnitPercentages = {
        studio: parameters.residentialStudioPercent,
        oneBed: parameters.residentialOneBedPercent,
        twoBed: parameters.residentialTwoBedPercent,
        threeBed: parameters.residentialThreeBedPercent,
        fourBed: parameters.residentialFourBedPercent
      };

      // Use residential plot sizes for unit calculations (since residential unit sizes were removed)
      const residentialUnitSizes = {
        studio: parameters.residentialStudioPlotSize,
        oneBed: parameters.residentialOneBedPlotSize,
        twoBed: parameters.residentialTwoBedPlotSize,
        threeBed: parameters.residentialThreeBedPlotSize,
        fourBed: parameters.residentialFourBedPlotSize
      };

      const regularUnits = this.calculateUnitsByArea(
        residentialGFA,
        residentialUnitSizes,
        residentialUnitPercentages
      );
      
      // Calculate total units by type
      const totalStudioUnits = mixedUseUnits.studioUnits + regularUnits.studioUnits;
      const totalOneBedUnits = mixedUseUnits.oneBedUnits + regularUnits.oneBedUnits;
      const totalTwoBedUnits = mixedUseUnits.twoBedUnits + regularUnits.twoBedUnits;
      const totalThreeBedUnits = mixedUseUnits.threeBedUnits + regularUnits.threeBedUnits;
      const totalFourBedUnits = mixedUseUnits.fourBedUnits + regularUnits.fourBedUnits;
      
      const totalUnits = totalStudioUnits + totalOneBedUnits + totalTwoBedUnits + totalThreeBedUnits + totalFourBedUnits;
      
      // Unit distribution calculations
      let affordableUnits = 0;
      let marketRateUnits = 0;
      let executiveUnits = 0;
      
      if (parameters.developmentType === 'Mixed-Use') {
        affordableUnits = Math.floor(totalUnits * DEFAULT_CONSTANTS.unitDistributions.mixedUse.affordable);
        marketRateUnits = Math.floor(totalUnits * DEFAULT_CONSTANTS.unitDistributions.mixedUse.marketRate);
        executiveUnits = Math.floor(totalUnits * DEFAULT_CONSTANTS.unitDistributions.mixedUse.executive);
      } else if (parameters.developmentType === 'Gated Community') {
        affordableUnits = Math.floor(totalUnits * DEFAULT_CONSTANTS.unitDistributions.gatedCommunity.affordable);
        marketRateUnits = Math.floor(totalUnits * DEFAULT_CONSTANTS.unitDistributions.gatedCommunity.marketRate);
        executiveUnits = Math.floor(totalUnits * DEFAULT_CONSTANTS.unitDistributions.gatedCommunity.executive);
      } else {
        switch (parameters.budgetClassification) {
          case 'Affordable':
            affordableUnits = totalUnits;
            break;
          case 'Market Rate':
            marketRateUnits = totalUnits;
            break;
          case 'Executive':
            executiveUnits = totalUnits;
            break;
          default:
            marketRateUnits = totalUnits;
        }
      }
      
      // Adjust distribution
      const calculatedDistributionUnits = affordableUnits + marketRateUnits + executiveUnits;
      const remainingDistributionUnits = totalUnits - calculatedDistributionUnits;
      
      if (remainingDistributionUnits > 0) {
        const distributionValues = [
          { type: 'affordable', value: affordableUnits },
          { type: 'marketRate', value: marketRateUnits },
          { type: 'executive', value: executiveUnits }
        ];
        
        const maxCategory = distributionValues.reduce((max, current) => 
          current.value > max.value ? current : max
        );
        
        switch (maxCategory.type) {
          case 'affordable':
            affordableUnits += remainingDistributionUnits;
            break;
          case 'marketRate':
            marketRateUnits += remainingDistributionUnits;
            break;
          case 'executive':
            executiveUnits += remainingDistributionUnits;
            break;
        }
      }
      
      // Population
      const avgOccupancy = DEFAULT_CONSTANTS.occupancyRates;
      
      const totalPopulation = 
        (totalStudioUnits * avgOccupancy.studio) +
        (totalOneBedUnits * avgOccupancy.oneBed) +
        (totalTwoBedUnits * avgOccupancy.twoBed) +
        (totalThreeBedUnits * avgOccupancy.threeBed) +
        (totalFourBedUnits * avgOccupancy.fourBed);
      
      const adults = totalPopulation * (parameters.adultsPercent / 100);
      const children = totalPopulation * (parameters.childrenPercent / 100);
      
      // Parking
      const residentParking = Math.ceil(totalUnits * parameters.parkingSpacesPerUnit);
      const guestParking = Math.ceil(residentParking * (parameters.guestParkingPercent / 100));
      const disabledParking = Math.ceil(residentParking * (parameters.disabledParkingPercent / 100));
      const totalParkingSpaces = residentParking + guestParking + disabledParking;
      
      // Other plot counts (non-residential)
      const mixedUsePlots = mixedUseArea > 0 ? Math.floor(mixedUseArea / parameters.mixedUsePlotSize) : 0;
      const commercialPlots = commercialArea > 0 ? Math.floor(commercialArea / parameters.commercialPlotSize) : 0;
      const institutionalPlots = institutionalArea > 0 ? Math.floor(institutionalArea / parameters.institutionalPlotSize) : 0;
      const industrialPlots = industrialArea > 0 ? Math.floor(industrialArea / parameters.industrialPlotSize) : 0;
      const totalPlots = residentialPlots + mixedUsePlots + commercialPlots + institutionalPlots + industrialPlots;
      
      // Block counts - NOW USING PARAMETER-BASED BLOCK SIZES
      const mixedUseBlocks = mixedUseArea > 0 ? Math.floor(mixedUseArea / parameters.mixedUseBlockSize) : 0;
      const residentialBlocks = residentialArea > 0 ? Math.floor(residentialArea / parameters.residentialBlockSize) : 0;
      const commercialBlocks = commercialArea > 0 ? Math.floor(commercialArea / parameters.commercialBlockSize) : 0;
      const institutionalBlocks = institutionalArea > 0 ? Math.floor(institutionalArea / parameters.institutionalBlockSize) : 0;
      const industrialBlocks = industrialArea > 0 ? Math.floor(industrialArea / parameters.industrialBlockSize) : 0;
      const totalBlocks = mixedUseBlocks + residentialBlocks + commercialBlocks + institutionalBlocks + industrialBlocks;
      
      // Density metrics
      const unitsPerHectare = totalUnits / totalAreaHectares;
      const peoplePerHectare = totalPopulation / totalAreaHectares;
      const totalGFA = residentialGFA + commercialGFA + institutionalGFA + industrialGFA + mixedUseGFA;
      const plotRatio = totalGFA / totalArea;
      
      // FAR calculations
      const residentialFAR = residentialArea > 0 ? residentialGFA / residentialArea : 0;
      const commercialFAR = commercialArea > 0 ? commercialGFA / commercialArea : 0;
      const mixedUseFAR = mixedUseArea > 0 ? mixedUseGFA / mixedUseArea : 0;
      const institutionalFAR = institutionalArea > 0 ? institutionalGFA / institutionalArea : 0;
      const industrialFAR = industrialArea > 0 ? industrialGFA / industrialArea : 0;

      // Mixed-use GFA per plot
      const mixedUseGFAperPlot = mixedUsePlots > 0 ? mixedUseGFA / mixedUsePlots : 0;

      // Create base results object
      const baseResults: CalculationResults = {
        totalArea,
        openSpaceArea,
        publicRealmArea,
        publicRealmPercent: parameters.publicRealmPercent,
        residentialArea,
        commercialArea,
        institutionalArea,
        industrialArea,
        mixedUseArea,
        residentialGFA,
        commercialGFA,
        institutionalGFA,
        industrialGFA,
        mixedUseGFA,
        mixedUseResidentialGFA,
        mixedUseCommercialGFA,
        mixedUseInstitutionalGFA,
        totalGFA,
        residentialPlots,
        commercialPlots,
        institutionalPlots,
        industrialPlots,
        mixedUsePlots,
        totalPlots,
        // NEW: Plot counts by unit type
        residentialStudioPlots: residentialResults.plotsByUnitType.studio,
        residentialOneBedPlots: residentialResults.plotsByUnitType.oneBed,
        residentialTwoBedPlots: residentialResults.plotsByUnitType.twoBed,
        residentialThreeBedPlots: residentialResults.plotsByUnitType.threeBed,
        residentialFourBedPlots: residentialResults.plotsByUnitType.fourBed,
        residentialBlocks,
        commercialBlocks,
        institutionalBlocks,
        industrialBlocks,
        mixedUseBlocks,
        totalBlocks,
        totalUnits,
        affordableUnits,
        marketRateUnits,
        executiveUnits,
        studioUnits: totalStudioUnits,
        oneBedUnits: totalOneBedUnits,
        twoBedUnits: totalTwoBedUnits,
        threeBedUnits: totalThreeBedUnits,
        fourBedUnits: totalFourBedUnits,
        mixedUseStudioUnits: mixedUseUnits.studioUnits,
        mixedUseOneBedUnits: mixedUseUnits.oneBedUnits,
        mixedUseTwoBedUnits: mixedUseUnits.twoBedUnits,
        mixedUseThreeBedUnits: mixedUseUnits.threeBedUnits,
        mixedUseFourBedUnits: mixedUseUnits.fourBedUnits,
        regularStudioUnits: regularUnits.studioUnits,
        regularOneBedUnits: regularUnits.oneBedUnits,
        regularTwoBedUnits: regularUnits.twoBedUnits,
        regularThreeBedUnits: regularUnits.threeBedUnits,
        regularFourBedUnits: regularUnits.fourBedUnits,
        mixedUseStudioGFA: mixedUseUnits.studioGFA,
        mixedUseOneBedGFA: mixedUseUnits.oneBedGFA,
        mixedUseTwoBedGFA: mixedUseUnits.twoBedGFA,
        mixedUseThreeBedGFA: mixedUseUnits.threeBedGFA,
        mixedUseFourBedGFA: mixedUseUnits.fourBedGFA,
        regularStudioGFA: regularUnits.studioGFA,
        regularOneBedGFA: regularUnits.oneBedGFA,
        regularTwoBedGFA: regularUnits.twoBedGFA,
        regularThreeBedGFA: regularUnits.threeBedGFA,
        regularFourBedGFA: regularUnits.fourBedGFA,
        // NEW: GFA per plot
        residentialGFAperPlot: residentialResults.avgGFAperPlot,
        mixedUseGFAperPlot,
        totalPopulation,
        adults,
        children,
        totalParkingSpaces,
        residentParking,
        guestParking,
        disabledParking,
        unitsPerHectare,
        peoplePerHectare,
        plotRatio,
        residentialFAR,
        commercialFAR,
        mixedUseFAR,
        institutionalFAR,
        industrialFAR,
        // PHASE 1A: ECONOMIC RESULTS (will be populated below)
        totalConstructionCost: 0,
        residentialConstructionCost: 0,
        commercialConstructionCost: 0,
        mixedUseConstructionCost: 0,
        institutionalConstructionCost: 0,
        industrialConstructionCost: 0,
        infrastructureCost: 0,
        landAcquisitionCost: 0,
        professionalFees: 0,
        contingencyCost: 0,
        marketingCost: 0,
        totalDevelopmentCost: 0,
        totalRevenue: 0,
        residentialRevenue: 0,
        mixedUseRevenue: 0,
        commercialRevenue: 0,
        studioRevenue: 0,
        oneBedRevenue: 0,
        twoBedRevenue: 0,
        threeBedRevenue: 0,
        fourBedRevenue: 0,
        mixedUseStudioRevenue: 0,
        mixedUseOneBedRevenue: 0,
        mixedUseTwoBedRevenue: 0,
        mixedUseThreeBedRevenue: 0,
        mixedUseFourBedRevenue: 0,
        commercialSaleRevenue: 0,
        commercialRentalRevenue: 0,
        grossProfit: 0,
        netProfit: 0,
        profitMargin: 0,
        returnOnInvestment: 0,
        breakEvenYears: 0,
        totalLoanAmount: 0,
        totalEquityAmount: 0,
        annualInterestCost: 0,
        totalInterestCost: 0,
        developmentTimelineMonths: 0,
        averageUnitPrice: 0,
        constructionCostPerUnit: 0,
        profitPerUnit: 0,

        // PHASE 1A: NEW RENTAL FIELDS
        totalRentalRevenue: 0,
        annualRentalRevenue: 0,
        residentialRentalRevenue: 0,
        commercialRentalRevenue: 0,
        studioRentalRevenue: 0,
        oneBedRentalRevenue: 0,
        twoBedRentalRevenue: 0,
        threeBedRentalRevenue: 0,
        fourBedRentalRevenue: 0,
        grossPotentialRent: 0,
        effectiveGrossRent: 0,
        netOperatingIncome: 0,
        vacancyLoss: 0,
        managementFees: 0,
        totalOperatingCosts: 0,
        totalCombinedRevenue: 0,
        revenueModel: 'sale'
      };

      // Calculate economic results
      const economicResults = this.calculateEconomicResults(baseResults, parameters, totalArea);
      
      // Merge economic results with base results
      return {
        ...baseResults,
        ...economicResults
      };

    } catch (error) {
      console.error('Calculation error:', error);
      return this.getDefaultResults(totalArea);
    }
  }

  private static getDefaultResults(totalArea: number): CalculationResults {
    // Return default empty results (updated with new properties)
    const defaultResult: CalculationResults = {
      totalArea,
      openSpaceArea: 0,
      publicRealmArea: 0,
      publicRealmPercent: 0,
      residentialArea: 0,
      commercialArea: 0,
      institutionalArea: 0,
      industrialArea: 0,
      mixedUseArea: 0,
      residentialGFA: 0,
      commercialGFA: 0,
      institutionalGFA: 0,
      industrialGFA: 0,
      mixedUseGFA: 0,
      mixedUseResidentialGFA: 0,
      mixedUseCommercialGFA: 0,
      mixedUseInstitutionalGFA: 0,
      totalGFA: 0,
      residentialPlots: 0,
      commercialPlots: 0,
      institutionalPlots: 0,
      industrialPlots: 0,
      mixedUsePlots: 0,
      totalPlots: 0,
      residentialStudioPlots: 0,
      residentialOneBedPlots: 0,
      residentialTwoBedPlots: 0,
      residentialThreeBedPlots: 0,
      residentialFourBedPlots: 0,
      residentialBlocks: 0,
      commercialBlocks: 0,
      institutionalBlocks: 0,
      industrialBlocks: 0,
      mixedUseBlocks: 0,
      totalBlocks: 0,
      totalUnits: 0,
      affordableUnits: 0,
      marketRateUnits: 0,
      executiveUnits: 0,
      studioUnits: 0,
      oneBedUnits: 0,
      twoBedUnits: 0,
      threeBedUnits: 0,
      fourBedUnits: 0,
      mixedUseStudioUnits: 0,
      mixedUseOneBedUnits: 0,
      mixedUseTwoBedUnits: 0,
      mixedUseThreeBedUnits: 0,
      mixedUseFourBedUnits: 0,
      regularStudioUnits: 0,
      regularOneBedUnits: 0,
      regularTwoBedUnits: 0,
      regularThreeBedUnits: 0,
      regularFourBedUnits: 0,
      mixedUseStudioGFA: 0,
      mixedUseOneBedGFA: 0,
      mixedUseTwoBedGFA: 0,
      mixedUseThreeBedGFA: 0,
      mixedUseFourBedGFA: 0,
      regularStudioGFA: 0,
      regularOneBedGFA: 0,
      regularTwoBedGFA: 0,
      regularThreeBedGFA: 0,
      regularFourBedGFA: 0,
      residentialGFAperPlot: 0,
      mixedUseGFAperPlot: 0,
      totalPopulation: 0,
      adults: 0,
      children: 0,
      totalParkingSpaces: 0,
      residentParking: 0,
      guestParking: 0,
      disabledParking: 0,
      unitsPerHectare: 0,
      peoplePerHectare: 0,
      plotRatio: 0,
      residentialFAR: 0,
      commercialFAR: 0,
      mixedUseFAR: 0,
      institutionalFAR: 0,
      industrialFAR: 0,
      // PHASE 1A: ECONOMIC RESULTS
      totalConstructionCost: 0,
      residentialConstructionCost: 0,
      commercialConstructionCost: 0,
      mixedUseConstructionCost: 0,
      institutionalConstructionCost: 0,
      industrialConstructionCost: 0,
      infrastructureCost: 0,
      landAcquisitionCost: 0,
      professionalFees: 0,
      contingencyCost: 0,
      marketingCost: 0,
      totalDevelopmentCost: 0,
      totalRevenue: 0,
      residentialRevenue: 0,
      mixedUseRevenue: 0,
      commercialRevenue: 0,
      studioRevenue: 0,
      oneBedRevenue: 0,
      twoBedRevenue: 0,
      threeBedRevenue: 0,
      fourBedRevenue: 0,
      mixedUseStudioRevenue: 0,
      mixedUseOneBedRevenue: 0,
      mixedUseTwoBedRevenue: 0,
      mixedUseThreeBedRevenue: 0,
      mixedUseFourBedRevenue: 0,
      commercialSaleRevenue: 0,
      commercialRentalRevenue: 0,
      grossProfit: 0,
      netProfit: 0,
      profitMargin: 0,
      returnOnInvestment: 0,
      breakEvenYears: 0,
      totalLoanAmount: 0,
      totalEquityAmount: 0,
      annualInterestCost: 0,
      totalInterestCost: 0,
      developmentTimelineMonths: 0,
      averageUnitPrice: 0,
      constructionCostPerUnit: 0,
      profitPerUnit: 0,

      // PHASE 1A: NEW RENTAL FIELDS
      totalRentalRevenue: 0,
      annualRentalRevenue: 0,
      residentialRentalRevenue: 0,
      commercialRentalRevenue: 0,
      studioRentalRevenue: 0,
      oneBedRentalRevenue: 0,
      twoBedRentalRevenue: 0,
      threeBedRentalRevenue: 0,
      fourBedRentalRevenue: 0,
      grossPotentialRent: 0,
      effectiveGrossRent: 0,
      netOperatingIncome: 0,
      vacancyLoss: 0,
      managementFees: 0,
      totalOperatingCosts: 0,
      totalCombinedRevenue: 0,
      revenueModel: 'sale'
    };
    
    return defaultResult;
  }
}