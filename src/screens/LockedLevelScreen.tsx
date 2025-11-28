import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LockedLevelScreenProps {
  venueName: string;
  levelNumber: number;
  requiredLevelNumber: number;
  onBack: () => void;
}

export const LockedLevelScreen: React.FC<LockedLevelScreenProps> = ({
  venueName,
  levelNumber,
  requiredLevelNumber,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Level {levelNumber} Locked 🔒</Text>

      <Text style={styles.subHeader}>To unlock this level in {venueName}:</Text>

      <Text style={styles.explanation}>
        Complete Level {requiredLevelNumber} first.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Back to Levels</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 16,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: "#9CA3AF",
    marginBottom: 8,
    textAlign: "center",
  },
  explanation: {
    fontSize: 18,
    color: "#FBBF24",
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#F9FAFB",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
