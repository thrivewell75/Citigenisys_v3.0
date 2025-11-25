// CalculationEngine.test.tsx

import { DevelopmentParameters } from './ParametersFormEnhanced';
import { TechnicalResults } from './CalculationEngine'; // Assuming TechnicalResults is defined and exported
import { EconomicsCalculator } from './CalculationEngine'; 

// --- MOCK INPUTS ---

// Define a realistic total area for calculation context (1 Hectare = 10,000 sqm)
const TEST_AREA = 10000; 

// Mock technical results that align with the area and parameters for easy verification
const mockTechnicalResults: TechnicalResults = {
  totalArea: TEST_AREA,
  // 50% Residential, 10% Commercial, 5% Mixed-Use GFA (for simplicity)
  residentialGFA: 50000, 
  commercialGFA: 10000, 
  mixedUseGFA: 5000, 
  
  // Unit Counts for Revenue
  totalUnits: 500,
  studioUnits: 100, // 100 * 500,000 = 50M
  oneBedUnits: 200, // 200 * 800,000 = 160M
  commercialUnits: 0, // No unit count for commercial GFA, use GFA for revenue
  
  // Other necessary fields from TechnicalResults, set to 0 or appropriate mocks
  twoBedUnits: 100, threeBedUnits: 50, fourBedUnits: 50,
  mixedUseUnits: 0, publicRealmArea: 0, // ... and so on
  
  // Placeholder values for full TechnicalResults interface (ensure all fields are present)
  openSpaceArea: 0, residentialArea: 0, commercialArea: 0, institutionalArea: 0, industrialArea: 0, mixedUseArea: 0, publicRealmPercent: 0,
  institutionalGFA: 0, industrialGFA: 0, mixedUseResidentialGFA: 0, mixedUseCommercialGFA: 0, mixedUseInstitutionalGFA: 0, totalGFA: 0,
  residentialPlots: 0, commercialPlots: 0, institutionalPlots: 0, industrialPlots: 0, mixedUsePlots: 0, totalPlots: 0, 
  residentialStudioPlots: 0, residentialOneBedPlots: 0, residentialTwoBedPlots: 0, residentialThreeBedPlots: 0, residentialFourBedPlots: 0,
  residentialBlocks: 0, commercialBlocks: 0, institutionalBlocks: 0, industrialBlocks: 0, mixedUseBlocks: 0, totalBlocks: 0,
  affordableUnits: 0, marketRateUnits: 0, executiveUnits: 0, 
  totalPopulation: 0, totalParkingSpaces: 0, accessibleParking: 0, disabledParking: 0,
  unitsPerHectare: 0, peoplePerHectare: 0, plotRatio: 0,
  residentialFAR: 0, commercialFAR: 0, mixedUseFAR: 0, institutionalFAR: 0, industrialFAR: 0,

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

// Define parameters for easy calculation verification
const mockEconomicParameters: DevelopmentParameters = {
  // PHASE 1A: NEW REVENUE MODEL
  revenueModel: 'sale',
  
  // Costs (per sqm/hectare)
  residentialConstructionCost: 1000, // 50,000 * 1000 = 50M
  commercialConstructionCost: 1500, // 10,000 * 1500 = 15M
  mixedUseConstructionCost: 1200, // 5,000 * 1200 = 6M
  
  // Soft Costs based on Construction Cost
  professionalFeesPercent: 10, // 10%
  contingencyPercent: 5,       // 5%
  
  // Site Costs
  infrastructureCostPerSqm: 50000, // 1 Hectare * 50,000 = 500K
  landAcquisitionCostPerHectare: 1000000, // 1 Hectare * 1,000,000 = 1M
  
  // Revenues
  studioSalePrice: 500000, 
  oneBedSalePrice: 800000, 
  commercialSalePrice: 10000, // 10,000 sqm * 10,000 = 100M
  
  // PHASE 1A: NEW RENTAL PARAMETERS
  studioRentPerMonth: 40000,
  oneBedRentPerMonth: 60000,
  twoBedRentPerMonth: 90000,
  threeBedRentPerMonth: 120000,
  fourBedRentPerMonth: 160000,
  commercialRentPerSqM: 1000,
  rentalVacancyRate: 5,
  propertyManagementFee: 8,
  annualRentIncrease: 3,
  rentalOperatingCosts: 5000,
  
  // Other necessary fields from DevelopmentParameters (ensure all fields are present)
  developmentType: 'Mixed-Use', densityLevel: 'Medium', budgetClassification: 'Market Rate', 
  openSpacePercent: 10, publicRealmPercent: 5, residentialPercent: 50, commercialPercent: 10, institutionalPercent: 5, industrialPercent: 5, mixedUsePercent: 15,
  residentialPlotCoverage: 60, commercialPlotCoverage: 70, mixedUsePlotCoverage: 65, institutionalPlotCoverage: 60, industrialPlotCoverage: 60, 
  residentialParkingRatio: 1.5, commercialParkingRatio: 1.0, mixedUseParkingRatio: 1.2, institutionalParkingRatio: 0.5, industrialParkingRatio: 0.4, 
  residentialFAR: 5.0, commercialFAR: 4.0, mixedUseFAR: 3.5, institutionalFAR: 3.0, industrialFAR: 2.5,
  landAcquisitionCost: 0, marketingCostPercent: 0, financingInterestRate: 0, loanToValueRatio: 0, equityPercentage: 0,
  twoBedSalePrice: 0, threeBedSalePrice: 0, fourBedSalePrice: 0, 
  mixedUseStudioSalePrice: 0, mixedUseOneBedSalePrice: 0, mixedUseTwoBedSalePrice: 0, mixedUseThreeBedSalePrice: 0, mixedUseFourBedSalePrice: 0,
  commercialRentalRate: 0,
  mixedUseFloors: 0, residentialFloors: 0, commercialFloors: 0, institutionalFloors: 0, industrialFloors: 0,
  mixedUseBlockSize: 0, residentialBlockSize: 0, commercialBlockSize: 0, institutionalBlockSize: 0, industrialBlockSize: 0,
  mixedUsePlotSize: 0, residentialPlotSize: 0, commercialPlotSize: 0, institutionalPlotSize: 0, industrialPlotSize: 0,
  residentialStudioPlotSize: 0, residentialOneBedPlotSize: 0, residentialTwoBedPlotSize: 0, residentialThreeBedPlotSize: 0, residentialFourBedPlotSize: 0,
  mixedUseStudioPercent: 0, mixedUseOneBedPercent: 0, mixedUseTwoBedPercent: 0, mixedUseThreeBedPercent: 0, mixedUseFourBedPercent: 0,
  residentialStudioPercent: 0, residentialOneBedPercent: 0, residentialTwoBedPercent: 0, residentialThreeBedPercent: 0, residentialFourBedPercent: 0,
  mixedUseStudioSize: 0, mixedUseOneBedSize: 0, mixedUseTwoBedSize: 0, mixedUseThreeBedSize: 0, mixedUseFourBedSize: 0,
  parkingSpacesPerUnit: 0, guestParkingPercent: 0, disabledParkingPercent: 0,
  adultsPercent: 0, childrenPercent: 0,
  institutionalConstructionCost: 0, industrialConstructionCost: 0,
  developmentTimelineMonths: 0
};

// --- CALCULATOR TEST SUITE ---

describe('EconomicsCalculator', () => {
    // We will run the calculator once and check all metrics

    const result = EconomicsCalculator.calculate(mockTechnicalResults, mockEconomicParameters);

    // --- EXPECTED CALCULATIONS ---
    
    // 1. Total Construction Cost (TCC)
    // TCC = (50,000*1000) + (10,000*1500) + (5,000*1200) = 50M + 15M + 6M = 71,000,000
    const EXPECTED_TCC = 71000000; 

    // 2. Total Soft Cost (TSC) - Based on TCC (10% Prof Fees + 5% Contingency = 15%)
    // TSC = 71,000,000 * 0.15 = 10,650,000
    const EXPECTED_TSC = 10650000;

    // 3. Site Costs (SC)
    // SC = Land Acquisition (1M) + Infrastructure (500K) = 1,500,000
    const EXPECTED_SC = 1500000;

    // 4. Total Development Cost (TDC)
    // TDC = TCC + TSC + SC = 71,000,000 + 10,650,000 + 1,500,000 = 83,150,000
    const EXPECTED_TDC = 83150000;

    // 5. Total Potential Revenue (TPR)
    // TPR = (100 * 500,000) + (200 * 800,000) + (10,000 * 10,000)
    // TPR = 50M + 160M + 100M = 310,000,000
    const EXPECTED_TPR = 310000000;
    
    // 6. Gross Profit (GP) - Assuming GP = TPR - TDC for quick assessment
    // GP = 310,000,000 - 83,150,000 = 226,850,000
    const EXPECTED_GP = 226850000;

    // 7. Profit Margin (PM)
    // PM = (GP / TPR) * 100 = (226,850,000 / 310,000,000) * 100 ≈ 73.18%
    const EXPECTED_PM = (EXPECTED_GP / EXPECTED_TPR) * 100;

    
    test('should correctly calculate all key financial metrics', () => {
        // Assert Costs
        expect(result.totalConstructionCost).toBeCloseTo(EXPECTED_TCC);
        expect(result.professionalFees).toBeCloseTo(EXPECTED_TCC * 0.10);
        expect(result.totalDevelopmentCost).toBeCloseTo(EXPECTED_TDC);
        
        // Assert Revenue
        expect(result.totalRevenue).toBeCloseTo(EXPECTED_TPR);
        
        // Assert Profitability
        expect(result.grossProfit).toBeCloseTo(EXPECTED_GP); 
        expect(result.profitMargin).toBeCloseTo(EXPECTED_PM, 2); // Check margin to 2 decimal places
    });

    test('should return 0 margin if no revenue is generated', () => {
        const zeroRevenueParams = {
            ...mockEconomicParameters,
            studioSalePrice: 0, oneBedSalePrice: 0, commercialSalePrice: 0
        };
        const resultZero = EconomicsCalculator.calculate(mockTechnicalResults, zeroRevenueParams);

        expect(resultZero.totalRevenue).toBe(0);
        // Gross Profit should be negative (equal to negative development cost)
        expect(resultZero.grossProfit).toBeCloseTo(-EXPECTED_TDC); 
        expect(resultZero.profitMargin).toBe(0); // Margin should report 0 if revenue is 0
    });
});

// PHASE 1A: NEW RENTAL REVENUE TESTS
describe('EconomicsCalculator Rental Revenue', () => {
  test('should calculate rental revenue correctly', () => {
    const rentalParams = {
      ...mockEconomicParameters,
      revenueModel: 'rental',
      // Zero out sale prices to test rental-only model
      studioSalePrice: 0,
      oneBedSalePrice: 0,
      commercialSalePrice: 0
    };
    
    const result = EconomicsCalculator.calculate(mockTechnicalResults, rentalParams);
    
    // Test that rental revenue is calculated
    expect(result.totalRentalRevenue).toBeGreaterThan(0);
    expect(result.annualRentalRevenue).toBeGreaterThan(0);
    expect(result.revenueModel).toBe('rental');
    expect(result.grossPotentialRent).toBeGreaterThan(0);
    expect(result.effectiveGrossRent).toBeGreaterThan(0);
    expect(result.netOperatingIncome).toBeDefined();
  });

  test('should handle mixed revenue model', () => {
    const mixedParams = {
      ...mockEconomicParameters,
      revenueModel: 'mixed'
    };
    
    const result = EconomicsCalculator.calculate(mockTechnicalResults, mixedParams);
    
    // Test that both sale and rental revenues are present
    expect(result.totalRevenue).toBeGreaterThan(0);
    expect(result.totalRentalRevenue).toBeGreaterThan(0);
    expect(result.totalCombinedRevenue).toBeGreaterThan(result.totalRevenue);
    expect(result.revenueModel).toBe('mixed');
  });

  test('should calculate rental operating metrics correctly', () => {
    const rentalParams = {
      ...mockEconomicParameters,
      revenueModel: 'rental',
      studioSalePrice: 0,
      oneBedSalePrice: 0,
      commercialSalePrice: 0
    };
    
    const result = EconomicsCalculator.calculate(mockTechnicalResults, rentalParams);
    
    // Test rental operating metrics
    expect(result.vacancyLoss).toBeGreaterThanOrEqual(0);
    expect(result.managementFees).toBeGreaterThanOrEqual(0);
    expect(result.totalOperatingCosts).toBeGreaterThanOrEqual(0);
    expect(result.netOperatingIncome).toBeLessThanOrEqual(result.effectiveGrossRent);
  });
});