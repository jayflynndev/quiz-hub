// src/ui/LoadingSpinner.tsx
import * as React from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from "react-native";

interface LoadingSpinnerProps {
  size?: "small" | "large" | number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "#9CA3FF",
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
