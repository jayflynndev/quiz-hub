import * as React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import type { DailyChallenge, DailyChallengeProgress } from "../types/game";
import {
  getTodaysChallenges,
  isChallengeCompletedToday,
  isChallengeLocked,
  getChallengeLockoutMinutes,
} from "../data/dailyChallenges";

interface DailyChallengesScreenProps {
  profile: {
    dailyChallengeProgress: DailyChallengeProgress[];
  };
  onStartChallenge: (challenge: DailyChallenge) => void;
  onBack: () => void;
}

export const DailyChallengesScreen: React.FC<DailyChallengesScreenProps> = ({
  profile,
  onStartChallenge,
  onBack,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const todaysChallenges = getTodaysChallenges();
  const completedCount = todaysChallenges.filter((challenge) =>
    isChallengeCompletedToday(challenge.id, profile.dailyChallengeProgress)
  ).length;
  const totalCount = todaysChallenges.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },
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
      color: "#F9FAFB",
    },
    appSubtitle: {
      fontSize: 13,
      color: "#9CA3AF",
      marginTop: 4,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    scrollView: {
      flex: 1,
    },
    progressSection: {
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    progressCount: {
      fontSize: 16,
      color: "#9CA3FF",
      fontWeight: "600",
    },
    progressBar: {
      height: 8,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 4,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#9CA3FF",
      borderRadius: 4,
    },
    backButton: {
      position: "absolute",
      bottom: 24,
      left: 20,
      right: 20,
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
      textAlign: "center",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    challengeCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    challengeCardCompleted: {
      opacity: 0.7,
      borderColor: theme.colors.success,
      borderWidth: 2,
    },
    challengeHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    challengeIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    challengeTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      flex: 1,
    },
    completedBadge: {
      backgroundColor: theme.colors.success,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    completedText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: "600",
    },
    lockedBadge: {
      backgroundColor: theme.colors.error,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    lockedText: {
      color: theme.colors.surface,
      fontSize: 12,
      fontWeight: "600",
    },
    challengeDescription: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      lineHeight: 22,
      marginBottom: 16,
    },
    challengeStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    rewardsSection: {
      marginBottom: 16,
    },
    rewardsTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 8,
    },
    rewardsList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    rewardItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    rewardText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    difficultyBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginBottom: 12,
    },
    difficultyEasy: {
      backgroundColor: "#4CAF50",
    },
    difficultyMedium: {
      backgroundColor: "#FF9800",
    },
    difficultyHard: {
      backgroundColor: "#F44336",
    },
    difficultyText: {
      color: "white",
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return styles.difficultyEasy;
      case "medium":
        return styles.difficultyMedium;
      case "hard":
        return styles.difficultyHard;
      default:
        return styles.difficultyEasy;
    }
  };

  const renderRewardItem = (
    icon: string,
    value: string | number,
    label: string
  ) => (
    <View style={styles.rewardItem}>
      <Ionicons name={icon as any} size={16} color={theme.colors.text} />
      <Text style={styles.rewardText}>
        {value} {label}
      </Text>
    </View>
  );

  const renderChallengeCard = (challenge: DailyChallenge) => {
    const isCompleted = isChallengeCompletedToday(
      challenge.id,
      profile.dailyChallengeProgress
    );
    const isLocked = isChallengeLocked(
      challenge.id,
      profile.dailyChallengeProgress
    );
    const lockoutMinutes = getChallengeLockoutMinutes(
      challenge.id,
      profile.dailyChallengeProgress
    );

    return (
      <View
        key={challenge.id}
        style={[
          styles.challengeCard,
          isCompleted && styles.challengeCardCompleted,
        ]}
      >
        <View style={styles.challengeHeader}>
          <View style={styles.challengeIcon}>
            <Ionicons
              name={challenge.icon as any}
              size={24}
              color={theme.colors.surface}
            />
          </View>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ COMPLETED</Text>
            </View>
          )}
          {isLocked && !isCompleted && (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedText}>🔒 TRY AGAIN TOMORROW</Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.difficultyBadge,
            getDifficultyColor(challenge.difficulty),
          ]}
        >
          <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
        </View>

        <Text style={styles.challengeDescription}>{challenge.description}</Text>

        <View style={styles.challengeStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{challenge.questionCount}</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          {challenge.timeLimitSeconds && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {challenge.timeLimitSeconds}s
              </Text>
              <Text style={styles.statLabel}>Time Limit</Text>
            </View>
          )}
          {challenge.targetAccuracy && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(challenge.targetAccuracy * 100)}%
              </Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          )}
          {challenge.targetStreak && (
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{challenge.targetStreak}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          )}
        </View>

        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>Rewards</Text>
          <View style={styles.rewardsList}>
            {renderRewardItem("star", challenge.rewards.xp, "XP")}
            {renderRewardItem("cash", challenge.rewards.coins, "Coins")}
            {challenge.rewards.bonusHearts &&
              renderRewardItem(
                "heart",
                challenge.rewards.bonusHearts,
                "Hearts"
              )}
          </View>
        </View>

        <NeonButton
          label={
            isCompleted
              ? "COMPLETED"
              : isLocked
              ? "TRY AGAIN TOMORROW"
              : "START CHALLENGE"
          }
          onPress={() => {
            if (isCompleted) {
              showToast("Challenge already completed today! 🎉", "info");
            } else if (isLocked) {
              showToast(
                "Challenge failed today. Try again tomorrow! ⏰",
                "warning"
              );
            } else {
              onStartChallenge(challenge);
            }
          }}
          style={{ marginTop: 8 }}
        />
      </View>
    );
  };

  return (
    <StageScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTag}>Daily Challenges</Text>
          <Text style={styles.appTitle}>Jay&apos;s Quiz Hub</Text>
          <Text style={styles.appSubtitle}>
            Complete today's challenges to earn bonus rewards!
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Today's Progress</Text>
              <Text style={styles.progressCount}>
                {completedCount} / {totalCount} Completed
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {todaysChallenges.map(renderChallengeCard)}
          </ScrollView>
        </View>

        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Return to menu"
          accessibilityHint="Go back to the home menu"
        >
          <Text style={styles.backButtonText}>Return to Menu</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};
