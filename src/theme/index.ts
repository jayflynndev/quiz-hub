// src/theme/index.ts
import { Theme, ThemeColors } from "../types/theme";

export const lightThemeColors: ThemeColors = {
  // Background colors
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceSecondary: "#F1F5F9",

  // Text colors
  text: "#1E293B",
  textSecondary: "#475569",
  textMuted: "#64748B",

  // Primary colors (green theme)
  primary: "#10B981",
  primaryDark: "#059669",
  primaryLight: "#34D399",

  // Secondary colors (purple theme)
  secondary: "#8B5CF6",
  secondaryDark: "#7C3AED",
  secondaryLight: "#A78BFA",

  // Status colors
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",

  // Border colors
  border: "#E2E8F0",
  borderLight: "#F1F5F9",

  // Special colors
  neonGreen: "#22C55E",
  neonPurple: "#A855F7",
  accent: "#3B82F6",
};

export const darkThemeColors: ThemeColors = {
  // Background colors
  background: "#0F172A",
  surface: "#1E293B",
  surfaceSecondary: "#334155",

  // Text colors
  text: "#F8FAFC",
  textSecondary: "#CBD5E1",
  textMuted: "#94A3B8",

  // Primary colors (green theme)
  primary: "#34D399",
  primaryDark: "#10B981",
  primaryLight: "#6EE7B7",

  // Secondary colors (purple theme)
  secondary: "#A78BFA",
  secondaryDark: "#8B5CF6",
  secondaryLight: "#C4B5FD",

  // Status colors
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",

  // Border colors
  border: "#334155",
  borderLight: "#475569",

  // Special colors
  neonGreen: "#4ADE80",
  neonPurple: "#C084FC",
  accent: "#60A5FA",
};

export const lightTheme: Theme = {
  mode: "light",
  colors: lightThemeColors,
};

export const darkTheme: Theme = {
  mode: "dark",
  colors: darkThemeColors,
};
