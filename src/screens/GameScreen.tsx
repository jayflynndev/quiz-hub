// src/screens/GameScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type {
  GameSession,
  LevelConfig,
  LifelineType,
  PlayerProfile,
  RewardSummary,
} from "../types/game";

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

const BACKGROUND = "#050816";
const CARD_BG = "#020617";
const HUD_BG = "#020617";
const BORDER = "#1F2937";
const ACCENT = "#8B5CF6";
const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";
const DANGER = "#DC2626";
const SUCCESS = "#16A34A";

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

  // --- Edge cases ---

  if (!question && !isFinished) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "right", "bottom", "left"]}
      >
        <View style={styles.centerFull}>
          <Text style={styles.headerText}>No question loaded</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onBackToMenu}>
            <Text style={styles.primaryButtonText}>Back to Levels</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (outOfHearts) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "right", "bottom", "left"]}
      >
        <View style={styles.centerFull}>
          <Text style={styles.headerText}>You&apos;re out of hearts 💔</Text>
          <Text style={styles.subText}>
            You need hearts to play levels. Come back later or buy more in the
            shop.
          </Text>

          <TouchableOpacity style={styles.primaryButton} onPress={onBackToMenu}>
            <Text style={styles.primaryButtonText}>Back to Levels</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, styles.shopButton]}
            onPress={onBackToMenu} // later: navigate to shop
          >
            <Text style={styles.secondaryButtonText}>Go to Shop</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Main layout ---

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "right", "bottom", "left"]}
    >
      {/* HUD */}
      <View style={styles.hud}>
        <View>
          <Text style={styles.venueText}>{venueName}</Text>
          <Text style={styles.levelText}>Level {level.levelNumber}</Text>
        </View>

        <View style={styles.hudStatsRight}>
          <Text style={styles.hudStat}>
            ❤️ {profile.hearts} · 💰 {profile.coins}
          </Text>
          <Text style={styles.hudStat}>
            Lv {profile.level} · XP {profile.xp}/{xpToNextLevel}
          </Text>
          {timeLeft !== null && (
            <Text style={styles.timerText}>⏱ {timeLeft}s</Text>
          )}
        </View>
      </View>

      {/* Progress row */}
      {!isFinished && total > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              Question {currentIndex + 1} of {total}
            </Text>
            <Text style={styles.progressScore}>Score: {session.score}</Text>
          </View>
          <View style={styles.progressBarOuter}>
            <View
              style={[
                styles.progressBarInner,
                { width: `${((currentIndex + 1) / total) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.body}>
        {/* Lifelines + poll */}
        {!isFinished && question && (
          <>
            <View style={styles.lifelineRow}>
              {lifelinesAllowed.includes("ASK_QUIZZERS") && (
                <TouchableOpacity
                  style={[
                    styles.lifelinePill,
                    (askQuizzersRemaining <= 0 ||
                      usedAskQuizzersThisQuestion) &&
                      styles.lifelineDisabled,
                  ]}
                  disabled={
                    askQuizzersRemaining <= 0 || usedAskQuizzersThisQuestion
                  }
                  onPress={onUseAskQuizzers}
                >
                  <Text style={styles.lifelineText}>
                    Ask Quizzers ({askQuizzersRemaining})
                  </Text>
                </TouchableOpacity>
              )}

              {lifelinesAllowed.includes("FIFTY_FIFTY") && (
                <TouchableOpacity
                  style={[
                    styles.lifelinePill,
                    (fiftyFiftyRemaining <= 0 || usedFiftyFiftyThisQuestion) &&
                      styles.lifelineDisabled,
                  ]}
                  disabled={
                    fiftyFiftyRemaining <= 0 || usedFiftyFiftyThisQuestion
                  }
                  onPress={onUseFiftyFifty}
                >
                  <Text style={styles.lifelineText}>
                    50/50 ({fiftyFiftyRemaining})
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {audiencePoll && (
              <View style={styles.pollCard}>
                <Text style={styles.pollTitle}>Quizzers&apos; picks</Text>
                {question.options.map((option) => (
                  <View key={option.id} style={styles.pollRow}>
                    <Text style={styles.pollOptionLabel}>{option.id}.</Text>
                    <Text style={styles.pollOptionText}>{option.text}</Text>
                    <Text style={styles.pollPercent}>
                      {audiencePoll[option.id] ?? 0}%
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Question + options */}
        {!isFinished && question && (
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{question.text}</Text>

            <View style={styles.optionsContainer}>
              {question.options
                .filter((option) => !hiddenOptions.includes(option.id))
                .map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrect =
                    !!selectedOption &&
                    option.id === question.correctOptionId &&
                    isSelected;
                  const isIncorrect =
                    !!selectedOption &&
                    isSelected &&
                    option.id !== question.correctOptionId;

                  return (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => onAnswer(option.id)}
                      style={[
                        styles.optionButton,
                        isCorrect && styles.optionCorrect,
                        isIncorrect && styles.optionIncorrect,
                        selectedOption && !isSelected && styles.optionDimmed,
                      ]}
                      disabled={!!selectedOption}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.optionLabel}>{option.id}.</Text>
                      <Text style={styles.optionText}>{option.text}</Text>
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
        )}

        {/* End-of-level summary */}
        {isFinished && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryHeading}>
              {session.status === "passed"
                ? "Level Passed ✅"
                : "Level Failed ❌"}
            </Text>
            <Text style={styles.summaryScore}>
              Final score: {session.score}
            </Text>

            {rewardSummary && (
              <View style={styles.summaryCard}>
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
                ) : (
                  <Text style={styles.summaryLine}>
                    No XP or coins this time – try again!
                  </Text>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.primaryButton} onPress={onRestart}>
              <Text style={styles.primaryButtonText}>Play Again</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryButton, styles.backButton]}
              onPress={onBackToMenu}
            >
              <Text style={styles.secondaryButtonText}>Back to Levels</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

// ---- Styles ----

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingTop: Platform.OS === "ios" ? 0 : 8,
  },

  // HUD
  hud: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: HUD_BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  venueText: {
    fontSize: 13,
    color: TEXT_MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  levelText: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  hudStatsRight: {
    alignItems: "flex-end",
  },
  hudStat: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  timerText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "600",
    color: "#FBBF24",
  },

  // Progress
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  progressScore: {
    fontSize: 13,
    color: TEXT_MAIN,
    fontWeight: "600",
  },
  progressBarOuter: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: ACCENT,
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // Lifelines & poll
  lifelineRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  lifelinePill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: ACCENT,
  },
  lifelineDisabled: {
    opacity: 0.4,
  },
  lifelineText: {
    fontSize: 12,
    color: TEXT_MAIN,
    fontWeight: "500",
  },
  pollCard: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  pollTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: TEXT_MAIN,
    marginBottom: 6,
  },
  pollRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  pollOptionLabel: {
    width: 18,
    color: TEXT_MUTED,
    fontSize: 12,
  },
  pollOptionText: {
    flex: 1,
    color: TEXT_MAIN,
    fontSize: 12,
  },
  pollPercent: {
    color: TEXT_MUTED,
    fontSize: 12,
  },

  // Question & options
  questionCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_MAIN,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 8,
  },
  optionLabel: {
    width: 22,
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_MUTED,
  },
  optionText: {
    flexShrink: 1,
    fontSize: 15,
    color: TEXT_MAIN,
  },
  optionCorrect: {
    backgroundColor: SUCCESS,
    borderColor: SUCCESS,
  },
  optionIncorrect: {
    backgroundColor: DANGER,
    borderColor: DANGER,
  },
  optionDimmed: {
    opacity: 0.5,
  },

  // Summary
  summaryContainer: {
    marginTop: 16,
  },
  summaryHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: TEXT_MAIN,
    marginBottom: 4,
  },
  summaryScore: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
    marginBottom: 16,
  },
  summaryLine: {
    fontSize: 14,
    color: TEXT_MAIN,
    marginBottom: 4,
  },

  // Generic
  centerFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: TEXT_MAIN,
    marginBottom: 8,
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: TEXT_MUTED,
    marginBottom: 16,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4B5563",
    paddingVertical: 11,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
  backButton: {
    backgroundColor: "#020617",
  },
  shopButton: {
    marginTop: 8,
    backgroundColor: "#4C1D95",
    borderColor: "#6D28D9",
  },
});
