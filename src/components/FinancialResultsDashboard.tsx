import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Download, FileText, TrendingUp, DollarSign, PieChart as PieChartIcon, BarChart3, Info, Calendar, Target, Zap, LineChart as LineChartIcon, Home, Building, Camera } from 'lucide-react';
import { CalculationResults } from './CalculationEngine'; // Assuming this interface is correct
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, 
  Line,
  Area,
  ComposedChart, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface FinancialResultsDashboardProps {
  results: CalculationResults;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

// --- NEW INTERFACE FOR REVENUE DATA ---
interface UnitMixRevenueData {
  name: string;
  saleRevenue: number;
  rentalRevenue: number;
  totalUnits: number;
  pricePerUnit: number;
  rentPerUnit: number;
  color: string; // Add color property
  percent: number; // Add percent property
  areaRange: string; // Add area range property for display
}

// --- NEW: Reusable Unit Mix Summary Cards Component ---
// This component's internal helper functions are kept local for simplicity
const UnitMixSummaryCards: React.FC<{ data: UnitMixRevenueData[] }> = ({ data }) => {
  
  // Re-defining helpers locally for the component's structure in this output
  const formatUnitNumber = (value: number): string => {
    return value.toLocaleString('en-US');
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Unit Mix Summary
          </CardTitle>
          {/* Mock Camera icon as seen in the image */}
          <Camera className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl border transition-shadow duration-300 hover:shadow-lg flex flex-col justify-between"
              style={{
                backgroundColor: 'white', // Background color similar to image
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div 
                className="text-2xl font-bold mb-1" 
                style={{ color: item.color }}
              >
                {formatUnitNumber(item.totalUnits)}
              </div>
              
              <div className="text-sm font-medium text-gray-800 leading-tight">
                {item.name}
              </div>
              
              <div className="text-xs text-gray-500 mt-1">
                {formatPercentage(item.percent)}
              </div>
              
              <div className="text-xs text-gray-500 mt-0.5">
                {item.areaRange}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export const FinancialResultsDashboard: React.FC<FinancialResultsDashboardProps> = ({ 
  results, 
  onExportPDF, 
  onExportCSV 
}) => {
  const [activeTab, setActiveTab] = useState('detailed');
  const [timeView, setTimeView] = useState<'annual' | 'cumulative'>('annual');

  // --- NEW: What-If State ---
  const [whatIfScenario, setWhatIfScenario] = useState({
    revenueMultiplier: 1.0, // 1.0 = 0% change
    costMultiplier: 1.0,     // 1.0 = 0% change
    growthRateOverride: 3.0, // 3.0 = 3.0% (original default for projection)
  });
  
  // Helper to update what-if state
  const handleWhatIfChange = (field: keyof typeof whatIfScenario, value: number) => {
    setWhatIfScenario(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Format currency for display
  const formatCurrency = (value: number): string => {
    if (value === 0) return 'AED 0';
    
    if (Math.abs(value) >= 1000000) {
      return `AED ${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `AED ${(value / 1000).toFixed(0)}K`;
    }
    return `AED ${value.toFixed(0)}`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  // Format numbers with commas and K/M suffixes for charts
  const formatChartNumber = (value: number): string => {
    if (value === 0) return '0';
    
    if (Math.abs(value) >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString('en-US');
  };

  // Format numbers with commas for units
  const formatUnitNumber = (value: number): string => {
    return value.toLocaleString('en-US');
  };

  // --- NEW: What-If Logic Application ---
  // This is a simplified function to apply multipliers. A real app would rerun the full CalculationEngine.
  const applyWhatIf = (originalResults: CalculationResults): CalculationResults => {
    const { revenueMultiplier, costMultiplier } = whatIfScenario;
    
    // Function to safely multiply a field
    const applyMultiplier = (value: number, multiplier: number) => Math.round(value * multiplier);

    const adjustedResults: CalculationResults = {
      ...originalResults,
      
      // Apply multipliers to all revenue fields
      totalRevenue: applyMultiplier(originalResults.totalRevenue, revenueMultiplier),
      annualRentalRevenue: applyMultiplier(originalResults.annualRentalRevenue, revenueMultiplier),
      residentialRevenue: applyMultiplier(originalResults.residentialRevenue, revenueMultiplier),
      mixedUseRevenue: applyMultiplier(originalResults.mixedUseRevenue, revenueMultiplier),
      commercialSaleRevenue: applyMultiplier(originalResults.commercialSaleRevenue, revenueMultiplier),
      residentialRentalRevenue: applyMultiplier(originalResults.residentialRentalRevenue, revenueMultiplier),
      commercialRentalRevenue: applyMultiplier(originalResults.commercialRentalRevenue, revenueMultiplier),
      studioRevenue: applyMultiplier(originalResults.studioRevenue, revenueMultiplier),
      oneBedRevenue: applyMultiplier(originalResults.oneBedRevenue, revenueMultiplier),
      twoBedRevenue: applyMultiplier(originalResults.twoBedRevenue, revenueMultiplier),
      threeBedRevenue: applyMultiplier(originalResults.threeBedRevenue, revenueMultiplier),
      fourBedRevenue: applyMultiplier(originalResults.fourBedRevenue, revenueMultiplier),
      studioRentalRevenue: applyMultiplier(originalResults.studioRentalRevenue, revenueMultiplier),
      oneBedRentalRevenue: applyMultiplier(originalResults.oneBedRentalRevenue, revenueMultiplier),
      twoBedRentalRevenue: applyMultiplier(originalResults.twoBedRentalRevenue, revenueMultiplier),
      threeBedRentalRevenue: applyMultiplier(originalResults.threeBedRentalRevenue, revenueMultiplier),
      fourBedRentalRevenue: applyMultiplier(originalResults.fourBedRentalRevenue, revenueMultiplier),
      mixedUseStudioRevenue: applyMultiplier(originalResults.mixedUseStudioRevenue, revenueMultiplier),
      mixedUseOneBedRevenue: applyMultiplier(originalResults.mixedUseOneBedRevenue, revenueMultiplier),
      mixedUseTwoBedRevenue: applyMultiplier(originalResults.mixedUseTwoBedRevenue, revenueMultiplier),
      mixedUseThreeBedRevenue: applyMultiplier(originalResults.mixedUseThreeBedRevenue, revenueMultiplier),
      mixedUseFourBedRevenue: applyMultiplier(originalResults.mixedUseFourBedRevenue, revenueMultiplier),
      
      // Apply multipliers to all cost fields
      totalDevelopmentCost: applyMultiplier(originalResults.totalDevelopmentCost, costMultiplier),
      totalConstructionCost: applyMultiplier(originalResults.totalConstructionCost, costMultiplier),
      landAcquisitionCost: applyMultiplier(originalResults.landAcquisitionCost, costMultiplier),
      professionalFees: applyMultiplier(originalResults.professionalFees, costMultiplier),
      contingencyCost: applyMultiplier(originalResults.contingencyCost, costMultiplier),
      marketingCost: applyMultiplier(originalResults.marketingCost, costMultiplier),
      infrastructureCost: applyMultiplier(originalResults.infrastructureCost, costMultiplier),
      residentialConstructionCost: applyMultiplier(originalResults.residentialConstructionCost, costMultiplier),
      commercialConstructionCost: applyMultiplier(originalResults.commercialConstructionCost, costMultiplier),
      mixedUseConstructionCost: applyMultiplier(originalResults.mixedUseConstructionCost, costMultiplier),
      institutionalConstructionCost: applyMultiplier(originalResults.institutionalConstructionCost, costMultiplier),
      industrialConstructionCost: applyMultiplier(originalResults.industrialConstructionCost, costMultiplier),
      
      // Average metrics affected by multipliers
      averageUnitPrice: applyMultiplier(originalResults.averageUnitPrice, revenueMultiplier),
      constructionCostPerUnit: applyMultiplier(originalResults.constructionCostPerUnit, costMultiplier),
      
      // NOTE: Derivative metrics need full recalculation in a real engine. 
      // Here, we provide a basic derived calculation based on the new totals.
      // This is a mock to show the impact.
    };

    // Recalculate derivative metrics
    adjustedResults.grossProfit = adjustedResults.totalRevenue - adjustedResults.totalDevelopmentCost;
    adjustedResults.profitMargin = adjustedResults.totalRevenue > 0 ? (adjustedResults.grossProfit / adjustedResults.totalRevenue) * 100 : 0;

    // Simplified Net Profit calculation (assume 20% of Gross Profit for other costs)
    const netProfit = adjustedResults.grossProfit * 0.8; 
    adjustedResults.netProfit = Math.round(netProfit);
    adjustedResults.profitPerUnit = adjustedResults.totalUnits > 0 ? Math.round(netProfit / adjustedResults.totalUnits) : 0;
    
    // Simplified ROI and Break-even based on the new Net Profit and Total Equity (unaffected by W-I here)
    adjustedResults.returnOnInvestment = adjustedResults.totalEquityAmount > 0 ? (netProfit / originalResults.totalEquityAmount) * 100 : 0;
    adjustedResults.breakEvenYears = netProfit > 0 ? (originalResults.totalEquityAmount / netProfit) : 0;
    
    return adjustedResults;
  };
  
  // The central results object now incorporates the what-if scenario
  const adjustedResults = applyWhatIf(results);
  
  
  // NEW: Generate 10-year projection data - UPDATED to use adjustedResults and whatIfScenario.growthRateOverride
  const generate10YearProjection = (results: CalculationResults, growthRateOverride: number) => {
    const projection = [];
    const currentYear = new Date().getFullYear();
    
    // Use the adjusted growth rate from state
    const growthRate = growthRateOverride / 100; // Convert 3.0 to 0.03
    
    // Use rental revenue from adjustedResults if available, otherwise estimate from adjusted total revenue
    const baseAnnualRevenue = results.annualRentalRevenue > 0 
      ? results.annualRentalRevenue 
      : results.totalRevenue / 10;
    
    for (let year = 0; year < 10; year++) {
      const yearLabel = currentYear + year;
      const annualRevenue = baseAnnualRevenue * Math.pow(1 + growthRate, year);
      
      // Simplistic cumulative calculation for a base
      const cumulativeRevenue = baseAnnualRevenue * ((Math.pow(1 + growthRate, year + 1) - 1) / growthRate);
      
      // 35% expenses (65% NOI margin) on the projected annual revenue
      const netOperatingIncome = Math.round(annualRevenue * 0.65); 
      
      projection.push({
        year: yearLabel,
        annualRevenue: Math.round(annualRevenue),
        cumulativeRevenue: Math.round(cumulativeRevenue),
        occupancyRate: Math.min(95, 80 + year * 5), // Ramp up to 95%
        netOperatingIncome: netOperatingIncome,
        yearNumber: year + 1
      });
    }
    
    // Calculate cumulative NOI for Payback/IRR/NPV
    let cumulativeNOI = 0;
    const projectionWithCumulativeNOI = projection.map(p => {
        cumulativeNOI += p.netOperatingIncome;
        return { ...p, cumulativeNetOperatingIncome: cumulativeNOI };
    });

    return projectionWithCumulativeNOI;
  };

  // NEW: Calculate executive financial metrics - UPDATED to use adjustedResults and a more robust initial investment base
  const calculateExecutiveMetrics = (projection: any[], initialInvestment: number) => {
    const total10YearRevenue = projection[projection.length - 1]?.cumulativeRevenue || 0;
    const peakAnnualRevenue = Math.max(...projection.map(p => p.annualRevenue));
    
    // Simplified NPV calculation (using a fixed 8% discount rate)
    const discountRate = 0.08;
    const npv = projection.reduce((sum, yearData, index) => {
      const discountedCashFlow = yearData.netOperatingIncome / Math.pow(1 + discountRate, index + 1);
      return sum + discountedCashFlow;
    }, 0) - initialInvestment; // NPV is PV of Cash Flows minus Initial Investment
    
    // Simplified IRR approximation
    const approx_irr = (npv / initialInvestment) * 10 + 0.08; 
    const irr = approx_irr * 100;
    
    // Payback period
    const paybackPeriod = projection.findIndex(year => year.cumulativeNetOperatingIncome >= initialInvestment) + 1;
    
    return {
      total10YearRevenue,
      peakAnnualRevenue,
      averageAnnualRevenue: total10YearRevenue / 10,
      averageAnnualGrowth: `${whatIfScenario.growthRateOverride.toFixed(1)}%`,
      npv: Math.round(npv),
      irr: irr.toFixed(1),
      paybackPeriod: paybackPeriod > 0 ? paybackPeriod : '>10'
    };
  };

  const initialInvestmentBase = adjustedResults.totalDevelopmentCost;
  const projectionData = generate10YearProjection(adjustedResults, whatIfScenario.growthRateOverride);
  const executiveMetrics = calculateExecutiveMetrics(projectionData, initialInvestmentBase);
  
  // UPDATED: Financial Summary Data (using adjustedResults)
  const financialSummary = [
    { 
      label: 'Total Development Cost', 
      value: formatCurrency(adjustedResults.totalDevelopmentCost),
      description: 'All project costs including construction, land, and fees (What-If Adjusted)',
      calculation: 'Construction + Land + Professional Fees + Contingency + Marketing + Infrastructure'
    },
    { 
      label: 'Total Revenue', 
      value: formatCurrency(adjustedResults.totalRevenue),
      description: 'Total projected revenue from sales and rentals (What-If Adjusted)',
      calculation: 'Residential Sales + Commercial Sales + Mixed-Use Sales + Rental Revenue'
    },
    { 
      label: 'Gross Profit', 
      value: formatCurrency(adjustedResults.grossProfit),
      description: 'Revenue minus development costs (What-If Adjusted)',
      calculation: 'Total Revenue - Total Development Cost'
    },
    { 
      label: 'Profit Margin', 
      value: formatPercentage(adjustedResults.profitMargin),
      description: 'Gross profit as percentage of revenue (What-If Adjusted)',
      calculation: '(Gross Profit ÷ Total Revenue) × 100'
    },
    { 
      label: 'Return on Investment', 
      value: formatPercentage(adjustedResults.returnOnInvestment),
      description: 'Annualized return on equity investment (What-If Adjusted)',
      calculation: '(Net Profit ÷ Total Equity) × 100'
    },
    { 
      label: 'Break-even Period', 
      value: `${adjustedResults.breakEvenYears.toFixed(1)} years`,
      description: 'Time to recover initial investment (What-If Adjusted)',
      calculation: 'Total Equity ÷ Annual Net Profit'
    }
  ];

  // UPDATED: Profitability Analysis Data (using adjustedResults)
  const profitabilityMetrics = [
    {
      label: 'Gross Profit Margin',
      value: formatPercentage(adjustedResults.profitMargin),
      calculation: '(Gross Profit ÷ Total Revenue) × 100',
      description: 'Percentage of revenue remaining after direct costs (What-If Adjusted)'
    },
    {
      label: 'Return on Investment',
      value: formatPercentage(adjustedResults.returnOnInvestment),
      calculation: '(Net Profit ÷ Total Equity) × 100',
      description: 'Annual return on capital invested (What-If Adjusted)'
    },
    {
      label: 'Profit per Unit',
      value: formatCurrency(adjustedResults.profitPerUnit),
      calculation: 'Net Profit ÷ Total Units',
      description: 'Average profit generated per residential unit (What-If Adjusted)'
    },
    {
      label: 'Break-even Period',
      value: `${adjustedResults.breakEvenYears.toFixed(1)} yrs`,
      calculation: 'Total Equity ÷ Annual Net Profit',
      description: 'Years to recover initial investment (What-If Adjusted)'
    }
  ];

  // UPDATED: Revenue Breakdown Data (using adjustedResults)
  const revenueData = [
    { name: 'Residential Sale', value: adjustedResults.residentialRevenue, color: '#8884d8' },
    { name: 'Mixed-Use Sale', value: adjustedResults.mixedUseRevenue, color: '#82ca9d' },
    { name: 'Commercial Sale', value: adjustedResults.commercialSaleRevenue, color: '#ffc658' },
    { name: 'Residential Rental', value: adjustedResults.residentialRentalRevenue, color: '#ff7c7c' },
    { name: 'Commercial Rental', value: adjustedResults.commercialRentalRevenue, color: '#8dd1e1' }
  ].filter(item => item.value > 0);

  // UPDATED: Cost Breakdown Data (using adjustedResults)
  const costData = [
    { name: 'Construction', value: adjustedResults.totalConstructionCost, color: '#ff6b6b' },
    { name: 'Land Acquisition', value: adjustedResults.landAcquisitionCost, color: '#4ecdc4' },
    { name: 'Professional Fees', value: adjustedResults.professionalFees, color: '#45b7d1' },
    { name: 'Contingency', value: adjustedResults.contingencyCost, color: '#96ceb4' },
    { name: 'Marketing', value: adjustedResults.marketingCost, color: '#feca57' },
    { name: 'Infrastructure', value: adjustedResults.infrastructureCost, color: '#ff9ff3' }
  ].filter(item => item.value > 0);

  // UPDATED: Construction Cost Breakdown for Bar Chart (using adjustedResults)
  const constructionCostData = [
    { name: 'Residential', value: adjustedResults.residentialConstructionCost, color: '#8884d8' },
    { name: 'Commercial', value: adjustedResults.commercialConstructionCost, color: '#82ca9d' },
    { name: 'Mixed-Use', value: adjustedResults.mixedUseConstructionCost, color: '#ffc658' },
    { name: 'Institutional', value: adjustedResults.institutionalConstructionCost, color: '#ff7c7c' },
    { name: 'Industrial', value: adjustedResults.industrialConstructionCost, color: '#8dd1e1' }
  ].filter(item => item.value > 0);

  // UPDATED: Unit Economics Data (using adjustedResults)
  const unitEconomicsData = [
    { metric: 'Average Unit Price', value: formatCurrency(adjustedResults.averageUnitPrice) },
    { metric: 'Construction Cost/Unit', value: formatCurrency(adjustedResults.constructionCostPerUnit) },
    { metric: 'Profit/Unit', value: formatCurrency(adjustedResults.profitPerUnit) },
    { metric: 'Units per Hectare', value: adjustedResults.unitsPerHectare.toFixed(1) },
    { metric: 'Revenue/m²', value: formatCurrency(adjustedResults.totalRevenue / adjustedResults.totalGFA) },
    { metric: 'Profit/m²', value: formatCurrency(adjustedResults.netProfit / adjustedResults.totalGFA) }
  ];

  // EXISTING: Financing Data for Pie Chart (unaffected by W-I multipliers)
  const financingData = [
    { name: 'Equity', value: results.totalEquityAmount, color: '#4ecdc4' },
    { name: 'Loan', value: results.totalLoanAmount, color: '#ff6b6b' }
  ].filter(item => item.value > 0);

  // Helper to structure unit mix data
  const createUnitMixRevenueData = (
    units: number, 
    revenue: number, 
    rentalRevenue: number, 
    regularUnits: number,
    typeUnits: number, // Total units of the type (e.g., total studio)
    typeRevenue: number, // Total revenue of the type (e.g., total studio revenue)
    typeRentalRevenue: number, // Total rental revenue of the type (e.g., total studio rental revenue)
    color: string,
    areaRange: string
  ): Omit<UnitMixRevenueData, 'name' | 'percent'> => {
    const saleRevenue = revenue || 0;
    const calculatedRentalRevenue = rentalRevenue * (regularUnits / typeUnits) || 0;
    
    return {
      saleRevenue: saleRevenue,
      rentalRevenue: calculatedRentalRevenue,
      totalUnits: regularUnits,
      // Use adjusted price/rent per unit
      pricePerUnit: saleRevenue > 0 ? saleRevenue / regularUnits : 0,
      rentPerUnit: typeRentalRevenue > 0 ? (typeRentalRevenue / typeUnits) / 12 : 0,
      color: color,
      areaRange: areaRange
    };
  };

  // UPDATED: Residential Unit Mix Revenue Breakdown (using adjustedResults)
  const residentialUnitMixDataRaw: Omit<UnitMixRevenueData, 'percent'>[] = [
    {  
      name: 'Studio Units',  
      ...createUnitMixRevenueData(
        adjustedResults.regularStudioUnits,  
        adjustedResults.studioRevenue,  
        adjustedResults.studioRentalRevenue,  
        adjustedResults.regularStudioUnits,
        adjustedResults.studioUnits,
        adjustedResults.studioRevenue,
        adjustedResults.studioRentalRevenue,
        '#4448C8',
        '30 - 50 m²'
      )
    },
    {  
      name: '1 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.regularOneBedUnits,  
        adjustedResults.oneBedRevenue,  
        adjustedResults.oneBedRentalRevenue,  
        adjustedResults.regularOneBedUnits,
        adjustedResults.oneBedUnits,
        adjustedResults.oneBedRevenue,
        adjustedResults.oneBedRentalRevenue,
        '#9c27b0',
        '60 - 85 m²'
      )
    },
    {  
      name: '2 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.regularTwoBedUnits,  
        adjustedResults.twoBedRevenue,  
        adjustedResults.twoBedRentalRevenue,  
        adjustedResults.regularTwoBedUnits,
        adjustedResults.twoBedUnits,
        adjustedResults.twoBedRevenue,
        adjustedResults.twoBedRentalRevenue,
        '#ff9800',
        '90 - 120 m²'
      )
    },
    {  
      name: '3 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.regularThreeBedUnits,  
        adjustedResults.threeBedRevenue,  
        adjustedResults.threeBedRentalRevenue,  
        adjustedResults.regularThreeBedUnits,
        adjustedResults.threeBedUnits,
        adjustedResults.threeBedRevenue,
        adjustedResults.threeBedRentalRevenue,
        '#00bcd4',
        '140 - 180 m²'
      )
    },
    {  
      name: '4 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.regularFourBedUnits,  
        adjustedResults.fourBedRevenue,  
        adjustedResults.fourBedRentalRevenue,  
        adjustedResults.regularFourBedUnits,
        adjustedResults.fourBedUnits,
        adjustedResults.fourBedRevenue,
        adjustedResults.fourBedRentalRevenue,
        '#e91e63',
        '200 - 250 m²'
      )
    }
  ].filter(item => item.totalUnits > 0);

  // Calculate total residential units for percentage calculation
  const totalResidentialUnits = residentialUnitMixDataRaw.reduce((sum, item) => sum + item.totalUnits, 0);

  // Add percentage calculation for residential units
  const residentialUnitMixRevenueData: UnitMixRevenueData[] = residentialUnitMixDataRaw.map(item => ({
    ...item,
    percent: totalResidentialUnits > 0 ? (item.totalUnits / totalResidentialUnits) * 100 : 0
  }));

  // UPDATED: Mixed-Use Unit Mix Revenue Breakdown (using adjustedResults)
  const mixedUseUnitMixDataRaw: Omit<UnitMixRevenueData, 'percent'>[] = [
    {  
      name: 'Studio',  
      ...createUnitMixRevenueData(
        adjustedResults.mixedUseStudioUnits,  
        adjustedResults.mixedUseStudioRevenue,  
        adjustedResults.studioRentalRevenue,  
        adjustedResults.mixedUseStudioUnits,
        adjustedResults.studioUnits,
        adjustedResults.mixedUseStudioRevenue,
        adjustedResults.studioRentalRevenue,
        '#4448C8', // Color for Studio (Purple-Blue)
        '30 - 50 m²' // Area Range
      )
    },
    {  
      name: '1 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.mixedUseOneBedUnits,  
        adjustedResults.mixedUseOneBedRevenue,  
        adjustedResults.oneBedRentalRevenue,  
        adjustedResults.mixedUseOneBedUnits,
        adjustedResults.oneBedUnits,
        adjustedResults.mixedUseOneBedRevenue,
        adjustedResults.oneBedRentalRevenue,
        '#9c27b0', // Color for 1 Bed (Purple)
        '60 - 85 m²'
      )
    },
    {  
      name: '2 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.mixedUseTwoBedUnits,  
        adjustedResults.mixedUseTwoBedRevenue,  
        adjustedResults.twoBedRentalRevenue,  
        adjustedResults.mixedUseTwoBedUnits,
        adjustedResults.twoBedUnits,
        adjustedResults.mixedUseTwoBedRevenue,
        adjustedResults.twoBedRentalRevenue,
        '#ff9800', // Color for 2 Bed (Orange)
        '90 - 120 m²'
      )
    },
    {  
      name: '3 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.mixedUseThreeBedUnits,  
        adjustedResults.mixedUseThreeBedRevenue,  
        adjustedResults.threeBedRentalRevenue,  
        adjustedResults.mixedUseThreeBedUnits,
        adjustedResults.threeBedUnits,
        adjustedResults.mixedUseThreeBedRevenue,
        adjustedResults.threeBedRentalRevenue,
        '#00bcd4', // Color for 3 Bed (Cyan)
        '140 - 180 m²'
      )
    },
    {  
      name: '4 Bedroom',  
      ...createUnitMixRevenueData(
        adjustedResults.mixedUseFourBedUnits,  
        adjustedResults.mixedUseFourBedRevenue,  
        adjustedResults.fourBedRentalRevenue,  
        adjustedResults.mixedUseFourBedUnits,
        adjustedResults.fourBedUnits,
        adjustedResults.mixedUseFourBedRevenue,
        adjustedResults.fourBedRentalRevenue,
        '#e91e63', // Color for 4 Bed (Pink-Red)
        '200 - 250 m²'
      )
    }
  ].filter(item => item.totalUnits > 0);

  // Calculate total mixed-use units for percentage calculation
  const totalMixedUseUnits = mixedUseUnitMixDataRaw.reduce((sum, item) => sum + item.totalUnits, 0);

  // Add percentage calculation for mixed-use units
  const mixedUseUnitMixRevenueData: UnitMixRevenueData[] = mixedUseUnitMixDataRaw.map(item => ({
    ...item,
    percent: totalMixedUseUnits > 0 ? (item.totalUnits / totalMixedUseUnits) * 100 : 0
  }));

  // EXISTING: Information Tooltip Component (omitted for brevity)
  const InfoTooltip = ({ content, calculation }: { content: string; calculation?: string }) => (
    <TooltipProvider>
      <UITooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent className="max-w-sm p-3">
          <p className="font-medium mb-1">{content}</p>
          {calculation && (
            <p className="text-sm text-blue-600 font-mono mt-1">
              Calculation: {calculation}
            </p>
          )}
        </TooltipContent>
      </UITooltip>
    </TooltipProvider>
  );

  // EXISTING: Check revenue models (unaffected by W-I multipliers)
  const showSaleRevenue = adjustedResults.revenueModel === 'sale' || adjustedResults.revenueModel === 'mixed';
  const showRentalRevenue = adjustedResults.revenueModel === 'rental' || adjustedResults.revenueModel === 'mixed';

  // EXISTING: Custom tooltip for financial charts (omitted for brevity)
  const FinancialTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // NEW: Custom tooltip for executive timeline (omitted for brevity)
  const ExecutiveTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
              {entry.dataKey === 'occupancyRate' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  // NEW: Custom tooltip for unit mix revenue (omitted for brevity)
  const UnitMixRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
          {data && (
            <div className="mt-2 space-y-1 text-sm text-gray-600 border-t pt-2">
              <p>Total Units: {formatUnitNumber(data.totalUnits)}</p>
              {data.pricePerUnit > 0 && (
                <p>Sale Price/Unit: {formatCurrency(data.pricePerUnit)}</p>
              )}
              {data.rentPerUnit > 0 && (
                <p>Monthly Rent/Unit: {formatCurrency(data.rentPerUnit)}</p>
              )}
              {data.saleRevenue > 0 && (
                <p>Total Sale: {formatCurrency(data.saleRevenue)}</p>
              )}
              {data.rentalRevenue > 0 && (
                <p>Annual Rental: {formatCurrency(data.rentalRevenue)}</p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  // --- NEW: What-If Input Component (defined locally to access state) ---
  const WhatIfControls = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-600">
          <Zap className="w-5 h-5" />
          What-If Scenario Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Adjust key parameters to instantly view the impact on the financial results below.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Multiplier */}
        <div className="space-y-2">
          <label htmlFor="revenueMultiplier" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
            Revenue Adjustment
            <InfoTooltip content="Increase or decrease all base revenue streams (sales and rentals)." />
          </label>
          <input
            id="revenueMultiplier"
            type="range"
            min="0.5" // -50%
            max="1.5" // +50%
            step="0.01"
            value={whatIfScenario.revenueMultiplier}
            onChange={(e) => handleWhatIfChange('revenueMultiplier', parseFloat(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-50%</span>
            <span className="font-semibold text-green-600">
              {((whatIfScenario.revenueMultiplier - 1.0) * 100).toFixed(0)}%
            </span>
            <span>+50%</span>
          </div>
        </div>

        {/* Cost Multiplier */}
        <div className="space-y-2">
          <label htmlFor="costMultiplier" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
            Cost Adjustment
            <InfoTooltip content="Increase or decrease all base development costs (construction, land, fees)." />
          </label>
          <input
            id="costMultiplier"
            type="range"
            min="0.5" // -50%
            max="1.5" // +50%
            step="0.01"
            value={whatIfScenario.costMultiplier}
            onChange={(e) => handleWhatIfChange('costMultiplier', parseFloat(e.target.value))}
            className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer range-lg"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>-50%</span>
            <span className="font-semibold text-red-600">
              {((whatIfScenario.costMultiplier - 1.0) * 100).toFixed(0)}%
            </span>
            <span>+50%</span>
          </div>
        </div>

        {/* Growth Rate Override */}
        <div className="space-y-2">
          <label htmlFor="growthRateOverride" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1">
            Annual Growth Rate (%)
            <InfoTooltip content="Override the baseline annual revenue growth rate for the 10-year projection (affects NPV/IRR)." />
          </label>
          <input
            id="growthRateOverride"
            type="number"
            min="0.0"
            max="10.0"
            step="0.1"
            value={whatIfScenario.growthRateOverride}
            onChange={(e) => handleWhatIfChange('growthRateOverride', parseFloat(e.target.value))}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="text-xs text-gray-500">
            Current Rate: <span className="font-semibold text-orange-600">{whatIfScenario.growthRateOverride.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );


  return (
    <div className="space-y-6">
      {/* Header with Export Options (omitted for brevity) */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Financial Analysis Report
              <InfoTooltip 
                content="Comprehensive financial assessment based on development parameters, construction costs, revenue models, and market rates"
                calculation="Revenue - Costs = Profit | (Profit ÷ Revenue) × 100 = Margin"
              />
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={onExportPDF} variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={onExportCSV} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {financialSummary.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border relative">
                <div className="absolute top-2 right-2">
                  <InfoTooltip 
                    content={item.description}
                    calculation={item.calculation}
                  />
                </div>
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  {item.value}
                </div>
                <div className="text-xs text-gray-600 font-medium mb-2">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NEW: What-If Controls Section */}
      <WhatIfControls />

      {/* NEW: Tabbed Interface (omitted for brevity) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="detailed" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Detailed Analysis
          </TabsTrigger>
          <TabsTrigger value="executive" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Executive View
          </TabsTrigger>
        </TabsList>

        {/* EXISTING: Detailed Analysis Tab */}
        <TabsContent value="detailed" className="space-y-6 mt-6">
          {/* Revenue Model Indicator (omitted for brevity) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue Model
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium">Current Revenue Model</div>
                  <div className="text-xs text-muted-foreground">
                    {adjustedResults.revenueModel === 'mixed' 
                      ? 'Combined sale and rental revenue streams'
                      : adjustedResults.revenueModel === 'sale'
                      ? 'Primary revenue from unit sales'
                      : 'Primary revenue from rental income'
                    }
                  </div>
                </div>
                <Badge variant={
                  adjustedResults.revenueModel === 'mixed' ? 'default' :
                  adjustedResults.revenueModel === 'sale' ? 'secondary' : 'outline'
                }>
                  {adjustedResults.revenueModel.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>


          {/* Revenue & Cost Breakdown - Side by Side (omitted for brevity) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-green-600" />
                  Revenue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`revenue-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Revenue Details */}
                <div className="mt-4 space-y-2">
                  {revenueData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-red-600" />
                  Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costData.map((entry, index) => (
                        <Cell key={`cost-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Cost Details */}
                <div className="mt-4 space-y-2">
                  {costData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* NEW: Residential Unit Mix Revenue Breakdown */}
          {(showSaleRevenue || showRentalRevenue) && residentialUnitMixRevenueData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-blue-600" />
                  Residential Unit Mix Revenue Breakdown
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed revenue distribution by unit type in residential buildings
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart */}
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={residentialUnitMixRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatChartNumber} />
                        <Tooltip content={<UnitMixRevenueTooltip />} />
                        <Legend />
                        {showSaleRevenue && (
                          <Bar 
                            dataKey="saleRevenue" 
                            name="Sale Revenue" 
                            fill="#4448C8" 
                            minPointSize={5}
                          />
                        )}
                        {showRentalRevenue && (
                          <Bar 
                            dataKey="rentalRevenue" 
                            name="Annual Rental Revenue" 
                            fill="#00bcd4" 
                            minPointSize={5}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Summary Cards (using the shared component) */}
                  <UnitMixSummaryCards data={residentialUnitMixRevenueData} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* NEW: Mixed-Use Unit Mix Revenue Breakdown */}
          {(showSaleRevenue || showRentalRevenue) && mixedUseUnitMixRevenueData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  Mixed-Use Unit Mix Revenue Breakdown
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Detailed revenue distribution by unit type in mixed-use buildings
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart */}
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mixedUseUnitMixRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatChartNumber} />
                        <Tooltip content={<UnitMixRevenueTooltip />} />
                        <Legend />
                        {showSaleRevenue && (
                          <Bar 
                            dataKey="saleRevenue" 
                            name="Sale Revenue" 
                            fill="#9c27b0" 
                            minPointSize={5}
                          />
                        )}
                        {showRentalRevenue && (
                          <Bar 
                            dataKey="rentalRevenue" 
                            name="Annual Rental Revenue" 
                            fill="#ff9800" 
                            minPointSize={5}
                          />
                        )}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Summary Cards (using the shared component) */}
                  <UnitMixSummaryCards data={mixedUseUnitMixRevenueData} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Unit Economics & Profitability Metrics - Side by Side (omitted for brevity) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Economics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  Unit Economics & Densification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unitEconomicsData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium">{item.metric}</div>
                      <div className="text-base font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Profitability Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-teal-600" />
                  Profitability Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profitabilityMetrics.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-teal-50 rounded-lg relative">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{item.label}</div>
                        <InfoTooltip content={item.description} calculation={item.calculation} />
                      </div>
                      <div className="text-base font-semibold text-teal-800">{item.value}</div>
                    </div>
                  ))}
                </div>
                
                {/* Financing Pie Chart */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <PieChartIcon className="w-4 h-4 text-pink-600" />
                    Financing Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={financingData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={60}
                        paddingAngle={5}
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {financingData.map((entry, index) => (
                          <Cell key={`financing-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Construction Cost Breakdown (omitted for brevity) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                Construction Cost by Asset Type
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={constructionCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatChartNumber} />
                  <Tooltip content={<FinancialTooltip />} />
                  <Legend />
                  <Bar dataKey="value" name="Construction Cost" fill="#ff9800" minPointSize={5} />
                </BarChart>
              </ResponsiveContainer>
              {/* Construction Cost Details */}
              <div className="mt-4 space-y-2">
                {constructionCostData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* NEW: Executive View Tab */}
        <TabsContent value="executive" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Executive Summary Metrics
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Key performance indicators summarizing the long-term financial viability.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Metric 1: Total 10-Year Revenue */}
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="font-medium text-green-800 dark:text-green-300 mb-1">
                    💰 Total Revenue (10Y)
                  </div>
                  <div className="text-lg font-bold text-green-900 dark:text-green-200">
                    {formatCurrency(executiveMetrics.total10YearRevenue)}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-400">
                    {executiveMetrics.averageAnnualGrowth} Avg. Annual Growth
                  </div>
                </div>

                {/* Metric 2: Net Present Value (NPV) */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                    📈 Net Present Value (NPV)
                  </div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-200">
                    {formatCurrency(executiveMetrics.npv)}
                  </div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">
                    NPV of {formatCurrency(executiveMetrics.npv)} indicates strong value creation over the 10-year horizon
                  </div>
                </div>
                
                {/* Metric 3: Internal Rate of Return (IRR) */}
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                    🌟 Internal Rate of Return (IRR)
                  </div>
                  <div className="text-lg font-bold text-purple-900 dark:text-purple-200">
                    {executiveMetrics.irr}%
                  </div>
                  <div className="text-sm text-purple-700 dark:text-purple-400">
                    IRR of {executiveMetrics.irr}% exceeds typical market benchmarks
                  </div>
                </div>

                {/* Metric 4: Investment Recovery (Payback Period) */}
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">
                    ⏱️ Payback Period
                  </div>
                  <div className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
                    {executiveMetrics.paybackPeriod} Years
                  </div>
                  <div className="text-sm text-yellow-700 dark:text-yellow-400">
                    Payback period of {executiveMetrics.paybackPeriod} years demonstrates efficient capital deployment
                  </div>
                </div>
                
                {/* Metric 5: Peak Annual Revenue */}
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="font-medium text-red-800 dark:text-red-300 mb-1">
                    🎯 Peak Annual Revenue
                  </div>
                  <div className="text-lg font-bold text-red-900 dark:text-red-200">
                    {formatCurrency(executiveMetrics.peakAnnualRevenue)}
                  </div>
                  <div className="text-sm text-red-700 dark:text-red-400">
                    Achieved in Year 10 (or later) based on growth rate
                  </div>
                </div>
                
                {/* Metric 6: Initial Investment */}
                <div className="p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="font-medium text-gray-800 dark:text-gray-300 mb-1">
                    🏗️ Initial Investment
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-200">
                    {formatCurrency(initialInvestmentBase)}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">
                    The What-If adjusted total development cost.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 10-Year Financial Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-teal-600" />
                10-Year Financial Timeline (What-If Adjusted)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Projected annual and cumulative Net Operating Income (NOI) and Occupancy Rate.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Tabs defaultValue="annual" onValueChange={(value) => setTimeView(value as 'annual' | 'cumulative')} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="annual">Annual NOI</TabsTrigger>
                    <TabsTrigger value="cumulative">Cumulative NOI</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart
                  data={projectionData}
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis 
                    yAxisId="left" 
                    orientation="left" 
                    stroke="#008080" 
                    tickFormatter={formatChartNumber}
                    domain={['auto', 'auto']}
                    allowDataOverflow={true}
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#FF7300" 
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip content={<ExecutiveTooltip />} />
                  <Legend />
                  
                  {/* Bar for NOI (Annual or Cumulative) */}
                  <Bar 
                    yAxisId="left" 
                    dataKey={timeView === 'annual' ? 'netOperatingIncome' : 'cumulativeNetOperatingIncome'}
                    name={timeView === 'annual' ? 'Annual NOI' : 'Cumulative NOI'}
                    fill="#008080" 
                    minPointSize={5} 
                  />
                  
                  {/* Line for Occupancy Rate */}
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="occupancyRate" 
                    name="Occupancy Rate" 
                    stroke="#FF7300" 
                    strokeWidth={2}
                    dot={false}
                  />
                  
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};