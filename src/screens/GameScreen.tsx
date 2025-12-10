// src/screens/GameScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
  GameSession,
  LevelConfig,
  LifelineType,
  PlayerProfile,
  RewardSummary,
} from "../types/game";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { getCurrentQuestion, getQuestionProgress } from "../engine/gameEngine";

interface GameScreenProps {
  session: GameSession;
  level: LevelConfig;
  venueName: string;
  selectedOption: string | null;
  onAnswer: (optionId: string) => void;
  onRestart: () => void;
  onBackToMenu: () => void;
  lifelinesAllowed: LifelineType[];
  askQuizzersRemaining: number;
  usedAskQuizzersThisQuestion: boolean;
  onUseAskQuizzers: () => void;
  fiftyFiftyRemaining: number;
  usedFiftyFiftyThisQuestion: boolean;
  onUseFiftyFifty: () => void;
  hiddenOptions: string[];
  audiencePoll: Record<string, number> | null;
  timeLeft: number | null;
  profile: PlayerProfile;
  xpToNextLevel: number;
  rewardSummary?: RewardSummary | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  session,
  level,
  venueName,
  selectedOption,
  onAnswer,
  onRestart,
  onBackToMenu,
  lifelinesAllowed,
  askQuizzersRemaining,
  usedAskQuizzersThisQuestion,
  onUseAskQuizzers,
  fiftyFiftyRemaining,
  usedFiftyFiftyThisQuestion,
  onUseFiftyFifty,
  hiddenOptions,
  audiencePoll,
  timeLeft,
  profile,
  xpToNextLevel,
  rewardSummary,
}) => {
  const question = getCurrentQuestion(session);
  const isFinished = session.status === "passed" || session.status === "failed";
  const outOfHearts = !isFinished && session.livesRemaining <= 0;
  const { currentIndex, total } = getQuestionProgress(session);

  // ---- Edge: no question but not finished ----
  if (!question && !isFinished) {
    return (
      <StageScreen>
        <View style={styles.centerStateContainer}>
          <Text style={styles.centerTitle}>No question loaded</Text>
          <NeonButton
            label="Back to Menu"
            onPress={onBackToMenu}
            icon={<Ionicons name="home" size={16} color="#ECFDF5" />}
            style={{ alignSelf: "center", marginTop: 16 }}
          />
        </View>
      </StageScreen>
    );
  }

  // ---- Out of hearts (in-level) ----
  if (outOfHearts) {
    return (
      <StageScreen>
        <View style={styles.centerStateContainer}>
          <Text style={styles.centerTitle}>You&apos;re Out of Hearts 💔</Text>
          <Text style={styles.centerSubtitle}>
            You need hearts to play levels. Come back later or buy more!
          </Text>

          <NeonButton
            label="Back to Level Select"
            onPress={onBackToMenu}
            style={{ alignSelf: "center", marginTop: 16 }}
          />

          <NeonButton
            label="Buy Hearts"
            onPress={() => {
              // later: navigate to ShopScreen
              onBackToMenu(); // for now
            }}
            variant="purple"
            style={{ alignSelf: "center", marginTop: 10 }}
          />
        </View>
      </StageScreen>
    );
  }

  const isPassed = session.status === "passed";

  return (
    <StageScreen>
      {/* Enhanced Top HUD */}
      <View style={styles.hudContainer}>
        <View style={styles.venueInfo}>
          <Text style={styles.venueTag}>{venueName}</Text>
          <Text style={styles.levelTag}>Level {level.levelNumber}</Text>
        </View>

        <View style={styles.hudStatsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{session.score}</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>Lv {profile.level}</Text>
            <Text style={styles.statValue}>
              {profile.xp}/{xpToNextLevel} XP
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.hudBottomRow}>
        <View style={styles.hudInlineRow}>
          <Text style={styles.hudMetaText}>💰 {profile.coins}</Text>
          <Text style={styles.hudMetaText}>❤️ {profile.hearts}</Text>
        </View>
        {timeLeft !== null && (
          <View style={styles.timerPill}>
            <Text style={styles.timerLabel}>⏱️</Text>
            <Text style={styles.timerValue}>{timeLeft}s</Text>
          </View>
        )}
      </View>

      {!isFinished && total > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.questionProgress}>
            Question {currentIndex + 1} of {total}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / total) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Active question state */}
      {!isFinished && question && (
        <>
          {/* Enhanced Lifelines */}
          <View style={styles.lifelinesCard}>
            <View style={styles.lifelinesHeader}>
              <Text style={styles.lifelinesTitle}>🛡️ Lifelines</Text>
            </View>
            <View style={styles.lifelineRow}>
              {lifelinesAllowed.includes("ASK_QUIZZERS") &&
                askQuizzersRemaining > 0 && (
                  <TouchableOpacity
                    style={[
                      styles.lifelineButton,
                      usedAskQuizzersThisQuestion && styles.lifelineButtonUsed,
                    ]}
                    disabled={usedAskQuizzersThisQuestion}
                    onPress={onUseAskQuizzers}
                    activeOpacity={0.85}
                    accessibilityLabel={`Ask Quizzers lifeline, ${askQuizzersRemaining} remaining`}
                    accessibilityHint="Get help from virtual quizzers to eliminate wrong answers"
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: usedAskQuizzersThisQuestion,
                    }}
                  >
                    <Text style={styles.lifelineIcon}>👥</Text>
                    <View style={styles.lifelineTextContainer}>
                      <Text style={styles.lifelineLabel}>Ask Quizzers</Text>
                      <Text style={styles.lifelineCount}>
                        x{askQuizzersRemaining}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

              {lifelinesAllowed.includes("FIFTY_FIFTY") &&
                fiftyFiftyRemaining > 0 && (
                  <TouchableOpacity
                    style={[
                      styles.lifelineButton,
                      usedFiftyFiftyThisQuestion && styles.lifelineButtonUsed,
                    ]}
                    disabled={usedFiftyFiftyThisQuestion}
                    onPress={onUseFiftyFifty}
                    activeOpacity={0.85}
                    accessibilityLabel={`Fifty fifty lifeline, ${fiftyFiftyRemaining} remaining`}
                    accessibilityHint="Remove two incorrect answers, leaving two options"
                    accessibilityRole="button"
                    accessibilityState={{
                      disabled: usedFiftyFiftyThisQuestion,
                    }}
                  >
                    <Text style={styles.lifelineIcon}>🎯</Text>
                    <View style={styles.lifelineTextContainer}>
                      <Text style={styles.lifelineLabel}>50/50</Text>
                      <Text style={styles.lifelineCount}>
                        x{fiftyFiftyRemaining}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
            </View>
          </View>

          {/* Enhanced Audience Poll */}
          {audiencePoll && (
            <View style={styles.pollCard}>
              <View style={styles.pollHeader}>
                <Text style={styles.pollTitle}>📊 Audience Poll Results</Text>
              </View>
              <View style={styles.pollResults}>
                {question.options.map((option) => {
                  const percentage = audiencePoll[option.id] ?? 0;
                  return (
                    <View key={option.id} style={styles.pollItem}>
                      <Text style={styles.pollOptionText}>{option.id}.</Text>
                      <View style={styles.pollBarContainer}>
                        <View
                          style={[styles.pollBar, { width: `${percentage}%` }]}
                        />
                      </View>
                      <Text style={styles.pollPercentage}>{percentage}%</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Enhanced Question Card */}
          <View style={styles.questionCard}>
            <View style={styles.questionHighlightStrip} />
            <Text style={styles.questionText}>{question.text}</Text>
          </View>

          {/* Enhanced Options */}
          <View style={styles.optionsContainer}>
            {question.options
              .filter((option) => !hiddenOptions.includes(option.id))
              .map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.id === question.correctOptionId;
                const isOtherAfterSelect =
                  !!selectedOption && option.id !== selectedOption;

                const disabled = !!selectedOption;

                return (
                  <Pressable
                    key={option.id}
                    onPress={() => onAnswer(option.id)}
                    disabled={disabled}
                    style={({ pressed }) => [
                      styles.optionButton,
                      isSelected && isCorrect && styles.correctOption,
                      isSelected && !isCorrect && styles.incorrectOption,
                      isOtherAfterSelect && styles.disabledOption,
                      pressed && !disabled && styles.optionButtonPressed,
                    ]}
                    accessibilityLabel={`Option ${option.id}: ${option.text}`}
                    accessibilityHint={
                      disabled
                        ? "Answer already selected"
                        : "Select this answer option"
                    }
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                      disabled: disabled,
                    }}
                  >
                    <Text style={styles.optionLetter}>{option.id}.</Text>
                    <Text style={styles.optionText}>{option.text}</Text>
                  </Pressable>
                );
              })}
          </View>
        </>
      )}

      {/* Finished state */}
      {isFinished && (
        <View style={styles.finishedContainer}>
          <View style={styles.resultBanner}>
            <Text style={styles.resultBannerText}>
              {isPassed ? "LEVEL PASSED ✅" : "LEVEL FAILED ❌"}
            </Text>
          </View>

          <Text style={styles.finishedSub}>
            Final score:{" "}
            <Text style={styles.finishedSubEm}>{session.score}</Text>
          </Text>

          {rewardSummary && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLine}>
                You answered {rewardSummary.totalCorrect} of{" "}
                {rewardSummary.totalQuestions} correctly (
                {Math.round(rewardSummary.accuracy * 100)}%).
              </Text>

              {rewardSummary.result === "passed" ? (
                <>
                  <Text style={styles.summaryLine}>
                    XP gained: {rewardSummary.xpEarned}
                  </Text>
                  <Text style={styles.summaryLine}>
                    Coins gained: {rewardSummary.coinsEarned}
                  </Text>
                </>
              ) : (
                <Text style={styles.summaryLine}>
                  No XP or coins this time – try again!
                </Text>
              )}

              {rewardSummary.result === "passed" && (
                <>
                  {(rewardSummary.bonusAskQuizzers ?? 0) > 0 && (
                    <Text style={styles.summaryLine}>
                      Bonus Ask Quizzers: +{rewardSummary.bonusAskQuizzers}
                    </Text>
                  )}
                  {(rewardSummary.bonusHearts ?? 0) > 0 && (
                    <Text style={styles.summaryLine}>
                      Bonus Hearts: +{rewardSummary.bonusHearts}
                    </Text>
                  )}
                </>
              )}
            </View>
          )}

          <NeonButton
            label="Play Again"
            onPress={onRestart}
            icon={<Ionicons name="refresh" size={16} color="#ECFDF5" />}
            style={{ marginTop: 18, alignSelf: "center" }}
          />

          <NeonButton
            label="Back to Levels"
            onPress={onBackToMenu}
            icon={<Ionicons name="list" size={16} color="#ECFDF5" />}
            variant="purple"
            style={{ marginTop: 10, alignSelf: "center" }}
          />
        </View>
      )}
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  // Shared layout
  hudContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  venueInfo: {
    flex: 1,
  },
  venueTag: {
    fontSize: 14,
    color: "#9CA3FF",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  levelTag: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginTop: 2,
  },
  hudStatsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statPill: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
  },
  statLabel: {
    fontSize: 11,
    color: "#A5B4FC",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  hudBottomRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  hudInlineRow: {
    flexDirection: "row",
    gap: 16,
  },
  hudMetaText: {
    fontSize: 14,
    color: TEXT_MUTED,
    fontWeight: "600",
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(30,64,175,0.95)",
    borderWidth: 1,
    borderColor: "#FBBF24",
  },
  timerLabel: {
    fontSize: 14,
    color: "#FBBF24",
    marginRight: 6,
  },
  timerValue: {
    fontSize: 16,
    color: "#FEF9C3",
    fontWeight: "700",
  },

  // Progress indicator
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  questionProgress: {
    fontSize: 15,
    color: TEXT_MUTED,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(75,85,99,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#60A5FA",
    borderRadius: 2,
  },

  // Lifelines Card
  lifelinesCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  lifelinesHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  lifelinesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  lifelineRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  lifelineButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(59,130,246,0.1)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.8)",
    shadowColor: "#60A5FA",
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  lifelineButtonUsed: {
    opacity: 0.4,
    shadowOpacity: 0,
    borderColor: "rgba(156,163,175,0.5)",
  },
  lifelineIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  lifelineTextContainer: {
    flex: 1,
  },
  lifelineLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#E0F2FE",
  },
  lifelineCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#BAE6FD",
    marginTop: 1,
  },

  // Poll Card
  pollCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  pollHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pollTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  pollResults: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  pollItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pollOptionText: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_MAIN,
    minWidth: 20,
  },
  pollBarContainer: {
    flex: 1,
    height: 20,
    backgroundColor: "rgba(75,85,99,0.3)",
    borderRadius: 10,
    overflow: "hidden",
  },
  pollBar: {
    height: "100%",
    backgroundColor: "#F59E0B",
    borderRadius: 10,
  },
  pollPercentage: {
    fontSize: 14,
    fontWeight: "700",
    color: TEXT_MAIN,
    minWidth: 35,
    textAlign: "right",
  },

  // Question + options
  questionCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: "rgba(15,23,42,0.98)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    overflow: "hidden",
  },
  questionHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 40,
    backgroundColor: "rgba(79,70,229,0.5)",
    opacity: 0.6,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_MAIN,
    lineHeight: 24,
  },
  optionsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  optionButtonPressed: {
    transform: [{ scale: 0.98 }],
  },
  optionLetter: {
    fontSize: 18,
    fontWeight: "800",
    color: "#60A5FA",
    marginRight: 12,
    minWidth: 24,
  },
  optionText: {
    flex: 1,
    color: "#E5E7EB",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  correctOption: {
    backgroundColor: "#16A34A",
    borderColor: "#BBF7D0",
    shadowColor: "#16A34A",
    shadowOpacity: 0.9,
  },
  incorrectOption: {
    backgroundColor: "#DC2626",
    borderColor: "#FCA5A5",
    shadowColor: "#DC2626",
    shadowOpacity: 0.9,
  },
  disabledOption: {
    opacity: 0.5,
    shadowOpacity: 0.2,
  },

  // Finished state
  finishedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  resultBanner: {
    alignSelf: "center",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  resultBannerText: {
    color: TEXT_MAIN,
    fontSize: 18,
    fontWeight: "800",
  },
  finishedSub: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 16,
    color: TEXT_MUTED,
    fontWeight: "600",
  },
  finishedSubEm: {
    color: TEXT_MAIN,
    fontWeight: "700",
  },
  summaryBox: {
    marginTop: 20,
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
  },
  summaryLine: {
    color: TEXT_MAIN,
    fontSize: 15,
    marginBottom: 6,
    lineHeight: 20,
  },

  // Centered edge states
  centerStateContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  centerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginBottom: 8,
    textAlign: "center",
  },
  centerSubtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 16,
  },
});
