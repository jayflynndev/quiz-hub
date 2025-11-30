import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";

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
    <StageScreen>
      {/* Top branding */}
      <View style={styles.header}>
        <Text style={styles.appTag}>JAY&apos;S QUIZ HUB</Text>
        <Text style={styles.title}>Step into the studio 🎬</Text>
        <Text style={styles.subtitle}>
          Pick your mode and play for coins, XP and streaks.
        </Text>
      </View>

      {/* Main CTA stack */}
      <View style={styles.mainButtons}>
        {/* Big Play button like The Chase */}
        <TouchableOpacity
          onPress={onPlaySinglePlayer}
          activeOpacity={0.9}
          style={styles.playButtonOuter}
        >
          <View style={styles.playButtonInner}>
            <View style={styles.playGloss} />
            <Text style={styles.playButtonLabel}>QUIZ ODYSSEY</Text>
            <Text style={styles.playButtonSub}>Single Player · Level Path</Text>
            <NeonButton label="PLAY" style={styles.playNeon} />
          </View>
        </TouchableOpacity>

        {/* Secondary buttons row */}
        <View style={styles.row}>
          <TouchableOpacity
            onPress={onOpenShop}
            style={styles.secondaryButton}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryTitle}>Shop</Text>
            <Text style={styles.secondarySub}>Coins, hearts & lifelines</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onOpenProfile}
            style={styles.secondaryButton}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryTitle}>Profile</Text>
            <Text style={styles.secondarySub}>XP, level & stats</Text>
          </TouchableOpacity>
        </View>

        {/* Multiplayer teaser like a locked mode */}
        <TouchableOpacity
          onPress={onOpenMultiplayer}
          style={styles.multiplayerCard}
          activeOpacity={0.8}
        >
          <View style={styles.multiplayerTopRow}>
            <Text style={styles.multiplayerTitle}>Multiplayer</Text>
            <Text style={styles.comingSoonPill}>COMING SOON</Text>
          </View>
          <Text style={styles.multiplayerSub}>
            Face friends & rivals in real-time shows.
          </Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  appTag: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F9FAFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#CBD5F5",
  },

  // Main section
  mainButtons: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },

  // Primary CTA
  playButtonOuter: {
    borderRadius: 30,
    padding: 3,
    backgroundColor: "#8B5CF6",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    marginBottom: 24,
  },
  playButtonInner: {
    borderRadius: 26,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "#050518",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    overflow: "hidden",
  },
  playGloss: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: "45%",
    backgroundColor: "rgba(255,255,255,0.12)",
    opacity: 0.6,
  },
  playButtonLabel: {
    color: "#F9FAFF",
    fontSize: 18,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  playButtonSub: {
    color: "#E5E7F5",
    fontSize: 13,
    marginBottom: 16,
  },
  playNeon: {
    alignSelf: "flex-start",
    marginTop: 4,
  },

  // Secondary buttons
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "rgba(6,10,35,0.96)",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  secondaryTitle: {
    color: "#F9FAFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  secondarySub: {
    color: "#D1D5F5",
    fontSize: 12,
  },

  // Multiplayer teaser
  multiplayerCard: {
    marginTop: 4,
    backgroundColor: "rgba(4,7,30,0.9)",
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(251,191,36,0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  multiplayerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  multiplayerTitle: {
    color: "#F9FAFF",
    fontSize: 15,
    fontWeight: "700",
  },
  comingSoonPill: {
    fontSize: 10,
    color: "#FBBF24",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#FBBF24",
  },
  multiplayerSub: {
    color: "#E5E7F5",
    fontSize: 12,
    marginTop: 2,
  },
});
