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
      style={styles.regionCard}
      onPress={() => onSelectRegion(item.id)}
    >
      <View style={styles.regionHeaderRow}>
        <Text style={styles.regionName}>{item.name}</Text>
        <View style={styles.venueBadge}>
          <Text style={styles.venueBadgeText}>
            {item.venueCount} {item.venueCount === 1 ? "venue" : "venues"}
          </Text>
        </View>
      </View>
      <Text style={styles.regionHint}>Tap to enter this region</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "bottom", "left"]}
    >
      {/* Header */}
      <View style={styles.header}>
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
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
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
  regionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  regionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  regionName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  venueBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: ACCENT,
  },
  venueBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EDE9FE",
  },
  regionHint: {
    marginTop: 6,
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
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_MAIN,
  },
});
