// src/ui/NeonButton.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ColorValue,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface NeonButtonProps {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>; // outer positioning (margin, alignSelf, width, etc.)
  variant?: "green" | "purple" | "blue";
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  label,
  onPress,
  style,
  variant = "green",
}) => {
  const green: [ColorValue, ColorValue, ColorValue] = [
    "#16A34A",
    "#22C55E",
    "#16A34A",
  ];
  const purple: [ColorValue, ColorValue, ColorValue] = [
    "#A855F7",
    "#8B5CF6",
    "#A855F7",
  ];
  const blue: [ColorValue, ColorValue, ColorValue] = [
    "#3B82F6",
    "#60A5FA",
    "#3B82F6",
  ];

  const colors =
    variant === "green" ? green : variant === "purple" ? purple : blue;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
      disabled={!onPress}
      style={style}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.outer}
      >
        <View style={styles.inner}>
          <Text style={styles.label}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outer: {
    borderRadius: 999,
    padding: 2,
    shadowColor: "rgba(56,189,248,0.7)",
    shadowOpacity: 0.9,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  inner: {
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 10,
    backgroundColor: "rgba(3,7,18,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
