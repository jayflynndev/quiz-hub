import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import { StageScreen } from "../ui/StageScreen"; // adjust path if needed

interface RegionItem {
  id: string;
  name: string;
  venueCount: number;
}

interface RegionSelectScreenProps {
  regions: RegionItem[];
  onSelectRegion: (id: string) => void;
  onBackToHome: () => void;
}

export const RegionSelectScreen: React.FC<RegionSelectScreenProps> = ({
  regions,
  onSelectRegion,
  onBackToHome,
}) => {
  const renderItem = ({ item }: { item: RegionItem }) => (
    <TouchableOpacity
      onPress={() => onSelectRegion(item.id)}
      activeOpacity={0.85}
      style={styles.regionCardOuter}
    >
      <View style={styles.regionCardInner}>
        <View style={styles.regionHighlightStrip} />
        <View style={styles.regionHeaderRow}>
          <Text style={styles.regionName}>{item.name}</Text>
          <View style={styles.venueBadge}>
            <Text style={styles.venueBadgeText}>
              {item.venueCount} {item.venueCount === 1 ? "venue" : "venues"}
            </Text>
          </View>
        </View>
        <Text style={styles.regionHint}>Tap to enter this region</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Quiz World</Text>
        <Text style={styles.title}>Choose Your Region</Text>
        <Text style={styles.subtitle}>
          Start your journey in one part of the quiz world.
        </Text>
      </View>

      {/* Regions list */}
      <FlatList
        data={regions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          regions.length === 0 ? styles.emptyListContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No regions available yet. Check back soon!
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Footer / Back */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const CARD_BG = "#020617";
const ACCENT = "#8B5CF6";
const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  appTag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: TEXT_MUTED,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
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

  // Region cards
  regionCardOuter: {
    borderRadius: 20,
    padding: 2,
    marginBottom: 14,
    backgroundColor: "rgba(15,23,42,0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  regionCardInner: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.35)",
    overflow: "hidden",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(139,92,246,0.35)",
  },
  regionHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -10,
    right: -10,
    height: 32,
    backgroundColor: "rgba(79,70,229,0.4)",
    opacity: 0.5,
  },
  regionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  regionName: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  venueBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: ACCENT,
  },
  venueBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EDE9FE",
  },
  regionHint: {
    marginTop: 12,
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
    borderColor: "rgba(148,163,255,0.7)",
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
});
