// src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode } from '../types/theme';
import { lightTheme, darkTheme } from '../theme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@quizhub_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(lightTheme);

  // Load theme from storage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setThemeMode(storedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme from storage:', error);
      }
    };

    loadTheme();
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    const newTheme = mode === 'dark' ? darkTheme : lightTheme;
    setTheme(newTheme);

    // Save to storage
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch(error => {
      console.warn('Failed to save theme to storage:', error);
    });
  };

  const toggleTheme = () => {
    const newMode = theme.mode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};