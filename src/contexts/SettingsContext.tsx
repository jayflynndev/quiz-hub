// src/contexts/SettingsContext.tsx
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  hapticFeedbackEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  notificationsEnabled: true,
  hapticFeedbackEnabled: true,
};

const SETTINGS_STORAGE_KEY = "@quizhub_settings";

interface SettingsContextType {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(
  undefined
);

export const useSettings = () => {
  const context = React.useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = React.useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = React.useState(true);

  // Load settings from AsyncStorage on mount
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to AsyncStorage whenever they change
  React.useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem(
          SETTINGS_STORAGE_KEY,
          JSON.stringify(settings)
        );
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    };

    if (!isLoading) {
      saveSettings();
    }
  }, [settings, isLoading]);

  const updateSetting = React.useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const resetSettings = React.useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value = React.useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
      isLoading,
    }),
    [settings, updateSetting, resetSettings, isLoading]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
