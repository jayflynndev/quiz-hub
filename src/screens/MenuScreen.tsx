// src/screens/MenuScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { StageScreen } from "../ui/StageScreen";
import type { LevelConfig, LevelId, LevelProgressStatus } from "../types/game";

interface LevelWithStatus extends LevelConfig {
  status: LevelProgressStatus;
}

interface MenuScreenProps {
  venueName: string;
  levels: LevelWithStatus[];
  onStartLevel: (levelId: LevelId) => void;
  onBackToVenues: () => void;
}

// Local helper so the list matches the in-level behaviour
const getPlannedQuestionCountForMenu = (level: LevelConfig): number => {
  if (level.questionIds && level.questionIds.length > 0) {
    return level.questionIds.length;
  }
  if (level.levelNumber <= 4) return 5;
  if (level.levelNumber <= 7) return 6;
  return 7;
};

export const MenuScreen: React.FC<MenuScreenProps> = ({
  venueName,
  levels,
  onStartLevel,
  onBackToVenues,
}) => {
  const renderItem = ({ item }: { item: LevelWithStatus }) => {
    const isLocked = item.status === "locked";
    const isCompleted = item.status === "completed";
    const questionCount = getPlannedQuestionCountForMenu(item);

    return (
      <Pressable
        onPress={() => !isLocked && onStartLevel(item.id)}
        style={({ pressed }) => [
          styles.levelCardOuter,
          isCompleted && styles.levelCardOuterCompleted,
          isLocked && styles.levelCardOuterLocked,
          pressed && !isLocked && styles.levelCardOuterPressed,
        ]}
      >
        <View style={styles.levelCardInner}>
          <View style={styles.levelHighlightStrip} />
          <View style={styles.levelRow}>
            <View>
              <Text style={styles.levelTitle}>Level {item.levelNumber}</Text>
              <Text style={styles.levelMeta}>
                {questionCount} questions · Pass {item.minCorrectToPass}
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                isLocked && styles.statusPillLocked,
                isCompleted && styles.statusPillCompleted,
              ]}
            >
              <Text style={styles.statusPillText}>
                {isLocked
                  ? "Locked"
                  : isCompleted
                  ? "Completed"
                  : "Ready to play"}
              </Text>
            </View>
          </View>

          {isLocked && (
            <Text style={styles.lockHint}>
              Complete previous level to unlock.
            </Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Venue</Text>
        <Text style={styles.venueName}>{venueName}</Text>
        <Text style={styles.sectionTitle}>Select a Level</Text>
        <Text style={styles.subtitle}>
          Levels unlock in order. Your progress is saved as you go.
        </Text>
      </View>

      {/* Levels list */}
      <View style={styles.listWrapper}>
        <FlatList
          data={levels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.hintText}>
          Finish each level to light up the venue and push towards the next
          region.
        </Text>

        <TouchableOpacity
          style={styles.backToVenuesButton}
          onPress={onBackToVenues}
          activeOpacity={0.9}
        >
          <Text style={styles.backToVenuesText}>Back to Venues</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";
const CARD_BG = "#020617";

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 10,
  },
  appTag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  venueName: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: TEXT_MUTED,
  },

  // List
  listWrapper: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  listContent: {
    paddingBottom: 16,
  },

  // Level cards
  levelCardOuter: {
    borderRadius: 20,
    padding: 2,
    marginBottom: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  levelCardOuterPressed: {
    transform: [{ scale: 0.97 }],
  },
  levelCardOuterCompleted: {
    shadowColor: "#22C55E",
    shadowOpacity: 0.9,
  },
  levelCardOuterLocked: {
    opacity: 0.6,
  },
  levelCardInner: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.4)",
    overflow: "hidden",
  },
  levelHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -10,
    right: -10,
    height: 30,
    backgroundColor: "rgba(79,70,229,0.4)",
    opacity: 0.6,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelTitle: {
    color: TEXT_MAIN,
    fontSize: 16,
    fontWeight: "700",
  },
  levelMeta: {
    color: TEXT_MUTED,
    fontSize: 13,
    marginTop: 2,
  },

  // Status pill
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.8)",
  },
  statusPillLocked: {
    borderColor: "#F97316",
    backgroundColor: "rgba(30,64,175,0.5)",
  },
  statusPillCompleted: {
    borderColor: "#22C55E",
    backgroundColor: "rgba(22,101,52,0.7)",
  },
  statusPillText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "600",
  },

  lockHint: {
    marginTop: 8,
    color: TEXT_MUTED,
    fontSize: 12,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hintText: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 10,
  },
  backToVenuesButton: {
    backgroundColor: "rgba(15,23,42,0.95)",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.8)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  backToVenuesText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
  },
});
