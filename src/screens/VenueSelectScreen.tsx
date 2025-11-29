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

interface VenueItem {
  id: string;
  name: string;
  regionId?: string;
}

interface VenueSelectScreenProps {
  venues: VenueItem[];
  onSelectVenue: (id: string) => void;
  onOpenShop: () => void;
  onRefillHearts: () => void;
  onBackToHome: () => void;
}

export const VenueSelectScreen: React.FC<VenueSelectScreenProps> = ({
  venues,
  onSelectVenue,
  onOpenShop,
  onRefillHearts,
  onBackToHome,
}) => {
  const renderItem = ({ item }: { item: VenueItem }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => onSelectVenue(item.id)}
      activeOpacity={0.85}
    >
      <View style={styles.venueHeaderRow}>
        <Text style={styles.venueName}>{item.name}</Text>
      </View>
      <Text style={styles.venueHint}>Tap to enter this venue</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "bottom", "left"]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pick a Venue</Text>
        <Text style={styles.subtitle}>
          Each venue has 10 levels. Start where you fancy playing tonight.
        </Text>
      </View>

      {/* Venues list */}
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={
          venues.length === 0 ? styles.emptyListContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No venues available yet in this region.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Footer actions */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onOpenShop}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryButtonText}>Open Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBackToHome}
          activeOpacity={0.9}
        >
          <Text style={styles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        {/* Debug hearts refill (dev-only) */}
        <TouchableOpacity
          onPress={onRefillHearts}
          style={styles.debugButton}
          activeOpacity={0.7}
        >
          <Text style={styles.debugText}>Refill Hearts (dev)</Text>
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
    paddingTop: Platform.OS === "ios" ? 44 : 0, // avoid notch on first load
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 8,
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
  venueCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  venueHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueName: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  venueHint: {
    marginTop: 6,
    fontSize: 12,
    color: TEXT_MUTED,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryButton: {
    borderRadius: 999,
    backgroundColor: ACCENT,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F9FAFF",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_MAIN,
  },
  debugButton: {
    marginTop: 8,
    alignItems: "center",
  },
  debugText: {
    fontSize: 11,
    color: "#6B7280",
  },
});
