import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { StageScreen } from "../ui/StageScreen"; // adjust path if needed
import { NeonButton } from "../ui/NeonButton";

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
    <Pressable
      onPress={() => onSelectVenue(item.id)}
      style={({ pressed }) => [
        styles.venueCardOuter,
        pressed && styles.venueCardOuterPressed,
      ]}
    >
      <View style={styles.venueCardInner}>
        <View style={styles.venueHighlightStrip} />
        <View style={styles.venueHeaderRow}>
          <Text style={styles.venueName}>{item.name}</Text>
        </View>
        <Text style={styles.venueHint}>Tap to enter this venue</Text>
      </View>
    </Pressable>
  );

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Quiz Venues</Text>
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
        {/* Neon primary CTA */}
        <NeonButton
          label="Open Shop"
          onPress={onOpenShop}
          style={{ marginBottom: 8 }}
        />

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
    </StageScreen>
  );
};

const CARD_BG = "#020617";
const ACCENT = "#8B5CF6";
const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
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

  // List
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 10,
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

  // Venue cards
  venueCardOuter: {
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
  venueCardOuterPressed: {
    transform: [{ scale: 0.97 }],
  },
  venueCardInner: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.4)",
    overflow: "hidden",
  },
  venueHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -10,
    right: -10,
    height: 32,
    backgroundColor: "rgba(139,92,246,0.35)",
    opacity: 0.6,
  },
  venueHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  venueName: {
    fontSize: 16,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  venueHint: {
    marginTop: 10,
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // Footer
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
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F9FAFF",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(15,23,42,0.95)",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
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
