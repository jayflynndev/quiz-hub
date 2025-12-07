// src/types/theme.ts
export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceSecondary: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;

  // Primary colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Secondary colors
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // Status colors
  success: string;
  error: string;
  warning: string;

  // Border colors
  border: string;
  borderLight: string;

  // Special colors
  neonGreen: string;
  neonPurple: string;
  accent: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}
