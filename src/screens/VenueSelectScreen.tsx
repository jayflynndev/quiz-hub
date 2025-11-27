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
}

export const VenueSelectScreen: React.FC<VenueSelectScreenProps> = ({
  venues,
  onSelectVenue,
}) => {
  return (
    <SafeAreaView style={styles.container}>
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
});
