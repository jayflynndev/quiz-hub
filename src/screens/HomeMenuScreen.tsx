import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HomeMenuScreenProps {
  onPlaySinglePlayer: () => void;
  onOpenMultiplayer: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
}

export const HomeMenuScreen: React.FC<HomeMenuScreenProps> = ({
  onPlaySinglePlayer,
  onOpenMultiplayer,
  onOpenProfile,
  onOpenShop,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand / hero */}
        <View style={styles.heroCard}>
          <Text style={styles.appName}>Jay&apos;s Quiz Odyssey</Text>
          <Text style={styles.tagline}>
            Climb venues, beat levels, and build your quiz legacy.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onPlaySinglePlayer}
          >
            <Text style={styles.primaryButtonText}>Play Single Player</Text>
            <Text style={styles.primaryButtonSub}>
              Start your journey from level 1
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick actions */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.secondaryCard} onPress={onOpenShop}>
            <Text style={styles.cardTitle}>Shop</Text>
            <Text style={styles.cardSubtitle}>Hearts & lifelines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryCard}
            onPress={onOpenProfile}
          >
            <Text style={styles.cardTitle}>Profile</Text>
            <Text style={styles.cardSubtitle}>Stats & progress</Text>
          </TouchableOpacity>
        </View>

        {/* Coming soon tile so the button in App.tsx still has a home */}
        <TouchableOpacity
          style={[styles.secondaryCard, styles.fullWidthCard]}
          onPress={onOpenMultiplayer}
        >
          <Text style={styles.cardTitle}>Multiplayer (coming soon)</Text>
          <Text style={styles.cardSubtitle}>
            Challenge friends and the world – stay tuned.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617", // very dark blue/black
  },
  scrollContent: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  appName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#F9FAFB",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  primaryButtonSub: {
    color: "#E5E7EB",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
    marginBottom: 12,
  },
  secondaryCard: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginRight: 10,
  },
  fullWidthCard: {
    marginRight: 0,
  },
  cardTitle: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  cardSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },
});
