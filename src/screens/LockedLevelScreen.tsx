import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StageScreen } from "../ui/StageScreen";

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
    <StageScreen>
      {/* Header to match other screens */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Level Locked</Text>
        <Text style={styles.appTitle}>{venueName}</Text>
        <Text style={styles.appSubtitle}>
          Work your way through each challenge in order.
        </Text>
      </View>

      {/* Lock card */}
      <View style={styles.cardOuter}>
        <View style={styles.cardInner}>
          <View style={[styles.cardHighlightStrip, styles.lockedStrip]} />

          <Text style={styles.cardTitle}>🔒 Level Locked</Text>

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
            Complete earlier levels to earn XP, coins and unlock the next
            challenge in the venue path.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.9}
          >
            <Text style={styles.backButtonText}>Back to Levels</Text>
          </TouchableOpacity>
        </View>
      </View>
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  appTag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  appSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
  },

  // Card
  cardOuter: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 32,
  },
  cardInner: {
    borderRadius: 22,
    paddingTop: 58, // 40 for strip + 18 for spacing
    paddingBottom: 18,
    paddingHorizontal: 18,
    backgroundColor: "rgba(15,23,42,0.97)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    overflow: "hidden",
  },
  cardHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 40,
    opacity: 0.7,
  },
  lockedStrip: {
    backgroundColor: "rgba(239,68,68,0.45)", // red for locked
  },
  cardTitle: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT_MAIN,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
  },

  subHeader: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 16,
  },
  venueName: {
    color: "#F97316",
    fontWeight: "700",
  },

  requirementBox: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(31,41,55,0.95)",
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.9)",
    marginBottom: 16,
  },
  requirementText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
  },

  hint: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 20,
  },

  backButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  backButtonText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
