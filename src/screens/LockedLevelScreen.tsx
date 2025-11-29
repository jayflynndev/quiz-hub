import * as React from "react";
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
      <View style={styles.card}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.header}>Level {levelNumber} Locked</Text>

        <Text style={styles.subHeader}>
          To unlock this level in{" "}
          <Text style={styles.venueName}>{venueName}</Text>, you need to
          complete:
        </Text>

        <View style={styles.requirementBox}>
          <Text style={styles.requirementText}>
            Level {requiredLevelNumber}
          </Text>
        </View>

        <Text style={styles.hint}>
          Work your way through each level in order. Completing earlier levels
          earns XP, coins and unlocks the next challenge.
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Levels</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 24,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  lockIcon: {
    fontSize: 40,
    textAlign: "center",
    marginBottom: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    textAlign: "center",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
  },
  venueName: {
    color: "#F97316",
    fontWeight: "600",
  },
  requirementBox: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#1F2937",
    marginBottom: 16,
  },
  requirementText: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "600",
  },
  hint: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 999,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
