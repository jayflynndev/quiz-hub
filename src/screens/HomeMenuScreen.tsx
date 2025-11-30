// src/screens/HomeMenuScreen.tsx
import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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
      {/* Header / Brand */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.smallLabel}>Jay&apos;s Quiz Hub</Text>
          <Text style={styles.headerTitle}>Welcome back, Quizzer 👋</Text>
          <Text style={styles.headerSubtitle}>
            Choose your next challenge and keep your streak alive.
          </Text>
        </View>
      </View>

      {/* Main CTA card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroBadge}>Single Player</Text>
        <Text style={styles.heroTitle}>Quiz Odyssey</Text>
        <Text style={styles.heroText}>
          Progress through venues and levels, collect coins, and unlock new
          powers.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onPlaySinglePlayer}
        >
          <Text style={styles.primaryButtonText}>Play Now</Text>
        </TouchableOpacity>

        <Text style={styles.heroHint}>
          Tip: Perfect runs give bonus coins and XP.
        </Text>
      </View>

      {/* Secondary actions */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridCard} onPress={onOpenShop}>
          <Text style={styles.gridTitle}>Shop</Text>
          <Text style={styles.gridSubtitle}>Coins → Hearts & Lifelines</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridCard} onPress={onOpenProfile}>
          <Text style={styles.gridTitle}>Profile</Text>
          <Text style={styles.gridSubtitle}>XP, level & stats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.gridCard, styles.disabledCard]}
          onPress={onOpenMultiplayer}
        >
          <Text style={styles.gridTitle}>Multiplayer</Text>
          <Text style={styles.gridSubtitle}>Coming soon…</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerRow: {
    marginBottom: 16,
  },
  smallLabel: {
    fontSize: 12,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F9FAFB",
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 4,
  },
  heroCard: {
    backgroundColor: "#0B1120",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#4C1D95",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroBadge: {
    alignSelf: "flex-start",
    fontSize: 11,
    color: "#FACC15",
    backgroundColor: "#1F2937",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  heroText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 6,
  },
  primaryButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "700",
  },
  heroHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
  grid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridCard: {
    flexBasis: "48%",
    backgroundColor: "#020617",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  disabledCard: {
    opacity: 0.7,
    borderStyle: "dashed",
    borderColor: "#4B5563",
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
