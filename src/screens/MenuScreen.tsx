import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Platform,
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

export const MenuScreen: React.FC<MenuScreenProps> = ({
  venueName,
  levels,
  onStartLevel,
  onBackToVenues,
}) => {
  const renderItem = ({ item }: { item: LevelWithStatus }) => {
    const isLocked = item.status === "locked";
    const isCompleted = item.status === "completed";

    const statusLabel = isLocked
      ? "Locked"
      : isCompleted
      ? "Completed"
      : "Ready";

    const statusEmoji = isLocked ? "🔒" : isCompleted ? "✅" : "▶️";

    return (
      <TouchableOpacity
        style={[
          styles.levelCard,
          isLocked && styles.levelCardLocked,
          isCompleted && styles.levelCardCompleted,
        ]}
        onPress={() => onStartLevel(item.id)} // App.tsx handles locked logic
        activeOpacity={0.85}
      >
        <View style={styles.levelHeaderRow}>
          <View>
            <Text style={styles.levelTitle}>Level {item.levelNumber}</Text>
            <Text style={styles.levelSubtitle}>
              Pass: {item.minCorrectToPass} correct
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
              {statusEmoji} {statusLabel}
            </Text>
          </View>
        </View>

        <Text style={styles.levelMeta}>
          Questions: {item.questionIds?.length ?? 0} · Lifelines:{" "}
          {item.lifelinesAllowed?.length ?? 0}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "bottom", "left"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>Jay&apos;s Quiz Odyssey</Text>
        <Text style={styles.venueName}>{venueName}</Text>
        <Text style={styles.subtitle}>
          10 levels per venue. Unlock them in order and build your streak.
        </Text>
      </View>

      {/* Levels list */}
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          levels.length === 0 ? styles.emptyListContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No levels defined for this venue.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackToVenues}
          activeOpacity={0.9}
        >
          <Text style={styles.backButtonText}>Back to Venues</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const BACKGROUND = "#050816";
const CARD_BG = "#020617";
const BORDER = "#1F2937";
const ACCENT = "#8B5CF6";
const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingTop: Platform.OS === "ios" ? 44 : 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
  },
  appName: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  venueName: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: TEXT_MUTED,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
  },
  levelCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  levelCardLocked: {
    opacity: 0.5,
  },
  levelCardCompleted: {
    borderColor: "#22C55E",
  },
  levelHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  levelSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: TEXT_MUTED,
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#4B5563",
  },
  statusPillLocked: {
    borderColor: "#F97316",
  },
  statusPillCompleted: {
    borderColor: "#22C55E",
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
  levelMeta: {
    marginTop: 8,
    fontSize: 12,
    color: TEXT_MUTED,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
});
