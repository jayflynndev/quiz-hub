// src/ui/NeonButton.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ColorValue,
  Pressable,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { usePressAnimation } from "../hooks/usePressAnimation";
import { useTheme } from "../contexts/ThemeContext";

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "purple";
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  label,
  onPress,
  icon,
  style,
  variant = "primary",
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { scaleAnim, animatePressIn, animatePressOut } = usePressAnimation();
  const { theme } = useTheme();
  const greenColors: [ColorValue, ColorValue, ColorValue] = [
    "#22C55E",
    "#4ADE80",
    "#22C55E",
  ];
  const purpleColors: [ColorValue, ColorValue, ColorValue] = [
    "#A855F7",
    "#6366F1",
    "#A855F7",
  ];

  const colors = variant === "primary" ? greenColors : purpleColors;

  const styles = StyleSheet.create({
    outer: {
      borderRadius: 999,
      padding: 2,
      shadowColor: theme.colors.neonGreen,
      shadowOpacity: 0.8,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 10,
    },
    gradient: {
      borderRadius: 999,
    },
    inner: {
      borderRadius: 999,
      paddingHorizontal: 30,
      paddingVertical: 10,
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    iconContainer: {
      marginRight: 8,
    },
    label: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 1,
    },
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={animatePressIn}
      onPressOut={animatePressOut}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Animated.View
        style={[styles.outer, style, { transform: [{ scale: scaleAnim }] }]}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.inner}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};
