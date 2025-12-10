import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useTheme } from "../contexts/ThemeContext";
import { useSound } from "../hooks/useSound";

interface HomeMenuScreenProps {
  onPlaySinglePlayer: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
  onOpenSettings: () => void;
  onOpenStreakRewards: () => void;
  onOpenDailyChallenges: () => void;
  loading?: boolean;
}

export const HomeMenuScreen: React.FC<HomeMenuScreenProps> = ({
  onPlaySinglePlayer,
  onOpenProfile,
  onOpenShop,
  onOpenSettings,
  onOpenStreakRewards,
  onOpenDailyChallenges,
  loading = false,
}) => {
  const { theme } = useTheme();
  const { playButtonSound } = useSound();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },

    // Header
    header: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 8,
    },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    profileButton: {
      padding: 10,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingsButton: {
      padding: 10,
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
      fontWeight: "600",
    },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: "#E5E7EB",
      lineHeight: 22,
    },

    // Main content
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },

    // Hero section
    heroSection: {
      marginBottom: 32,
    },
    heroCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 32,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.15,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    heroGlow: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      backgroundColor: "rgba(156, 163, 255, 0.1)",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    heroTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: theme.colors.text,
      textAlign: "center",
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginBottom: 24,
      lineHeight: 22,
    },
    playButton: {
      alignSelf: "center",
    },

    // Features grid
    featuresSection: {
      marginBottom: 24,
    },
    featuresTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 16,
      textAlign: "center",
    },
    featuresGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    featureCard: {
      flex: 1,
      minWidth: "45%",
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    featureIcon: {
      fontSize: 24,
      marginBottom: 12,
      textAlign: "center",
    },
    featureTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 4,
      textAlign: "center",
    },
    featureSubtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      textAlign: "center",
      lineHeight: 18,
    },
  });

  if (loading) {
    return (
      <StageScreen>
        <LoadingSpinner />
      </StageScreen>
    );
  }

  return (
    <StageScreen>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.appTag}>Quiz Hub</Text>
              <Text style={styles.title}>Welcome Back</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => {
                  playButtonSound();
                  onOpenProfile();
                }}
                style={styles.profileButton}
                accessibilityLabel="Profile"
                accessibilityHint="View your profile and statistics"
              >
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  playButtonSound();
                  onOpenSettings();
                }}
                style={styles.settingsButton}
                accessibilityLabel="Settings"
                accessibilityHint="Open app settings"
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={theme.colors.text}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.subtitle}>Ready for your next challenge?</Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Hero Play Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroCard}>
              <View style={styles.heroGlow} />
              <Text style={styles.heroTitle}>Quiz Odyssey</Text>
              <Text style={styles.heroSubtitle}>
                Test your knowledge across multiple categories and levels
              </Text>
              <NeonButton
                label="Start Playing"
                onPress={() => {
                  playButtonSound();
                  onPlaySinglePlayer();
                }}
                icon={
                  <Ionicons name="play" size={18} color={theme.colors.text} />
                }
                style={styles.playButton}
                accessibilityLabel="Start quiz game"
                accessibilityHint="Begin a new quiz game"
              />
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Explore Features</Text>
            <View style={styles.featuresGrid}>
              <TouchableOpacity
                onPress={() => {
                  playButtonSound();
                  onOpenDailyChallenges();
                }}
                style={styles.featureCard}
                activeOpacity={0.8}
                accessibilityLabel="Daily challenges"
                accessibilityHint="Complete daily challenges for rewards"
              >
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureTitle}>Daily Challenges</Text>
                <Text style={styles.featureSubtitle}>
                  Complete daily quests for bonus rewards
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  playButtonSound();
                  onOpenStreakRewards();
                }}
                style={styles.featureCard}
                activeOpacity={0.8}
                accessibilityLabel="Streak rewards"
                accessibilityHint="View daily login bonuses and milestones"
              >
                <Text style={styles.featureIcon}>🔥</Text>
                <Text style={styles.featureTitle}>Streak Rewards</Text>
                <Text style={styles.featureSubtitle}>
                  Daily bonuses and milestone achievements
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  playButtonSound();
                  onOpenShop();
                }}
                style={styles.featureCard}
                activeOpacity={0.8}
                accessibilityLabel="Shop"
                accessibilityHint="Purchase items and power-ups"
              >
                <Text style={styles.featureIcon}>🛒</Text>
                <Text style={styles.featureTitle}>Shop</Text>
                <Text style={styles.featureSubtitle}>
                  Buy coins, hearts, and power-ups
                </Text>
              </TouchableOpacity>

              <View style={[styles.featureCard, { opacity: 0.6 }]}>
                <Text style={styles.featureIcon}>👥</Text>
                <Text style={styles.featureTitle}>Multiplayer</Text>
                <Text style={styles.featureSubtitle}>
                  Coming soon - play with friends
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </StageScreen>
  );
};
