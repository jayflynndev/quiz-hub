import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StageScreen } from "../ui/StageScreen";
import type { PlayerProfile, PlayerProgress } from "../types/game";
import { useAchievements } from "../contexts/AchievementContext";

interface ProfileStatsScreenProps {
  profile: PlayerProfile;
  progress: PlayerProgress;
  xpToNextLevel: number;
  isSignedIn: boolean;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onBack: () => void;
}

export const ProfileStatsScreen: React.FC<ProfileStatsScreenProps> = ({
  profile,
  progress,
  xpToNextLevel,
  onBack,
  isSignedIn,
  onLogout,
  onOpenAuth,
}) => {
  const { achievements, unlockedAchievements } = useAchievements();

  // Profile calculations
  const rawPercent =
    xpToNextLevel > 0 ? Math.round((profile.xp / xpToNextLevel) * 100) : 0;
  const progressPercent = Math.max(0, Math.min(100, rawPercent));

  // Statistics calculations
  const totalLevelsCompleted = progress.completedLevelIds.length;
  const totalXP = profile.xp;
  const currentLevel = profile.level;
  const totalCoins = profile.coins;
  const currentStreak = profile.dailyStreak;

  // Achievement Statistics
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const achievementCompletionRate =
    totalAchievements > 0
      ? Math.round((unlockedCount / totalAchievements) * 100)
      : 0;

  // Daily Challenge Statistics
  const totalChallengesCompleted = profile.dailyChallengeProgress.filter(
    (p) => p.completed
  ).length;
  const perfectChallenges = profile.dailyChallengeProgress.filter(
    (p) => p.accuracy === 1.0
  ).length;
  const averageChallengeAccuracy =
    totalChallengesCompleted > 0
      ? Math.round(
          (profile.dailyChallengeProgress.reduce(
            (sum, p) => sum + (p.accuracy || 0),
            0
          ) /
            totalChallengesCompleted) *
            100
        )
      : 0;

  // Performance Analytics
  const averageXPPerLevel =
    totalLevelsCompleted > 0 ? Math.round(totalXP / totalLevelsCompleted) : 0;

  // Rarity breakdown for achievements
  const rarityStats = {
    common: unlockedAchievements.filter((a) => a.rarity === "common").length,
    rare: unlockedAchievements.filter((a) => a.rarity === "rare").length,
    epic: unlockedAchievements.filter((a) => a.rarity === "epic").length,
    legendary: unlockedAchievements.filter((a) => a.rarity === "legendary")
      .length,
  };

  // Recent achievements (last 7 days)
  const recentAchievements = unlockedAchievements
    .filter(
      (a) => a.unlockedAt && Date.now() - a.unlockedAt < 7 * 24 * 60 * 60 * 1000
    )
    .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0))
    .slice(0, 3);

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Profile & Stats</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Hub</Text>
        <Text style={styles.appSubtitle}>
          Your profile and comprehensive quiz journey analytics.
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View style={[styles.cardHighlightStrip, styles.profileStrip]} />

            <Text style={styles.cardTitle}>👤 Profile</Text>

            <View style={styles.rowTop}>
              <View>
                <Text style={styles.levelLabel}>Level</Text>
                <Text style={styles.levelValue}>{profile.level}</Text>
              </View>
              <View style={styles.heartsPill}>
                <Text style={styles.heartsText}>❤️ {profile.hearts}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>XP Progress</Text>
              <Text style={styles.value}>
                {profile.xp.toLocaleString()}/{xpToNextLevel.toLocaleString()} (
                {progressPercent}%)
              </Text>
              <View style={styles.progressBarOuter}>
                <View
                  style={[
                    styles.progressBarInner,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
            </View>

            <View style={styles.sectionRow}>
              <View style={styles.sectionHalf}>
                <Text style={styles.label}>Coins</Text>
                <Text style={styles.value}>
                  {profile.coins.toLocaleString()}
                </Text>
              </View>
              <View style={styles.sectionHalf}>
                <Text style={styles.label}>Daily Streak</Text>
                <Text style={styles.value}>{currentStreak} days</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Lifelines Owned</Text>
              <Text style={styles.value}>
                👥 Ask Quizzers: {profile.askQuizzersOwned}
                {"\n"}✨ 50/50: {profile.fiftyFiftyOwned}
              </Text>
            </View>
          </View>
        </View>

        {/* Overview Stats Card */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View style={[styles.cardHighlightStrip, styles.overviewStrip]} />

            <Text style={styles.cardTitle}>📊 Overview Statistics</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalLevelsCompleted}</Text>
                <Text style={styles.statLabel}>Levels Completed</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {achievementCompletionRate}%
                </Text>
                <Text style={styles.statLabel}>Achievements</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalChallengesCompleted}</Text>
                <Text style={styles.statLabel}>Challenges Won</Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statValue}>{averageXPPerLevel}</Text>
                <Text style={styles.statLabel}>Avg XP/Level</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievement Progress Card */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View
              style={[styles.cardHighlightStrip, styles.achievementStrip]}
            />

            <Text style={styles.cardTitle}>🏆 Achievement Progress</Text>

            <View style={styles.achievementOverview}>
              <View style={styles.achievementStat}>
                <Text style={styles.achievementValue}>{unlockedCount}</Text>
                <Text style={styles.achievementLabel}>Unlocked</Text>
              </View>
              <View style={styles.achievementStat}>
                <Text style={styles.achievementValue}>
                  {totalAchievements - unlockedCount}
                </Text>
                <Text style={styles.achievementLabel}>Remaining</Text>
              </View>
              <View style={styles.achievementStat}>
                <Text style={styles.achievementValue}>
                  {achievementCompletionRate}%
                </Text>
                <Text style={styles.achievementLabel}>Complete</Text>
              </View>
            </View>

            <View style={styles.rarityBreakdown}>
              <Text style={styles.rarityTitle}>By Rarity:</Text>
              <View style={styles.rarityStats}>
                <Text style={styles.rarityItem}>
                  Common: {rarityStats.common}
                </Text>
                <Text style={styles.rarityItem}>Rare: {rarityStats.rare}</Text>
                <Text style={styles.rarityItem}>Epic: {rarityStats.epic}</Text>
                <Text style={styles.rarityItem}>
                  Legendary: {rarityStats.legendary}
                </Text>
              </View>
            </View>

            {recentAchievements.length > 0 && (
              <View style={styles.recentAchievements}>
                <Text style={styles.recentTitle}>🎉 Recent Unlocks</Text>
                {recentAchievements.map((achievement) => (
                  <View key={achievement.id} style={styles.recentAchievement}>
                    <Text style={styles.recentIcon}>{achievement.icon}</Text>
                    <View style={styles.recentInfo}>
                      <Text style={styles.recentName}>{achievement.title}</Text>
                      <Text style={styles.recentDesc}>
                        {achievement.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Challenge Performance Card */}
        <View style={styles.cardOuter}>
          <View style={styles.cardInner}>
            <View style={[styles.cardHighlightStrip, styles.challengeStrip]} />

            <Text style={styles.cardTitle}>🎯 Daily Challenge Performance</Text>

            <View style={styles.challengeStats}>
              <View style={styles.challengeStat}>
                <Text style={styles.challengeValue}>
                  {totalChallengesCompleted}
                </Text>
                <Text style={styles.challengeLabel}>Completed</Text>
              </View>
              <View style={styles.challengeStat}>
                <Text style={styles.challengeValue}>{perfectChallenges}</Text>
                <Text style={styles.challengeLabel}>Perfect</Text>
              </View>
              <View style={styles.challengeStat}>
                <Text style={styles.challengeValue}>
                  {averageChallengeAccuracy}%
                </Text>
                <Text style={styles.challengeLabel}>Avg Accuracy</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Auth / account area */}
      <View style={styles.footer}>
        {!isSignedIn ? (
          <TouchableOpacity
            style={styles.authButton}
            onPress={onOpenAuth}
            activeOpacity={0.9}
          >
            <Text style={styles.authButtonText}>Sign in / Save Progress</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.signedInText}>Account linked ✓</Text>
            {onLogout && (
              <TouchableOpacity
                style={styles.secondaryAuthButton}
                onPress={onLogout}
                activeOpacity={0.9}
              >
                <Text style={styles.secondaryAuthButtonText}>Sign out</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.9}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  appTag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  appSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
  },

  // Cards
  cardOuter: {
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  cardInner: {
    borderRadius: 22,
    paddingTop: 58, // 40 for strip + 18 for spacing
    paddingBottom: 18,
    paddingHorizontal: 18,
    backgroundColor: "rgba(15,23,42,0.97)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    overflow: "hidden",
  },
  cardHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 40,
    opacity: 0.7,
  },
  profileStrip: {
    backgroundColor: "rgba(79,70,229,0.45)", // indigo
  },
  overviewStrip: {
    backgroundColor: "rgba(59,130,246,0.45)", // blue
  },
  achievementStrip: {
    backgroundColor: "rgba(245,158,11,0.45)", // amber
  },
  challengeStrip: {
    backgroundColor: "rgba(16,185,129,0.45)", // emerald
  },
  cardTitle: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT_MAIN,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
  },

  // Profile Section
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  levelLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  levelValue: {
    fontSize: 24,
    color: TEXT_MAIN,
    fontWeight: "800",
    marginTop: 2,
  },
  heartsPill: {
    backgroundColor: "rgba(248,113,113,0.12)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.8)",
  },
  heartsText: {
    color: "#FCA5A5",
    fontSize: 14,
    fontWeight: "700",
  },
  section: {
    marginTop: 12,
  },
  sectionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  sectionHalf: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  value: {
    fontSize: 16,
    color: TEXT_MAIN,
    fontWeight: "600",
    marginTop: 2,
  },
  progressBarOuter: {
    marginTop: 6,
    height: 10,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#7C3AED",
  },

  // Statistics
  scrollContainer: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.8)",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.4)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: TEXT_MAIN,
  },
  statLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 4,
    textAlign: "center",
  },

  // Achievement Progress
  achievementOverview: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  achievementStat: {
    alignItems: "center",
  },
  achievementValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT_MAIN,
  },
  achievementLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  rarityBreakdown: {
    marginBottom: 16,
  },
  rarityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
    marginBottom: 8,
  },
  rarityStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  rarityItem: {
    fontSize: 12,
    color: TEXT_MUTED,
    backgroundColor: "rgba(15,23,42,0.6)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  recentAchievements: {
    borderTopWidth: 1,
    borderTopColor: "rgba(148,163,255,0.3)",
    paddingTop: 16,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
    marginBottom: 12,
  },
  recentAchievement: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
  recentDesc: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },

  // Challenge Performance
  challengeStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  challengeStat: {
    alignItems: "center",
  },
  challengeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT_MAIN,
  },
  challengeLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginTop: 2,
  },

  // Footer / auth
  footer: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 24,
  },
  authButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  authButtonText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  signedInText: {
    marginTop: 4,
    color: "#22C55E",
    fontSize: 14,
    textAlign: "center",
  },
  secondaryAuthButton: {
    marginTop: 10,
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.8)",
  },
  secondaryAuthButtonText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    alignItems: "center",
  },
  backButtonText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
