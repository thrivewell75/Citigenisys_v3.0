import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Save, 
  FolderOpen, 
  Trash2, 
  Plus,
  Settings,
  CheckCircle,
  X
} from 'lucide-react';
import { DevelopmentParameters, defaultDevelopmentParameters } from './ParametersFormEnhanced';

export interface SavedSettings {
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

export const CustomSettingsManager: React.FC<CustomSettingsManagerProps> = ({
  currentParameters,
  onLoadSettings
}) => {
  const [savedSettings, setSavedSettings] = useState<SavedSettings[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newSettingName, setNewSettingName] = useState('');
  const [newSettingDescription, setNewSettingDescription] = useState('');

  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('developmentSettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        // Convert date strings back to Date objects
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
  useEffect(() => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Custom Settings Manager
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Save and load your custom development parameter configurations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Save Current Settings Button */}
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

        {/* Save Dialog */}
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
                    <X className="w-4 h-4" />
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

        {/* Saved Settings List */}
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

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLoadSettings(defaultDevelopmentParameters)}
            className="flex-1 text-xs"
          >
            Load Defaults
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
            Load Latest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};