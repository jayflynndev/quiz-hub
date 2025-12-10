// src/screens/ReturningPlayerScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { useTheme } from "../contexts/ThemeContext";
import type { PlayerProfile, PlayerProgress } from "../types/game";
import { getUnclaimedStreakRewards } from "../data/streakRewards";
import { useStreakRewards } from "../hooks/useStreakRewards";
import { useToast } from "../contexts/ToastContext";

interface ReturningPlayerScreenProps {
  onContinue: () => void;
  profile: PlayerProfile;
  progress: PlayerProgress;
  onProfileUpdate: (profile: PlayerProfile) => Promise<void>;
}

export const ReturningPlayerScreen: React.FC<ReturningPlayerScreenProps> = ({
  onContinue,
  profile,
  progress,
  onProfileUpdate,
}) => {
  const { theme } = useTheme();
  const { claimedRewards, claimStreakReward } = useStreakRewards(profile);
  const { showToast } = useToast();
  const [claimingRewards, setClaimingRewards] = React.useState<Set<string>>(
    new Set()
  );

  const unclaimedRewards = getUnclaimedStreakRewards(
    profile.dailyStreak,
    claimedRewards
  );

  const handleClaimReward = async (rewardId: string) => {
    if (claimingRewards.has(rewardId)) return;

    setClaimingRewards((prev) => new Set(prev).add(rewardId));

    try {
      const rewards = await claimStreakReward(rewardId);
      if (rewards) {
        // Update profile with claimed rewards
        const updatedProfile = {
          ...profile,
          xp: profile.xp + rewards.xp,
          coins: profile.coins + rewards.coins,
          hearts: profile.hearts + rewards.bonusHearts,
        };

        await onProfileUpdate(updatedProfile);

        showToast(
          `Claimed reward: +${rewards.xp} XP, +${rewards.coins} coins${
            rewards.bonusHearts ? `, +${rewards.bonusHearts} hearts` : ""
          }! 🎉`,
          "success",
          4000
        );
      }
    } catch (error) {
      showToast("Failed to claim reward. Please try again.", "error");
    } finally {
      setClaimingRewards((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rewardId);
        return newSet;
      });
    }
  };

  const handleClaimAllRewards = async () => {
    const rewardsToClaim = unclaimedRewards.filter(
      (r) => !claimingRewards.has(r.id)
    );
    if (rewardsToClaim.length === 0) return;

    // Mark all as claiming
    setClaimingRewards((prev) => {
      const newSet = new Set(prev);
      rewardsToClaim.forEach((r) => newSet.add(r.id));
      return newSet;
    });

    try {
      let totalXp = 0;
      let totalCoins = 0;
      let totalHearts = 0;

      // Claim all rewards
      for (const reward of rewardsToClaim) {
        const rewards = await claimStreakReward(reward.id);
        if (rewards) {
          totalXp += rewards.xp;
          totalCoins += rewards.coins;
          totalHearts += rewards.bonusHearts;
        }
      }

      // Update profile once with all rewards
      if (totalXp > 0 || totalCoins > 0 || totalHearts > 0) {
        const updatedProfile = {
          ...profile,
          xp: profile.xp + totalXp,
          coins: profile.coins + totalCoins,
          hearts: profile.hearts + totalHearts,
        };
        await onProfileUpdate(updatedProfile);

        showToast(
          `Claimed all rewards: +${totalXp} XP, +${totalCoins} coins${
            totalHearts ? `, +${totalHearts} hearts` : ""
          }! 🎉`,
          "success",
          5000
        );
      }
    } catch (error) {
      showToast("Failed to claim rewards. Please try again.", "error");
    } finally {
      setClaimingRewards(new Set());
    }
  };

  const getDaysSinceLastActive = () => {
    if (!profile.lastActiveAt) return 0;
    const lastActive = new Date(profile.lastActiveAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysAway = getDaysSinceLastActive();

  return (
    <StageScreen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Welcome Back!
          </Text>
        </View>
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Ionicons
            name="heart-circle"
            size={48}
            color={theme.colors.neonGreen}
            style={styles.welcomeIcon}
          />
          <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
            Welcome Back, Quiz Champion!
          </Text>
          <Text
            style={[
              styles.welcomeSubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {daysAway > 1
              ? `It's been ${daysAway} days since your last visit!`
              : "Great to see you again!"}
          </Text>
        </View>

        {/* Current Streak */}
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="flame" size={24} color={theme.colors.neonGreen} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Current Streak
            </Text>
          </View>
          <Text style={[styles.streakCount, { color: theme.colors.neonGreen }]}>
            {profile.dailyStreak} days
          </Text>
          <Text
            style={[styles.streakText, { color: theme.colors.textSecondary }]}
          >
            Keep it up! Daily streaks earn bonus rewards.
          </Text>
        </View>

        {/* Unclaimed Rewards */}
        {unclaimedRewards.length > 0 && (
          <View
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="gift" size={24} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Claim Your Rewards
              </Text>
            </View>

            {/* Claim All Button */}
            <TouchableOpacity
              style={[
                styles.claimAllButton,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={handleClaimAllRewards}
              disabled={claimingRewards.size > 0}
            >
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.claimAllText}>
                {claimingRewards.size > 0 ? "Claiming..." : "Claim All Rewards"}
              </Text>
            </TouchableOpacity>

            {/* Individual Rewards */}
            {unclaimedRewards.map((reward) => (
              <View key={reward.id} style={styles.rewardItem}>
                <Text style={[styles.rewardIcon]}>{reward.icon}</Text>
                <View style={styles.rewardDetails}>
                  <Text
                    style={[styles.rewardTitle, { color: theme.colors.text }]}
                  >
                    {reward.title}
                  </Text>
                  <Text
                    style={[
                      styles.rewardDesc,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {reward.description}
                  </Text>
                  <View style={styles.rewardValues}>
                    {reward.rewards.xp > 0 && (
                      <Text
                        style={[
                          styles.rewardValue,
                          { color: theme.colors.neonGreen },
                        ]}
                      >
                        +{reward.rewards.xp} XP
                      </Text>
                    )}
                    {reward.rewards.coins > 0 && (
                      <Text
                        style={[
                          styles.rewardValue,
                          { color: theme.colors.primary },
                        ]}
                      >
                        +{reward.rewards.coins} coins
                      </Text>
                    )}
                    {reward.rewards.bonusHearts && (
                      <Text
                        style={[
                          styles.rewardValue,
                          { color: theme.colors.error },
                        ]}
                      >
                        +{reward.rewards.bonusHearts} hearts
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.claimButton,
                    claimingRewards.has(reward.id) && styles.claimingButton,
                  ]}
                  onPress={() => handleClaimReward(reward.id)}
                  disabled={claimingRewards.has(reward.id)}
                >
                  <Text
                    style={[
                      styles.claimButtonText,
                      claimingRewards.has(reward.id) &&
                        styles.claimingButtonText,
                    ]}
                  >
                    {claimingRewards.has(reward.id) ? "Claiming..." : "Claim"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Quick Stats */}
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons
              name="stats-chart"
              size={24}
              color={theme.colors.secondary}
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Your Progress
            </Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, { color: theme.colors.neonGreen }]}
              >
                {progress.completedLevelIds.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Levels Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {profile.level}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Player Level
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text
                style={[styles.statValue, { color: theme.colors.secondary }]}
              >
                {profile.coins}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Coins
              </Text>
            </View>
          </View>
        </View>

        {/* Daily Challenges Teaser */}
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={24} color={theme.colors.warning} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Daily Challenges
            </Text>
          </View>
          <Text
            style={[
              styles.challengeText,
              { color: theme.colors.textSecondary },
            ]}
          >
            New daily challenges are waiting for you! Test your knowledge and
            earn bonus rewards.
          </Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <NeonButton
            label="Continue to Quiz Hub"
            onPress={onContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </StageScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 20,
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.2)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },
  streakCount: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
  },
  streakText: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "rgba(15,23,42,0.5)",
    borderRadius: 12,
  },
  rewardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  rewardDetails: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  rewardDesc: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  rewardValues: {
    flexDirection: "row",
    gap: 12,
  },
  rewardValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  challengeText: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  continueButton: {
    marginHorizontal: 20,
  },
  claimAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  claimAllText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  claimButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  claimingButton: {
    backgroundColor: "#6B7280",
  },
  claimButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  claimingButtonText: {
    color: "#D1D5DB",
  },
});
