import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Separator } from './ui/separator';

export interface DevelopmentParameters {
  developmentType: 'Mixed-Use' | 'Gated Community' | 'Rural';
  densityLevel: 'High' | 'Medium' | 'Low';
  budgetClassification: 'Affordable' | 'Market Rate' | 'Executive';
  
  // Land Use Allocations (percentages)
  openSpacePercent: number;
  publicRealmPercent: number;
  residentialPercent: number;
  commercialPercent: number;
  
  // Building Parameters
  plotCoverage: number;
  residentialFAR: number;
  commercialFAR: number;
  
  // Plot Sizes (sqm)
  affordablePlotSize: number;
  marketRatePlotSize: number;
  executivePlotSize: number;
  
  // Unit Mix (percentages by bedroom count)
  studioPercent: number;
  oneBedPercent: number;
  twoBedPercent: number;
  threeBedPercent: number;
  fourBedPercent: number;
  
  // Parking Parameters
  parkingSpacesPerUnit: number;
  guestParkingPercent: number;
  disabledParkingPercent: number;
  
  // Demographics
  adultsPercent: number;
  childrenPercent: number;
}

interface ParametersFormProps {
  parameters: DevelopmentParameters;
  onParametersChange: (parameters: DevelopmentParameters) => void;
}

export const ParametersForm: React.FC<ParametersFormProps> = ({ parameters, onParametersChange }) => {
  const updateParameter = (key: keyof DevelopmentParameters, value: any) => {
    onParametersChange({
      ...parameters,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    const defaults: DevelopmentParameters = {
      developmentType: 'Mixed-Use',
      densityLevel: 'High',
      budgetClassification: 'Market Rate',
      openSpacePercent: 15,
      publicRealmPercent: 15,
      residentialPercent: 70,
      commercialPercent: 30,
      plotCoverage: 80,
      residentialFAR: 20,
      commercialFAR: parameters.densityLevel === 'High' ? 20 : 4,
      affordablePlotSize: 150,
      marketRatePlotSize: 300,
      executivePlotSize: 600,
      studioPercent: 15,
      oneBedPercent: 25,
      twoBedPercent: 35,
      threeBedPercent: 20,
      fourBedPercent: 5,
      parkingSpacesPerUnit: 1.5,
      guestParkingPercent: 15,
      disabledParkingPercent: 5,
      adultsPercent: 65,
      childrenPercent: 35
    };
    onParametersChange(defaults);
  };

  // Auto-adjust unit mix percentages to total 100%
  const adjustUnitMix = (updatedKey: string, newValue: number) => {
    const unitMixKeys = ['studioPercent', 'oneBedPercent', 'twoBedPercent', 'threeBedPercent', 'fourBedPercent'];
    const currentTotal = unitMixKeys.reduce((sum, key) => 
      sum + (key === updatedKey ? newValue : parameters[key as keyof DevelopmentParameters] as number), 0
    );
    
    if (currentTotal <= 100) {
      updateParameter(updatedKey as keyof DevelopmentParameters, newValue);
    }
  };

  const unitMixTotal = parameters.studioPercent + parameters.oneBedPercent + 
                      parameters.twoBedPercent + parameters.threeBedPercent + parameters.fourBedPercent;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Parameters</CardTitle>
        <Button onClick={resetToDefaults} variant="outline" size="sm" className="w-fit">
          Reset to Defaults
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Development Type</Label>
            <Select 
              value={parameters.developmentType} 
              onValueChange={(value) => updateParameter('developmentType', value)}
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
              value={parameters.densityLevel} 
              onValueChange={(value) => updateParameter('densityLevel', value)}
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
              value={parameters.budgetClassification} 
              onValueChange={(value) => updateParameter('budgetClassification', value)}
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

        <Separator />

        {/* Land Use Allocations */}
        <div className="space-y-4">
          <h4>Land Use Allocations</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <Label>Open Space: {parameters.openSpacePercent}%</Label>
                <Slider
                  value={[parameters.openSpacePercent]}
                  onValueChange={([value]) => updateParameter('openSpacePercent', value)}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Public Realm: {parameters.publicRealmPercent}%</Label>
                <Slider
                  value={[parameters.publicRealmPercent]}
                  onValueChange={([value]) => updateParameter('publicRealmPercent', value)}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label>Residential (Net): {parameters.residentialPercent}%</Label>
                <Slider
                  value={[parameters.residentialPercent]}
                  onValueChange={([value]) => updateParameter('residentialPercent', value)}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Commercial (Net): {parameters.commercialPercent}%</Label>
                <Slider
                  value={[parameters.commercialPercent]}
                  onValueChange={([value]) => updateParameter('commercialPercent', value)}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Unit Mix */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4>Unit Mix Distribution</h4>
            <div className={`text-sm px-2 py-1 rounded ${
              unitMixTotal === 100 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
            }`}>
              Total: {unitMixTotal}%
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Studio: {parameters.studioPercent}%</Label>
              <Slider
                value={[parameters.studioPercent]}
                onValueChange={([value]) => adjustUnitMix('studioPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>1 Bedroom: {parameters.oneBedPercent}%</Label>
              <Slider
                value={[parameters.oneBedPercent]}
                onValueChange={([value]) => adjustUnitMix('oneBedPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>2 Bedroom: {parameters.twoBedPercent}%</Label>
              <Slider
                value={[parameters.twoBedPercent]}
                onValueChange={([value]) => adjustUnitMix('twoBedPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>3 Bedroom: {parameters.threeBedPercent}%</Label>
              <Slider
                value={[parameters.threeBedPercent]}
                onValueChange={([value]) => adjustUnitMix('threeBedPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>4 Bedroom: {parameters.fourBedPercent}%</Label>
              <Slider
                value={[parameters.fourBedPercent]}
                onValueChange={([value]) => adjustUnitMix('fourBedPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
          
          {unitMixTotal !== 100 && (
            <p className="text-sm text-orange-600">
              Unit mix percentages should total 100%. Current total: {unitMixTotal}%
            </p>
          )}
        </div>

        <Separator />

        {/* Building Parameters */}
        <div className="space-y-4">
          <h4>Building Parameters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Plot Coverage: {parameters.plotCoverage}%</Label>
              <Slider
                value={[parameters.plotCoverage]}
                onValueChange={([value]) => updateParameter('plotCoverage', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Residential FAR</Label>
              <Input
                type="number"
                value={parameters.residentialFAR}
                onChange={(e) => updateParameter('residentialFAR', Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Commercial FAR</Label>
              <Input
                type="number"
                value={parameters.commercialFAR}
                onChange={(e) => updateParameter('commercialFAR', Number(e.target.value))}
                min={0}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Plot Sizes */}
        <div className="space-y-4">
          <h4>Plot Sizes (m²)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Affordable</Label>
              <Input
                type="number"
                value={parameters.affordablePlotSize}
                onChange={(e) => updateParameter('affordablePlotSize', Number(e.target.value))}
                min={50}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Market Rate</Label>
              <Input
                type="number"
                value={parameters.marketRatePlotSize}
                onChange={(e) => updateParameter('marketRatePlotSize', Number(e.target.value))}
                min={50}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Executive</Label>
              <Input
                type="number"
                value={parameters.executivePlotSize}
                onChange={(e) => updateParameter('executivePlotSize', Number(e.target.value))}
                min={50}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Demographics */}
        <div className="space-y-4">
          <h4>Demographics</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Adults: {parameters.adultsPercent}%</Label>
              <Slider
                value={[parameters.adultsPercent]}
                onValueChange={([value]) => updateParameter('adultsPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Children: {parameters.childrenPercent}%</Label>
              <Slider
                value={[parameters.childrenPercent]}
                onValueChange={([value]) => updateParameter('childrenPercent', value)}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};