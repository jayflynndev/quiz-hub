import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StageScreen } from "../ui/StageScreen";
import type { PlayerProfile } from "../types/game";
import { useStreakRewards } from "../hooks/useStreakRewards";
import { STREAK_REWARDS } from "../data/streakRewards";
import { useAchievements } from "../contexts/AchievementContext";

interface StreakRewardsScreenProps {
  profile: PlayerProfile;
  onBack: () => void;
}

export const StreakRewardsScreen: React.FC<StreakRewardsScreenProps> = ({
  profile,
  onBack,
}) => {
  const {
    unclaimedRewards,
    claimStreakReward,
    isRewardClaimed,
    getDailyLoginBonus,
  } = useStreakRewards(profile);
  const { achievements, unlockedAchievements } = useAchievements();

  const handleClaimReward = async (rewardId: string) => {
    const rewards = await claimStreakReward(rewardId);
    if (rewards) {
      // The toast notification is handled in the hook
      // You could add additional UI feedback here if needed
    }
  };

  const dailyBonus = getDailyLoginBonus();

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Streak Rewards</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Hub</Text>
        <Text style={styles.appSubtitle}>
          Keep your streak alive for amazing rewards!
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Streak Status */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View style={[styles.cardHighlightStrip, styles.streakStrip]} />

            <Text style={styles.cardTitle}>🔥 Current Streak</Text>

            <View style={styles.streakDisplay}>
              <Text style={styles.streakNumber}>{profile.dailyStreak}</Text>
              <Text style={styles.streakLabel}>Days</Text>
            </View>

            <View style={styles.dailyBonus}>
              <Text style={styles.dailyBonusText}>
                Daily Bonus: +{dailyBonus.xp} XP, +{dailyBonus.coins} coins
              </Text>
            </View>
          </View>
        </View>

        {/* Milestone Rewards */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View style={[styles.cardHighlightStrip, styles.rewardsStrip]} />

            <Text style={styles.cardTitle}>🏆 Milestone Rewards</Text>
            <Text style={styles.cardSubtitle}>
              Claim rewards for reaching streak milestones
            </Text>

            <View style={styles.rewardsList}>
              {STREAK_REWARDS.map((reward) => {
                const isClaimed = isRewardClaimed(reward.id);
                const canClaim =
                  reward.streakDays <= profile.dailyStreak && !isClaimed;

                return (
                  <View key={reward.id} style={styles.rewardItem}>
                    <View style={styles.rewardHeader}>
                      <Text style={styles.rewardIcon}>{reward.icon}</Text>
                      <View style={styles.rewardInfo}>
                        <Text style={styles.rewardTitle}>{reward.title}</Text>
                        <Text style={styles.rewardDescription}>
                          {reward.description}
                        </Text>
                        <Text style={styles.rewardStreak}>
                          {reward.streakDays} day streak
                        </Text>
                      </View>
                    </View>

                    <View style={styles.rewardDetails}>
                      <View style={styles.rewardStats}>
                        <Text style={styles.rewardStat}>
                          +{reward.rewards.xp} XP
                        </Text>
                        <Text style={styles.rewardStat}>
                          +{reward.rewards.coins} coins
                        </Text>
                        {reward.rewards.bonusHearts && (
                          <Text style={styles.rewardStat}>
                            +{reward.rewards.bonusHearts} hearts
                          </Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[
                          styles.claimButton,
                          isClaimed && styles.claimedButton,
                          !canClaim && !isClaimed && styles.lockedButton,
                        ]}
                        onPress={() => canClaim && handleClaimReward(reward.id)}
                        disabled={!canClaim || isClaimed}
                      >
                        <Text
                          style={[
                            styles.claimButtonText,
                            isClaimed && styles.claimedButtonText,
                          ]}
                        >
                          {isClaimed
                            ? "Claimed ✓"
                            : canClaim
                            ? "Claim"
                            : "Locked"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Achievement Goals */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View
              style={[styles.cardHighlightStrip, styles.achievementStrip]}
            />

            <Text style={styles.cardTitle}>🏆 Achievement Goals</Text>
            <Text style={styles.cardSubtitle}>
              Unlock these achievements by maintaining streaks and completing
              challenges
            </Text>

            <View style={styles.achievementsList}>
              {achievements.map((achievement) => {
                const isUnlocked = unlockedAchievements.some(
                  (a) => a.id === achievement.id
                );

                return (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <View style={styles.achievementHeader}>
                      <Text style={styles.achievementIcon}>
                        {achievement.icon}
                      </Text>
                      <View style={styles.achievementInfo}>
                        <Text style={styles.achievementTitle}>
                          {achievement.title}
                        </Text>
                        <Text style={styles.achievementDescription}>
                          {achievement.description}
                        </Text>
                        <Text style={styles.achievementRarity}>
                          {achievement.rarity} •{" "}
                          {isUnlocked ? "Unlocked ✓" : "Locked"}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Streak Tips */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View style={[styles.cardHighlightStrip, styles.tipsStrip]} />

            <Text style={styles.cardTitle}>💡 Streak Tips</Text>

            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>
                • Play at least one level per day to maintain your streak
              </Text>
              <Text style={styles.tipItem}>
                • Daily bonuses increase with longer streaks
              </Text>
              <Text style={styles.tipItem}>
                • Milestone rewards are claimed once and become permanent
              </Text>
              <Text style={styles.tipItem}>
                • Missing a day resets your streak to 1
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  appTag: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff6b6b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flex: 1,
    width: "100%",
  },
  cardOuter: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInner: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
  },
  cardHighlightStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  streakStrip: {
    backgroundColor: "#EF4444",
  },
  rewardsStrip: {
    backgroundColor: "#F59E0B",
  },
  tipsStrip: {
    backgroundColor: "#10B981",
  },
  achievementStrip: {
    backgroundColor: "#8B5CF6",
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  achievementHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  achievementIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  achievementRarity: {
    fontSize: 12,
    color: "#8B5CF6",
    fontWeight: "600",
  },
  achievementProgress: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
  achievementUnlocked: {
    backgroundColor: "#D1FAE5",
    borderColor: "#10B981",
  },
  achievementLocked: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  streakDisplay: {
    alignItems: "center",
    marginBottom: 15,
  },
  streakNumber: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#EF4444",
  },
  streakLabel: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  dailyBonus: {
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  dailyBonusText: {
    fontSize: 14,
    color: "#92400E",
    fontWeight: "600",
  },
  rewardsList: {
    gap: 15,
  },
  rewardItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rewardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rewardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  rewardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  rewardStreak: {
    fontSize: 12,
    color: "#F59E0B",
    fontWeight: "600",
  },
  rewardDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rewardStats: {
    flex: 1,
  },
  rewardStat: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  claimButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 80,
    alignItems: "center",
  },
  claimedButton: {
    backgroundColor: "#10B981",
  },
  lockedButton: {
    backgroundColor: "#E5E7EB",
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  claimedButtonText: {
    color: "#fff",
  },
  tipsList: {
    paddingVertical: 10,
  },
  tipItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 20,
  },
  backButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
