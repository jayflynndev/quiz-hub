import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface NeonOutlineButtonProps {
  label: string;
  onPress?: () => void;
}

export const NeonOutlineButton: React.FC<NeonOutlineButtonProps> = ({
  label,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.6)",
    backgroundColor: "rgba(15,23,42,0.4)",
  },
  label: {
    color: "#E5E7EB",
    fontSize: 15,
    fontWeight: "600",
  },
});
