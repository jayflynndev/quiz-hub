// src/screens/VenueSelectScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Venue } from "../types/game";

interface VenueSelectScreenProps {
  venues: Venue[];
  onSelectVenue: (venueId: string) => void;
  onOpenShop: () => void; // ⬅ add
  onRefillHearts: () => void; // ⬅ add
}

export const VenueSelectScreen: React.FC<VenueSelectScreenProps> = ({
  venues,
  onSelectVenue,
  onOpenShop,
  onRefillHearts,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.shopButton} onPress={onOpenShop}>
        <Text style={styles.shopButtonText}>Open Shop</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Jay&apos;s Quiz Odyssey</Text>
      <Text style={styles.subHeader}>UK · Choose Your Venue</Text>

      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.venueButton}
            onPress={() => onSelectVenue(item.id)}
          >
            <Text style={styles.venueName}>{item.name}</Text>
            {item.description ? (
              <Text style={styles.venueDesc}>{item.description}</Text>
            ) : null}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <TouchableOpacity style={styles.heartsButton} onPress={onRefillHearts}>
        <Text style={styles.heartsButtonText}>Refill Hearts (dev)</Text>
      </TouchableOpacity>
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
  listContent: {
    paddingBottom: 16,
  },
  venueButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  venueName: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
  },
  venueDesc: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
  shopButton: {
    alignSelf: "flex-start",
    backgroundColor: "#4B5563",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginBottom: 12,
  },
  shopButtonText: {
    color: "#E5E7EB",
    fontSize: 13,
    fontWeight: "500",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  heartsButton: {
    backgroundColor: "#991B1B",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  heartsButtonText: {
    color: "#FEE2E2",
    fontSize: 12,
    fontWeight: "600",
  },
});
