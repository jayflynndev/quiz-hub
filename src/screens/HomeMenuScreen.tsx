import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";

interface HomeMenuScreenProps {
  onPlaySinglePlayer: () => void;
  onOpenMultiplayer: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
  loading?: boolean;
}

export const HomeMenuScreen: React.FC<HomeMenuScreenProps> = ({
  onPlaySinglePlayer,
  onOpenMultiplayer,
  onOpenProfile,
  onOpenShop,
  loading = false,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const styles = StyleSheet.create({
    // Header
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    testButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    appTag: {
      fontSize: 12,
      letterSpacing: 2,
      color: "#9CA3FF",
      textTransform: "uppercase",
    },
    title: {
      fontSize: 26,
      fontWeight: "800",
      color: theme.colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },

    // Main section
    mainButtons: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 20,
    },

    // Play button styles
    playButtonOuter: {
      marginBottom: 24,
    },
    playButtonInner: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 24,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    playGloss: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 80,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    playButtonLabel: {
      fontSize: 20,
      fontWeight: "800",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    playButtonSub: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 16,
    },
    playNeon: {
      alignSelf: "center",
    },

    // Secondary buttons
    row: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 16,
    },
    secondaryButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    secondaryTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 4,
    },
    secondarySub: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },

    // Multiplayer card
    multiplayerCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.2,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
      opacity: 0.7,
    },
    multiplayerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    multiplayerTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
    },
    comingSoonPill: {
      backgroundColor: theme.colors.neonGreen,
      color: theme.colors.background,
      fontSize: 10,
      fontWeight: "800",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      letterSpacing: 1,
    },
    multiplayerSub: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <StageScreen>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Top branding */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text
                style={styles.appTag}
                accessibilityRole="header"
                aria-level={1}
              >
                JAY&apos;S QUIZ HUB
              </Text>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() => showToast("Test success toast! 🎉", "success")}
                  style={styles.testButton}
                  accessibilityLabel="Test success toast"
                >
                  <Ionicons name="happy" size={20} color={theme.colors.text} />
                </TouchableOpacity>
                <ThemeToggle />
              </View>
            </View>
            <Text
              style={styles.title}
              accessibilityRole="header"
              aria-level={2}
            >
              Step into the studio 🎬
            </Text>
            <Text style={styles.subtitle}>
              Pick your mode and play for coins, XP and streaks.
            </Text>
          </View>

          {/* Main CTA stack */}
          <View style={styles.mainButtons}>
            {/* Big Play button like The Chase */}
            <View style={styles.playButtonOuter}>
              <View style={styles.playButtonInner}>
                <View style={styles.playGloss} />
                <Text style={styles.playButtonLabel}>QUIZ ODYSSEY</Text>
                <Text style={styles.playButtonSub}>
                  Single Player · Level Path
                </Text>
                <NeonButton
                  label="PLAY"
                  onPress={onPlaySinglePlayer}
                  icon={
                    <Ionicons name="play" size={18} color={theme.colors.text} />
                  }
                  style={styles.playNeon}
                  accessibilityLabel="Start Quiz Odyssey single player game"
                  accessibilityHint="Begins a new single player quiz game with level progression"
                />
              </View>
            </View>

            {/* Secondary buttons row */}
            <View style={styles.row}>
              <TouchableOpacity
                onPress={onOpenShop}
                style={styles.secondaryButton}
                activeOpacity={0.85}
                accessibilityLabel="Open shop"
                accessibilityHint="Purchase coins, hearts, and lifelines"
                accessibilityRole="button"
              >
                <Text style={styles.secondaryTitle}>Shop</Text>
                <Text style={styles.secondarySub}>
                  Coins, hearts & lifelines
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onOpenProfile}
                style={styles.secondaryButton}
                activeOpacity={0.85}
                accessibilityLabel="View profile"
                accessibilityHint="Check your XP, level, and game statistics"
                accessibilityRole="button"
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
              accessibilityLabel="Multiplayer mode - coming soon"
              accessibilityHint="Real-time multiplayer quiz games with friends"
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
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
        </>
      )}
    </StageScreen>
  );
};
