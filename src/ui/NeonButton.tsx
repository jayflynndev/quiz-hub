// src/ui/NeonButton.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ColorValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface NeonButtonProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  variant?: "primary" | "purple";
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  label,
  style,
  variant = "primary",
}) => {
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

  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.outer, style]}
    >
      <View style={styles.inner}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 999,
    padding: 2,
    shadowColor: "#22C55E",
    shadowOpacity: 0.8,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  inner: {
    borderRadius: 999,
    paddingHorizontal: 30,
    paddingVertical: 10,
    backgroundColor: "#022C22",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#ECFDF5",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
});
