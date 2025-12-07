// src/ui/ThemeToggle.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.mode === 'dark';

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.container, { backgroundColor: theme.colors.surfaceSecondary }]}
      accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      accessibilityHint="Toggle between light and dark theme"
      accessibilityRole="button"
    >
      <Ionicons
        name={isDark ? 'sunny' : 'moon'}
        size={20}
        color={theme.colors.text}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});