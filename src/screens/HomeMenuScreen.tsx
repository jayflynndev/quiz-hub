// src/screens/HomeMenuScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

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
    <View style={styles.container}>
      {/* Top section: title + tagline */}
      <View style={styles.header}>
        <Text style={styles.logoText}>QUIZ HUB</Text>
        <Text style={styles.tagline}>
          Build your quiz empire, one venue at a time.
        </Text>
      </View>

      {/* Middle section: main actions */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.primaryCard}>
          <Text style={styles.sectionLabel}>Single Player</Text>
          <Text style={styles.sectionDescription}>
            Progress through venues, earn XP and coins, and unlock tougher
            levels.
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={onPlaySinglePlayer}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Play Now
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.halfCard}>
            <Text style={styles.sectionLabel}>Multiplayer</Text>
            <Text style={styles.sectionDescriptionSmall}>
              Coming soon: challenge friends and climb global leaderboards.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.disabledButton]}
              onPress={onOpenMultiplayer}
              disabled
            >
              <Text style={[styles.buttonText, styles.disabledButtonText]}>
                Coming Soon
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.halfCard}>
            <Text style={styles.sectionLabel}>Shop</Text>
            <Text style={styles.sectionDescriptionSmall}>
              Trade coins for hearts and lifelines to keep your streak alive.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={onOpenShop}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Open Shop
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom: profile entry */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.profileButton} onPress={onOpenProfile}>
          <Text style={styles.profileButtonText}>View Profile & Stats</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BACKGROUND = "#050816";
const CARD_BG = "#111827";
const CARD_ALT_BG = "#020617";
const ACCENT = "#8B5CF6";
const ACCENT_SOFT = "#C4B5FD";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#FFFFFF",
  },
  tagline: {
    marginTop: 6,
    fontSize: 13,
    color: "#9CA3AF",
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  primaryCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfCard: {
    flex: 1,
    backgroundColor: CARD_ALT_BG,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: ACCENT_SOFT,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 13,
    color: "#E5E7EB",
  },
  sectionDescriptionSmall: {
    marginTop: 8,
    fontSize: 12,
    color: "#D1D5DB",
  },
  button: {
    marginTop: 14,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: ACCENT,
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: ACCENT,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: ACCENT_SOFT,
  },
  disabledButton: {
    backgroundColor: "#4B5563",
  },
  disabledButtonText: {
    color: "#E5E7EB",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  profileButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#374151",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#020617",
  },
  profileButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#E5E7EB",
  },
});
