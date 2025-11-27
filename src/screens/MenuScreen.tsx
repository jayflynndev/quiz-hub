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
  onBackToVenues: () => void; // ⬅️ Add this line
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

    return (
      <TouchableOpacity
        style={[
          styles.levelButton,
          isLocked && styles.levelButtonLocked,
          isCompleted && styles.levelButtonCompleted,
        ]}
        onPress={() => !isLocked && onStartLevel(item.id)}
        disabled={isLocked}
      >
        <View style={styles.levelHeaderRow}>
          <Text style={styles.levelButtonText}>Level {item.levelNumber}</Text>
          <Text style={styles.levelStatusText}>
            {isLocked ? "Locked" : isCompleted ? "Completed ✅" : "Unlocked"}
          </Text>
        </View>
        <Text style={styles.levelMeta}>
          Questions: {item.questionIds.length} · Pass: {item.minCorrectToPass}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Jay&apos;s Quiz Odyssey</Text>
      <Text style={styles.subHeader}>Prototype · UK · {venueName}</Text>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Select a Level</Text>

        <FlatList
          data={levels}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />

        <Text style={styles.hintText}>
          Levels unlock in order within each venue. Progress is saved locally
          for now.
        </Text>
        <TouchableOpacity
          style={styles.backToVenuesButton}
          onPress={onBackToVenues}
        >
          <Text style={styles.levelButtonText}>Back to Venues</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  content: {
    marginTop: 8,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 12,
  },
  levelButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  levelButtonLocked: {
    opacity: 0.4,
  },
  levelButtonCompleted: {
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  levelHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  levelStatusText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  levelMeta: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  hintText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 13,
  },
  backToVenuesButton: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 20,
  },
});
