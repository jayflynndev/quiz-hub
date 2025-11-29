// src/screens/MenuScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
      <TouchableOpacity
        style={[
          styles.levelCard,
          isCompleted && styles.levelCardCompleted,
          isLocked && styles.levelCardLocked,
        ]}
        onPress={() => onStartLevel(item.id)}
      >
        <View style={styles.levelRow}>
          <View>
            <Text style={styles.levelTitle}>Level {item.levelNumber}</Text>
            <Text style={styles.levelMeta}>
              {questionCount} questions · Pass {item.minCorrectToPass}
            </Text>
          </View>

          <View style={styles.statusPill}>
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
          <Text style={styles.lockHint}>Complete previous level to unlock</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Venue</Text>
      <Text style={styles.subHeader}>{venueName}</Text>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select a Level</Text>

        <FlatList
          data={levels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 16 }}
        />

        <Text style={styles.hintText}>
          Levels unlock in order within each venue. Your progress is saved so
          you can pick up where you left off.
        </Text>

        <TouchableOpacity
          style={styles.backToVenuesButton}
          onPress={onBackToVenues}
        >
          <Text style={styles.backToVenuesText}>Back to Venues</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  subHeader: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 8,
  },
  levelCard: {
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  levelCardCompleted: {
    borderColor: "#22C55E",
  },
  levelCardLocked: {
    opacity: 0.55,
  },
  levelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  levelTitle: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  levelMeta: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  statusPillText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  lockHint: {
    marginTop: 6,
    color: "#9CA3AF",
    fontSize: 12,
  },
  hintText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 13,
  },
  backToVenuesButton: {
    marginTop: 18,
    backgroundColor: "#111827",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  backToVenuesText: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "600",
  },
});
