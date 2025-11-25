import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  Settings,
  Sliders,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Save,
  FolderOpen,
  Trash2,
  Download,
  Upload,
  DollarSign,
  Building,
  Home
} from 'lucide-react';

export interface DevelopmentParameters {
  developmentType: 'Mixed-Use' | 'Gated Community' | 'Rural';
  densityLevel: 'High' | 'Medium' | 'Low';
  budgetClassification: 'Affordable' | 'Market Rate' | 'Executive';
  
  // PHASE 1A: NEW REVENUE MODEL PARAMETERS
  revenueModel: 'sale' | 'rental' | 'mixed';
  
  // Land Use Allocations (percentages)
  openSpacePercent: number;
  publicRealmPercent: number;
  residentialPercent: number;
  commercialPercent: number;
  institutionalPercent: number;
  industrialPercent: number;
  mixedUsePercent: number;
  
  // NEW: Mixed-Use Breakdown Percentages
  mixedUseResidentialPercent: number;
  mixedUseCommercialPercent: number;
  mixedUseInstitutionalPercent: number;
  
  // Plot Coverage by Type (percentages)
  residentialPlotCoverage: number;
  commercialPlotCoverage: number;
  mixedUsePlotCoverage: number;
  industrialPlotCoverage: number;
  institutionalPlotCoverage: number;
  
  // Number of Floors by Type
  mixedUseFloors: number;
  residentialFloors: number;
  commercialFloors: number;
  institutionalFloors: number;
  industrialFloors: number;

  // Block Sizes (sqm) - NOW CONFIGURABLE
  mixedUseBlockSize: number;
  residentialBlockSize: number;
  commercialBlockSize: number;
  institutionalBlockSize: number;
  industrialBlockSize: number;
  
  // Plot Sizes (sqm)
  mixedUsePlotSize: number;
  residentialPlotSize: number;
  commercialPlotSize: number;
  institutionalPlotSize: number;
  industrialPlotSize: number;
  
  // NEW: Residential Plot Sizes by Unit Type (sqm)
  residentialStudioPlotSize: number;
  residentialOneBedPlotSize: number;
  residentialTwoBedPlotSize: number;
  residentialThreeBedPlotSize: number;
  residentialFourBedPlotSize: number;
  
  // Unit Mix (percentages by bedroom count) - MIXED-USE
  mixedUseStudioPercent: number;
  mixedUseOneBedPercent: number;
  mixedUseTwoBedPercent: number;
  mixedUseThreeBedPercent: number;
  mixedUseFourBedPercent: number;
  
  // Unit Mix (percentages by bedroom count) - RESIDENTIAL
  residentialStudioPercent: number;
  residentialOneBedPercent: number;
  residentialTwoBedPercent: number;
  residentialThreeBedPercent: number;
  residentialFourBedPercent: number;
  
  // NEW: Mixed-Use Unit Sizes (sqm)
  mixedUseStudioSize: number;
  mixedUseOneBedSize: number;
  mixedUseTwoBedSize: number;
  mixedUseThreeBedSize: number;
  mixedUseFourBedSize: number;
  
  // Parking Parameters
  parkingSpacesPerUnit: number;
  guestParkingPercent: number;
  disabledParkingPercent: number;
  
  // Demographics
  adultsPercent: number;
  childrenPercent: number;

  // PHASE 1A: ECONOMIC PARAMETERS
  // Construction Costs (AED per sqm)
  residentialConstructionCost: number;
  commercialConstructionCost: number;
  mixedUseConstructionCost: number;
  institutionalConstructionCost: number;
  industrialConstructionCost: number;
  infrastructureCostPerSqm: number;
  
  // Residential Sales Prices (AED per unit)
  studioSalePrice: number;
  oneBedSalePrice: number;
  twoBedSalePrice: number;
  threeBedSalePrice: number;
  fourBedSalePrice: number;
  
  // Commercial Sales/Rental Rates (AED per sqm)
  commercialSalePrice: number;
  commercialRentalRate: number;
  
  // Mixed-Use Sales Prices (AED per unit)
  mixedUseStudioSalePrice: number;
  mixedUseOneBedSalePrice: number;
  mixedUseTwoBedSalePrice: number;
  mixedUseThreeBedSalePrice: number;
  mixedUseFourBedSalePrice: number;
  
  // Development Timeline & Costs
  developmentTimelineMonths: number;
  landAcquisitionCost: number;
  professionalFeesPercent: number;
  contingencyPercent: number;
  marketingCostPercent: number;
  
  // Financing Parameters
  financingInterestRate: number;
  loanToValueRatio: number;
  equityPercentage: number;

  // PHASE 1A: NEW RENTAL-SPECIFIC PARAMETERS
  // Residential Rental Rates (AED per month)
  studioRentPerMonth: number;
  oneBedRentPerMonth: number;
  twoBedRentPerMonth: number;
  threeBedRentPerMonth: number;
  fourBedRentPerMonth: number;
  
  // Commercial Rental Rates
  commercialRentPerSqM: number; // AED per sqm per month
  
  // Rental Business Parameters
  rentalVacancyRate: number; // Percentage (0-100)
  propertyManagementFee: number; // Percentage (0-100)
  annualRentIncrease: number; // Percentage (0-100)
  rentalOperatingCosts: number; // AED per unit per month
}

// Default parameters that will be used if none are provided
export const defaultDevelopmentParameters: DevelopmentParameters = {
  developmentType: 'Mixed-Use',
  densityLevel: 'High',
  budgetClassification: 'Market Rate',

  // PHASE 1A: NEW REVENUE MODEL DEFAULTS
  revenueModel: 'sale',
  
  openSpacePercent: 20,
  publicRealmPercent: 20,
  residentialPercent: 10,
  commercialPercent: 10,
  institutionalPercent: 7,
  industrialPercent: 7,
  mixedUsePercent: 26,
  
  // NEW: Mixed-Use Breakdown Defaults
  mixedUseResidentialPercent: 60,
  mixedUseCommercialPercent: 30,
  mixedUseInstitutionalPercent: 10,
  
  residentialPlotCoverage: 30,
  commercialPlotCoverage: 30,
  mixedUsePlotCoverage: 30,
  industrialPlotCoverage: 30,
  institutionalPlotCoverage: 30,
  mixedUseFloors: 20,
  residentialFloors: 2,
  commercialFloors: 4,
  institutionalFloors: 2,
  industrialFloors: 2,

  // NEW: Configurable Block Sizes (matching original hardcoded values)
  mixedUseBlockSize: 5000,
  residentialBlockSize: 5000,
  commercialBlockSize: 5000,
  institutionalBlockSize: 3000,
  industrialBlockSize: 3000,
  
  mixedUsePlotSize: 6000,
  residentialPlotSize: 400,
  commercialPlotSize: 8000,
  institutionalPlotSize: 3000,
  industrialPlotSize: 3000,
  
  // NEW: Residential Plot Sizes by Unit Type
  residentialStudioPlotSize: 50,
  residentialOneBedPlotSize: 70,
  residentialTwoBedPlotSize: 95,
  residentialThreeBedPlotSize: 120,
  residentialFourBedPlotSize: 150,
  
  // Mixed-Use Unit Mix Defaults
  mixedUseStudioPercent: 15,
  mixedUseOneBedPercent: 25,
  mixedUseTwoBedPercent: 35,
  mixedUseThreeBedPercent: 20,
  mixedUseFourBedPercent: 5,
  
  // Residential Unit Mix Defaults
  residentialStudioPercent: 10,
  residentialOneBedPercent: 20,
  residentialTwoBedPercent: 40,
  residentialThreeBedPercent: 25,
  residentialFourBedPercent: 5,
  
  // NEW: Mixed-Use Unit Sizes
  mixedUseStudioSize: 45,
  mixedUseOneBedSize: 60,
  mixedUseTwoBedSize: 85,
  mixedUseThreeBedSize: 110,
  mixedUseFourBedSize: 140,
  
  parkingSpacesPerUnit: 1.5,
  guestParkingPercent: 15,
  disabledParkingPercent: 5,
  adultsPercent: 65,
  childrenPercent: 35,

  // PHASE 1A: ECONOMIC PARAMETERS - Defaults
  // Construction Costs (AED per sqm) - UAE market rates
  residentialConstructionCost: 4500,
  commercialConstructionCost: 5500,
  mixedUseConstructionCost: 5000,
  institutionalConstructionCost: 4000,
  industrialConstructionCost: 3500,
  infrastructureCostPerSqm: 800,
  
  // Residential Sales Prices (AED per unit) - UAE market rates
  studioSalePrice: 600000,
  oneBedSalePrice: 900000,
  twoBedSalePrice: 1400000,
  threeBedSalePrice: 2000000,
  fourBedSalePrice: 2800000,
  
  // Commercial Sales/Rental Rates (AED per sqm)
  commercialSalePrice: 1500,
  commercialRentalRate: 120,
  
  // Mixed-Use Sales Prices (AED per unit) - Typically 10-20% premium over residential
  mixedUseStudioSalePrice: 700000,
  mixedUseOneBedSalePrice: 1000000,
  mixedUseTwoBedSalePrice: 1500000,
  mixedUseThreeBedSalePrice: 2200000,
  mixedUseFourBedSalePrice: 3000000,
  
  // Development Timeline & Costs
  developmentTimelineMonths: 36,
  landAcquisitionCost: 0, // Will be calculated based on area
  professionalFeesPercent: 12,
  contingencyPercent: 10,
  marketingCostPercent: 5,
  
  // Financing Parameters
  financingInterestRate: 6.5,
  loanToValueRatio: 70,
  equityPercentage: 30,

  // PHASE 1A: NEW RENTAL PARAMETER DEFAULTS - UAE market rates
  studioRentPerMonth: 4000,
  oneBedRentPerMonth: 6000,
  twoBedRentPerMonth: 9000,
  threeBedRentPerMonth: 12000,
  fourBedRentPerMonth: 16000,
  
  commercialRentPerSqM: 100, // AED per sqm per month
  
  rentalVacancyRate: 5,
  propertyManagementFee: 8,
  annualRentIncrease: 3,
  rentalOperatingCosts: 500, // AED per unit per month
};

interface ParametersFormEnhancedProps {
  parameters: DevelopmentParameters;
  onParametersChange: (parameters: DevelopmentParameters) => void;
}

// Custom Settings Manager Component
interface SavedSettings {
  id: string;
  name: string;
  description?: string;
  parameters: DevelopmentParameters;
  createdAt: Date;
  updatedAt: Date;
}

interface CustomSettingsManagerProps {
  currentParameters: DevelopmentParameters;
  onLoadSettings: (parameters: DevelopmentParameters) => void;
}

const CustomSettingsManager: React.FC<CustomSettingsManagerProps> = ({
  currentParameters,
  onLoadSettings
}) => {
  const [savedSettings, setSavedSettings] = useState<SavedSettings[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSettingName, setNewSettingName] = useState('');
  const [newSettingDescription, setNewSettingDescription] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);

  // Load saved settings from localStorage on component mount
  React.useEffect(() => {
    const saved = localStorage.getItem('developmentSettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        const settingsWithDates = parsedSettings.map((setting: any) => ({
          ...setting,
          createdAt: new Date(setting.createdAt),
          updatedAt: new Date(setting.updatedAt)
        }));
        setSavedSettings(settingsWithDates);
      } catch (error) {
        console.error('Error loading saved settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever savedSettings changes
  React.useEffect(() => {
    localStorage.setItem('developmentSettings', JSON.stringify(savedSettings));
  }, [savedSettings]);

  const handleSaveSettings = () => {
    if (!newSettingName.trim()) {
      alert('Please enter a name for your settings');
      return;
    }

    const newSetting: SavedSettings = {
      id: Date.now().toString(),
      name: newSettingName.trim(),
      description: newSettingDescription.trim(),
      parameters: { ...currentParameters },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSavedSettings(prev => [newSetting, ...prev]);
    setNewSettingName('');
    setNewSettingDescription('');
    setShowSaveDialog(false);
  };

  const handleLoadSettings = (settings: SavedSettings) => {
    onLoadSettings(settings.parameters);
  };

  const handleDeleteSettings = (id: string) => {
    setSavedSettings(prev => prev.filter(setting => setting.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Export settings to JSON file
  const handleExportSettings = (settings: SavedSettings) => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `${settings.name.replace(/\s+/g, '_')}_settings.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import settings from JSON file
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedSetting = JSON.parse(content) as SavedSettings;
        
        if (importedSetting.name && importedSetting.parameters) {
          const newSetting: SavedSettings = {
            ...importedSetting,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          setSavedSettings(prev => [newSetting, ...prev]);
          alert(`Successfully imported "${importedSetting.name}"`);
        } else {
          alert('Invalid settings file format');
        }
      } catch (error) {
        alert('Error importing settings file');
        console.error('Import error:', error);
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <Card>
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-5 h-5" />
            Custom Settings Manager
            {savedSettings.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {savedSettings.length} saved
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {isMinimized ? 'Click to expand and manage your saved configurations' : 'Save and load your custom development parameter configurations'}
        </p>
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="space-y-4 pt-0">
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowSaveDialog(true)} 
              className="flex-1"
              variant="outline"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Current Settings
            </Button>
          </div>

          {showSaveDialog && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Save Current Configuration</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSaveDialog(false)}
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="setting-name">Setting Name *</Label>
                    <Input
                      id="setting-name"
                      placeholder="e.g., High-Density Urban Mix"
                      value={newSettingName}
                      onChange={(e) => setNewSettingName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="setting-description">Description (Optional)</Label>
                    <Input
                      id="setting-description"
                      placeholder="e.g., Optimized for urban centers with mixed-use focus"
                      value={newSettingDescription}
                      onChange={(e) => setNewSettingDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSaveSettings} className="flex-1">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Configuration
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSaveDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {savedSettings.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Saved Configurations</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {savedSettings.map((setting) => (
                  <Card key={setting.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm truncate">
                            {setting.name}
                          </h5>
                          <Badge variant="outline" className="text-xs">
                            {setting.parameters.developmentType}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {setting.parameters.revenueModel}
                          </Badge>
                        </div>
                        
                        {setting.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {setting.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Saved: {formatDate(setting.updatedAt)}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLoadSettings(setting)}
                              className="h-6 px-2 text-xs"
                            >
                              <FolderOpen className="w-3 h-3 mr-1" />
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExportSettings(setting)}
                              className="h-6 px-2 text-xs"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSettings(setting.id)}
                              className="h-6 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No saved configurations yet</p>
              <p className="text-xs">Save your current settings to get started</p>
            </div>
          )}

          <div className="flex gap-2 pt-2 border-t">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              style={{ display: 'none' }}
              id="import-settings"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-settings')?.click()}
              className="flex-1 text-xs"
            >
              <Upload className="w-3 h-3 mr-1" />
              Import
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoadSettings(defaultDevelopmentParameters)}
              className="flex-1 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Defaults
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (savedSettings.length > 0) {
                  handleLoadSettings(savedSettings[0]);
                }
              }}
              disabled={savedSettings.length === 0}
              className="flex-1 text-xs"
            >
              <FolderOpen className="w-3 h-3 mr-1" />
              Latest
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export const ParametersFormEnhanced: React.FC<ParametersFormEnhancedProps> = ({ 
  parameters = defaultDevelopmentParameters, 
  onParametersChange 
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  // Ensure parameters always have values, use defaults if any are missing
  const safeParameters = { ...defaultDevelopmentParameters, ...parameters };

  const updateParameter = (key: keyof DevelopmentParameters, value: any) => {
    const updatedParameters = {
      ...safeParameters,
      [key]: value
    };
    onParametersChange(updatedParameters);
  };

  // FIXED: Simple update functions for unit mix - no complex auto-adjustment
  const updateMixedUseUnitMix = (key: keyof DevelopmentParameters, value: number) => {
    updateParameter(key, value);
  };

  const updateResidentialUnitMix = (key: keyof DevelopmentParameters, value: number) => {
    updateParameter(key, value);
  };

  // NEW: Mixed-use breakdown adjustment functions
  const updateMixedUseBreakdown = (key: keyof DevelopmentParameters, value: number) => {
    updateParameter(key, value);
  };

  // FIXED: Demographic adjustment with proper state management
  const handleAdultsChange = (newAdultsPercent: number) => {
    const updatedParameters = {
      ...safeParameters,
      adultsPercent: newAdultsPercent,
      childrenPercent: 100 - newAdultsPercent
    };
    onParametersChange(updatedParameters);
  };

  const handleChildrenChange = (newChildrenPercent: number) => {
    const updatedParameters = {
      ...safeParameters,
      childrenPercent: newChildrenPercent,
      adultsPercent: 100 - newChildrenPercent
    };
    onParametersChange(updatedParameters);
  };

  const mixedUseUnitMixTotal = safeParameters.mixedUseStudioPercent + safeParameters.mixedUseOneBedPercent + 
                              safeParameters.mixedUseTwoBedPercent + safeParameters.mixedUseThreeBedPercent + safeParameters.mixedUseFourBedPercent;

  const residentialUnitMixTotal = safeParameters.residentialStudioPercent + safeParameters.residentialOneBedPercent + 
                                 safeParameters.residentialTwoBedPercent + safeParameters.residentialThreeBedPercent + safeParameters.residentialFourBedPercent;

  const landUseTotal = safeParameters.openSpacePercent + safeParameters.publicRealmPercent + 
                      safeParameters.residentialPercent + safeParameters.commercialPercent + 
                      safeParameters.institutionalPercent + safeParameters.industrialPercent + 
                      safeParameters.mixedUsePercent;

  // NEW: Mixed-use breakdown total
  const mixedUseBreakdownTotal = safeParameters.mixedUseResidentialPercent + 
                                safeParameters.mixedUseCommercialPercent + 
                                safeParameters.mixedUseInstitutionalPercent;

  // Validation functions
  const isBasicValid = () => {
    return safeParameters.developmentType && 
           safeParameters.densityLevel && 
           safeParameters.budgetClassification &&
           landUseTotal === 100;
  };

  const isAdvancedValid = () => {
    return mixedUseUnitMixTotal === 100 && 
           residentialUnitMixTotal === 100 &&
           safeParameters.adultsPercent + safeParameters.childrenPercent === 100 &&
           mixedUseBreakdownTotal === 100;
  };

  const isEconomicsValid = () => {
    return safeParameters.residentialConstructionCost > 0 &&
           safeParameters.commercialConstructionCost > 0 &&
           safeParameters.mixedUseConstructionCost > 0;
  };

  const resetToDefaults = () => {
    onParametersChange(defaultDevelopmentParameters);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <CustomSettingsManager
        currentParameters={safeParameters}
        onLoadSettings={onParametersChange}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Development Parameters
            </CardTitle>
            <Button onClick={resetToDefaults} variant="outline" size="sm" className="w-fit">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure development parameters using the Basic, Advanced, and Economics tabs below.
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Basic Parameters
                {isBasicValid() ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                )}
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Advanced Parameters
                {isAdvancedValid() ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                )}
              </TabsTrigger>
              <TabsTrigger value="economics" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Economics
                {isEconomicsValid() ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                )}
              </TabsTrigger>
            </TabsList>

            {/* Basic Parameters Tab */}
            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Core Development Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-medium">Core Configuration</h4>
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Development Type</Label>
                    <Select 
                      value={safeParameters.developmentType} 
                      onValueChange={(value: 'Mixed-Use' | 'Gated Community' | 'Rural') => updateParameter('developmentType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                        <SelectItem value="Gated Community">Gated Community</SelectItem>
                        <SelectItem value="Rural">Rural</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Density Level</Label>
                    <Select 
                      value={safeParameters.densityLevel} 
                      onValueChange={(value: 'High' | 'Medium' | 'Low') => updateParameter('densityLevel', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High Density</SelectItem>
                        <SelectItem value="Medium">Medium Density</SelectItem>
                        <SelectItem value="Low">Low Density</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Budget Classification</Label>
                    <Select 
                      value={safeParameters.budgetClassification} 
                      onValueChange={(value: 'Affordable' | 'Market Rate' | 'Executive') => updateParameter('budgetClassification', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Affordable">Affordable</SelectItem>
                        <SelectItem value="Market Rate">Market Rate</SelectItem>
                        <SelectItem value="Executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Land Use Allocation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">Land Use Allocation</h4>
                  <div className={`text-sm px-2 py-1 rounded ${ 
                    landUseTotal === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                  }`}>
                    Total: {landUseTotal.toFixed(0)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'openSpacePercent', label: 'Open Space', desc: 'Parks, gardens, and recreational areas' },
                    { key: 'publicRealmPercent', label: 'Public Realm', desc: 'Roads, sidewalks, and utilities' },
                    { key: 'residentialPercent', label: 'Residential', desc: 'Housing and residential plots' },
                    { key: 'commercialPercent', label: 'Commercial', desc: 'Retail, office, and commercial spaces' },
                    { key: 'institutionalPercent', label: 'Institutional', desc: 'Schools, hospitals, civic buildings' },
                    { key: 'industrialPercent', label: 'Industrial', desc: 'Manufacturing and industrial facilities' },
                    { key: 'mixedUsePercent', label: 'Mixed-Use', desc: 'Combined residential, commercial, institutional' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}: {safeParameters[item.key as keyof DevelopmentParameters]}%</Label>
                      <Slider
                        value={[safeParameters[item.key as keyof DevelopmentParameters] as number]}
                        onValueChange={([value]) => updateParameter(item.key as keyof DevelopmentParameters, value)}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {landUseTotal !== 100 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      ⚠️ Land use allocation must total 100%. Current total: {landUseTotal.toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Mixed-Use Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">Mixed-Use GFA Breakdown</h4>
                  <div className={`text-sm px-2 py-1 rounded ${
                    mixedUseBreakdownTotal === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                  }`}>
                    Total: {mixedUseBreakdownTotal.toFixed(0)}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'mixedUseResidentialPercent', label: 'Residential GFA', desc: 'Percentage of mixed-use GFA allocated to residential' },
                    { key: 'mixedUseCommercialPercent', label: 'Commercial GFA', desc: 'Percentage of mixed-use GFA allocated to commercial' },
                    { key: 'mixedUseInstitutionalPercent', label: 'Institutional GFA', desc: 'Percentage of mixed-use GFA allocated to institutional' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}: {safeParameters[item.key as keyof DevelopmentParameters]}%</Label>
                      <Slider
                        value={[safeParameters[item.key as keyof DevelopmentParameters] as number]}
                        onValueChange={([value]) => updateMixedUseBreakdown(item.key as keyof DevelopmentParameters, value)}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {mixedUseBreakdownTotal !== 100 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      ⚠️ Mixed-use breakdown must total 100%. Current total: {mixedUseBreakdownTotal.toFixed(0)}%
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Basic Building Parameters */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Plot Coverage by Land Use Type</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'residentialPlotCoverage', label: 'Residential Plot Coverage' },
                    { key: 'commercialPlotCoverage', label: 'Commercial Plot Coverage' },
                    { key: 'mixedUsePlotCoverage', label: 'Mixed-Use Plot Coverage' },
                    { key: 'institutionalPlotCoverage', label: 'Institutional Plot Coverage' },
                    { key: 'industrialPlotCoverage', label: 'Industrial Plot Coverage' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}: {safeParameters[item.key as keyof DevelopmentParameters]}%</Label>
                      <Slider
                        value={[safeParameters[item.key as keyof DevelopmentParameters] as number]}
                        onValueChange={([value]) => updateParameter(item.key as keyof DevelopmentParameters, value)}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground">Building footprint of plot area</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Number of Floors */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Number of Floors by Land Use Type</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'residentialFloors', label: 'Residential Floors', default: '4 floors' },
                    { key: 'commercialFloors', label: 'Commercial Floors', default: '6 floors' },
                    { key: 'mixedUseFloors', label: 'Mixed-Use Floors', default: '20 floors' },
                    { key: 'institutionalFloors', label: 'Institutional Floors', default: '6 floors' },
                    { key: 'industrialFloors', label: 'Industrial Floors', default: '2 floors' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={1}
                        max={100}
                      />
                      <p className="text-xs text-muted-foreground">Default: {item.default}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* NEW: Block Sizes Configuration */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Block Sizes by Land Use Type (m²)</h4>
                <p className="text-sm text-muted-foreground">
                  Block sizes determine how land is subdivided for development. Larger blocks allow for bigger buildings and more flexible layouts.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'residentialBlockSize', label: 'Residential Block Size', default: '5000 m²', desc: 'Typical residential neighborhood block' },
                    { key: 'commercialBlockSize', label: 'Commercial Block Size', default: '5000 m²', desc: 'Standard commercial development block' },
                    { key: 'mixedUseBlockSize', label: 'Mixed-Use Block Size', default: '5000 m²', desc: 'Integrated mixed-use development block' },
                    { key: 'institutionalBlockSize', label: 'Institutional Block Size', default: '3000 m²', desc: 'Schools, hospitals, civic facilities' },
                    { key: 'industrialBlockSize', label: 'Industrial Block Size', default: '3000 m²', desc: 'Manufacturing and industrial facilities' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={500}
                        max={20000}
                      />
                      <p className="text-xs text-muted-foreground">Default: {item.default}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Advanced Parameters Tab */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              {/* Mixed-Use Unit Mix Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">Unit Mix Distribution (Mixed-Use)</h4>
                  <div className={`text-sm px-2 py-1 rounded ${
                    mixedUseUnitMixTotal === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                  }`}>
                    Total: {mixedUseUnitMixTotal}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'mixedUseStudioPercent', label: 'Studio' },
                    { key: 'mixedUseOneBedPercent', label: '1 Bedroom' },
                    { key: 'mixedUseTwoBedPercent', label: '2 Bedroom' },
                    { key: 'mixedUseThreeBedPercent', label: '3 Bedroom' },
                    { key: 'mixedUseFourBedPercent', label: '4 Bedroom' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}: {safeParameters[item.key as keyof DevelopmentParameters]}%</Label>
                      <Slider
                        value={[safeParameters[item.key as keyof DevelopmentParameters] as number]}
                        onValueChange={([value]) => updateMixedUseUnitMix(item.key as keyof DevelopmentParameters, value)}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
                
                {mixedUseUnitMixTotal !== 100 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      ⚠️ Mixed-use unit mix percentages must total 100%. Current total: {mixedUseUnitMixTotal}%
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Residential Unit Mix Distribution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">Unit Mix Distribution (Residential)</h4>
                  <div className={`text-sm px-2 py-1 rounded ${
                    residentialUnitMixTotal === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                  }`}>
                    Total: {residentialUnitMixTotal}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'residentialStudioPercent', label: 'Studio' },
                    { key: 'residentialOneBedPercent', label: '1 Bedroom' },
                    { key: 'residentialTwoBedPercent', label: '2 Bedroom' },
                    { key: 'residentialThreeBedPercent', label: '3 Bedroom' },
                    { key: 'residentialFourBedPercent', label: '4 Bedroom' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}: {safeParameters[item.key as keyof DevelopmentParameters]}%</Label>
                      <Slider
                        value={[safeParameters[item.key as keyof DevelopmentParameters] as number]}
                        onValueChange={([value]) => updateResidentialUnitMix(item.key as keyof DevelopmentParameters, value)}
                        max={100}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
                
                {residentialUnitMixTotal !== 100 && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-sm text-orange-800 dark:text-orange-300">
                      ⚠️ Residential unit mix percentages must total 100%. Current total: {residentialUnitMixTotal}%
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Demographics - FIXED */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-medium">Population Demographics</h4>
                  <div className={`text-sm px-2 py-1 rounded ${
                    safeParameters.adultsPercent + safeParameters.childrenPercent === 100 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    Total: {safeParameters.adultsPercent + safeParameters.childrenPercent}%
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Adults: {safeParameters.adultsPercent}%</Label>
                    <Slider
                      value={[safeParameters.adultsPercent]}
                      onValueChange={([value]) => handleAdultsChange(value)}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">Population over 18 years</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Children: {safeParameters.childrenPercent}%</Label>
                    <Slider
                      value={[safeParameters.childrenPercent]}
                      onValueChange={([value]) => handleChildrenChange(value)}
                      max={100}
                      step={1}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground">Population under 18 years</p>                  
                  </div>
                </div>
              </div>

              <Separator />

              {/* Residential Plot Sizes */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Residential Plot Sizes by Unit Type (m²)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'residentialStudioPlotSize', label: 'Studio Plot Size', default: '50 m²' },
                    { key: 'residentialOneBedPlotSize', label: '1 Bedroom Plot Size', default: '70 m²' },
                    { key: 'residentialTwoBedPlotSize', label: '2 Bedroom Plot Size', default: '95 m²' },
                    { key: 'residentialThreeBedPlotSize', label: '3 Bedroom Plot Size', default: '120 m²' },
                    { key: 'residentialFourBedPlotSize', label: '4 Bedroom Plot Size', default: '150 m²' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={20}
                        max={2000}
                      />
                      <p className="text-xs text-muted-foreground">Default: {item.default}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Mixed-Use Unit Sizes */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Mixed-Use Unit Sizes (m²)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'mixedUseStudioSize', label: 'Studio Unit Size', default: '45 m²' },
                    { key: 'mixedUseOneBedSize', label: '1 Bedroom Unit Size', default: '60 m²' },
                    { key: 'mixedUseTwoBedSize', label: '2 Bedroom Unit Size', default: '85 m²' },
                    { key: 'mixedUseThreeBedSize', label: '3 Bedroom Unit Size', default: '110 m²' },
                    { key: 'mixedUseFourBedSize', label: '4 Bedroom Unit Size', default: '140 m²' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={20}
                        max={250}
                      />
                      <p className="text-xs text-muted-foreground">Default: {item.default}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Plot Sizes */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Plot Sizes by Land Use Type (m²)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'commercialPlotSize', label: 'Commercial Plot Size', default: '8000 m²' },
                    { key: 'mixedUsePlotSize', label: 'Mixed-Use Plot Size', default: '6000 m²' },
                    { key: 'institutionalPlotSize', label: 'Institutional Plot Size', default: '3000 m²' },
                    { key: 'industrialPlotSize', label: 'Industrial Plot Size', default: '3000 m²' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={50}
                        max={20000}
                      />
                      <p className="text-xs text-muted-foreground">Default: {item.default}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Parking Requirements */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Parking Requirements</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'parkingSpacesPerUnit', label: 'Spaces per Unit', max: 3, min: 0.5, step: 0.1, desc: 'Average parking spaces per residential unit' },
                    { key: 'guestParkingPercent', label: 'Guest Parking', max: 30, min: 0, step: 1, desc: 'Additional spaces for visitors' },
                    { key: 'disabledParkingPercent', label: 'Disabled Parking', max: 15, min: 0, step: 1, desc: 'Accessible parking spaces' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}: {safeParameters[item.key as keyof DevelopmentParameters]}</Label>
                      <Slider
                        value={[safeParameters[item.key as keyof DevelopmentParameters] as number]}
                        onValueChange={([value]) => updateParameter(item.key as keyof DevelopmentParameters, value)}
                        max={item.max}
                        min={item.min}
                        step={item.step}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Economics Tab */}
            <TabsContent value="economics" className="space-y-6 mt-6">
              {/* Revenue Model Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-medium">Revenue Model</h4>
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
                
                <div className="space-y-2">
                  <Label>Revenue Model</Label>
                  <Select 
                    value={safeParameters.revenueModel} 
                    onValueChange={(value: 'sale' | 'rental' | 'mixed') => updateParameter('revenueModel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale Only</SelectItem>
                      <SelectItem value="rental">For Rent Only</SelectItem>
                      <SelectItem value="mixed">Mixed (Sale & Rent)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the revenue model for your development
                  </p>
                </div>
              </div>

              <Separator />

              {/* Construction Costs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-medium">Construction Costs (AED per m²)</h4>
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { key: 'residentialConstructionCost', label: 'Residential Construction Cost', min: 1000, max: 10000 },
                    { key: 'commercialConstructionCost', label: 'Commercial Construction Cost', min: 1000, max: 15000 },
                    { key: 'mixedUseConstructionCost', label: 'Mixed-Use Construction Cost', min: 1000, max: 12000 },
                    { key: 'institutionalConstructionCost', label: 'Institutional Construction Cost', min: 1000, max: 8000 },
                    { key: 'industrialConstructionCost', label: 'Industrial Construction Cost', min: 1000, max: 6000 },
                    { key: 'infrastructureCostPerSqm', label: 'Infrastructure Cost', min: 100, max: 2000 },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={item.min}
                        max={item.max}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}/m²
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Residential Sales Prices */}
              {(safeParameters.revenueModel === 'sale' || safeParameters.revenueModel === 'mixed') && (
                <>
                  <div className="space-y-4">
                    <h4 className="text-base font-medium">Residential Sales Prices (AED per Unit)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'studioSalePrice', label: 'Studio Sale Price', min: 100000, max: 2000000 },
                        { key: 'oneBedSalePrice', label: '1 Bedroom Sale Price', min: 200000, max: 3000000 },
                        { key: 'twoBedSalePrice', label: '2 Bedroom Sale Price', min: 300000, max: 5000000 },
                        { key: 'threeBedSalePrice', label: '3 Bedroom Sale Price', min: 500000, max: 8000000 },
                        { key: 'fourBedSalePrice', label: '4 Bedroom Sale Price', min: 800000, max: 12000000 },
                      ].map((item) => (
                        <div key={item.key} className="space-y-2">
                          <Label>{item.label}</Label>
                          <Input
                            type="number"
                            value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                            onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                            min={item.min}
                            max={item.max}
                          />
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Mixed-Use Sales Prices */}
                  <div className="space-y-4">
                    <h4 className="text-base font-medium">Mixed-Use Sales Prices (AED per Unit)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'mixedUseStudioSalePrice', label: 'Mixed-Use Studio', min: 100000, max: 2500000 },
                        { key: 'mixedUseOneBedSalePrice', label: 'Mixed-Use 1 Bedroom', min: 200000, max: 3500000 },
                        { key: 'mixedUseTwoBedSalePrice', label: 'Mixed-Use 2 Bedroom', min: 300000, max: 6000000 },
                        { key: 'mixedUseThreeBedSalePrice', label: 'Mixed-Use 3 Bedroom', min: 500000, max: 9000000 },
                        { key: 'mixedUseFourBedSalePrice', label: 'Mixed-Use 4 Bedroom', min: 800000, max: 15000000 },
                      ].map((item) => (
                        <div key={item.key} className="space-y-2">
                          <Label>{item.label}</Label>
                          <Input
                            type="number"
                            value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                            onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                            min={item.min}
                            max={item.max}
                          />
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Commercial Rates */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Commercial Rates</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'commercialSalePrice', label: 'Commercial Sale Price (AED/m²)', min: 5000, max: 30000 },
                    { key: 'commercialRentalRate', label: 'Commercial Rental Rate (AED/m²/year)', min: 500, max: 3000 },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={item.min}
                        max={item.max}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}
                        {item.key === 'commercialSalePrice' ? '/m²' : '/m²/year'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {(safeParameters.revenueModel === 'rental' || safeParameters.revenueModel === 'mixed') && (
                <>
                  <Separator />

                  {/* Residential Rental Rates */}
                  <div className="space-y-4">
                    <h4 className="text-base font-medium">Residential Rental Rates (AED per Month)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'studioRentPerMonth', label: 'Studio Monthly Rent', min: 1000, max: 10000 },
                        { key: 'oneBedRentPerMonth', label: '1 Bedroom Monthly Rent', min: 1500, max: 15000 },
                        { key: 'twoBedRentPerMonth', label: '2 Bedroom Monthly Rent', min: 2500, max: 20000 },
                        { key: 'threeBedRentPerMonth', label: '3 Bedroom Monthly Rent', min: 3500, max: 30000 },
                        { key: 'fourBedRentPerMonth', label: '4 Bedroom Monthly Rent', min: 5000, max: 40000 },
                      ].map((item) => (
                        <div key={item.key} className="space-y-2">
                          <Label>{item.label}</Label>
                          <Input
                            type="number"
                            value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                            onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                            min={item.min}
                            max={item.max}
                          />
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}/month
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Rental Business Parameters */}
                  <div className="space-y-4">
                    <h4 className="text-base font-medium">Rental Business Parameters</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { key: 'commercialRentPerSqM', label: 'Commercial Rent (AED/m²/month)', min: 500, max: 3000 },
                        { key: 'rentalVacancyRate', label: 'Vacancy Rate (%)', min: 0, max: 20, step: 0.5 },
                        { key: 'propertyManagementFee', label: 'Management Fee (%)', min: 5, max: 15, step: 0.5 },
                        { key: 'annualRentIncrease', label: 'Annual Rent Increase (%)', min: 0, max: 10, step: 0.1 },
                        { key: 'rentalOperatingCosts', label: 'Operating Costs (AED/unit/month)', min: 1000, max: 10000 },
                      ].map((item) => (
                        <div key={item.key} className="space-y-2">
                          <Label>{item.label}</Label>
                          <Input
                            type="number"
                            value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                            onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                            min={item.min}
                            max={item.max}
                            step={item.step || 1}
                          />
                          <p className="text-xs text-muted-foreground">
                            {item.key === 'commercialRentPerSqM' ? `${formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}/m²/month` : ''}
                            {item.key === 'rentalOperatingCosts' ? `${formatCurrency(safeParameters[item.key as keyof DevelopmentParameters] as number)}/unit/month` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />
                </>
              )}

              {/* Development Costs & Timeline */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Development Costs & Timeline</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { key: 'developmentTimelineMonths', label: 'Development Timeline (Months)', min: 6, max: 60, desc: 'Total project duration' },
                    { key: 'professionalFeesPercent', label: 'Professional Fees (%)', min: 5, max: 20, step: 0.5, desc: 'Architects, engineers, etc.' },
                    { key: 'contingencyPercent', label: 'Contingency (%)', min: 5, max: 20, step: 0.5, desc: 'Unexpected costs buffer' },
                    { key: 'marketingCostPercent', label: 'Marketing Costs (%)', min: 2, max: 10, step: 0.5, desc: 'Sales and marketing expenses' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={item.min}
                        max={item.max}
                        step={item.step || 1}
                      />
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Financing Parameters */}
              <div className="space-y-4">
                <h4 className="text-base font-medium">Financing Parameters</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'financingInterestRate', label: 'Interest Rate (%)', min: 2, max: 15, step: 0.1, desc: 'Annual financing cost' },
                    { key: 'loanToValueRatio', label: 'Loan-to-Value Ratio (%)', min: 50, max: 80, step: 1, desc: 'Financing percentage of project value' },
                    { key: 'equityPercentage', label: 'Equity Percentage (%)', min: 20, max: 50, step: 1, desc: 'Developer\'s equity contribution' },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <Label>{item.label}</Label>
                      <Input
                        type="number"
                        value={safeParameters[item.key as keyof DevelopmentParameters] as number}
                        onChange={(e) => updateParameter(item.key as keyof DevelopmentParameters, Number(e.target.value))}
                        min={item.min}
                        max={item.max}
                        step={item.step}
                      />
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {!isEconomicsValid() && (
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    ⚠️ Please ensure all required economic parameters have valid values greater than zero.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};