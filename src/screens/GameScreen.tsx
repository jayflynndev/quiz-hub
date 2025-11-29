// src/screens/GameScreen.tsx
import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

  if (!question && !isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>No question loaded</Text>
        <TouchableOpacity style={styles.optionButton} onPress={onBackToMenu}>
          <Text style={styles.optionText}>Back to Menu</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (outOfHearts) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>You're Out of Hearts 💔</Text>
        <Text style={styles.subHeader}>
          You need hearts to play levels. Come back later or buy more!
        </Text>

        <TouchableOpacity style={styles.optionButton} onPress={onBackToMenu}>
          <Text style={styles.optionText}>Back to Level Select</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, styles.shopButton]}
          onPress={() => {
            // later: navigate to ShopScreen
            onBackToMenu(); // for now
          }}
        >
          <Text style={styles.optionText}>Buy Hearts</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subHeader}>Score: {session.score}</Text>
      {timeLeft !== null && (
        <Text style={styles.timerText}>Time left: {timeLeft}s</Text>
      )}
      <Text style={styles.subHeader}>
        Lv {profile.level} · XP {profile.xp}/{xpToNextLevel} · Coins{" "}
        {profile.coins} · Hearts {profile.hearts}
      </Text>

      {!isFinished && total > 0 && (
        <Text style={styles.questionProgress}>
          Question {currentIndex + 1} of {total}
        </Text>
      )}

      {!isFinished && question && (
        <>
          {/* Lifeline buttons */}
          <View style={styles.lifelineRow}>
            {lifelinesAllowed.includes("ASK_QUIZZERS") &&
              askQuizzersRemaining > 0 && (
                <TouchableOpacity
                  style={[
                    styles.lifelineButton,
                    usedAskQuizzersThisQuestion
                      ? styles.lifelineButtonUsed
                      : null,
                  ]}
                  disabled={usedAskQuizzersThisQuestion}
                  onPress={onUseAskQuizzers}
                >
                  <Text style={styles.lifelineText}>
                    Ask Quizzers ({askQuizzersRemaining})
                  </Text>
                </TouchableOpacity>
              )}

            {lifelinesAllowed.includes("FIFTY_FIFTY") &&
              fiftyFiftyRemaining > 0 && (
                <TouchableOpacity
                  style={[
                    styles.lifelineButton,
                    usedFiftyFiftyThisQuestion
                      ? styles.lifelineButtonUsed
                      : null,
                  ]}
                  disabled={usedFiftyFiftyThisQuestion}
                  onPress={onUseFiftyFifty}
                >
                  <Text style={styles.lifelineText}>
                    50/50 ({fiftyFiftyRemaining})
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          {/* Audience poll */}
          {audiencePoll && (
            <View style={styles.pollContainer}>
              {question.options.map((option) => (
                <Text key={option.id} style={styles.pollText}>
                  {option.id}: {audiencePoll[option.id] ?? 0}%
                </Text>
              ))}
            </View>
          )}
        </>
      )}

      {!isFinished && question && (
        <View style={styles.content}>
          <Text style={styles.question}>
            Q{currentIndex + 1}. {question.text}
          </Text>

          <View style={styles.optionsContainer}>
            {question.options
              .filter((option) => !hiddenOptions.includes(option.id))
              .map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = option.id === question.correctOptionId;
                const isOtherAfterSelect =
                  !!selectedOption && option.id !== selectedOption;

                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => onAnswer(option.id)}
                    style={[
                      styles.optionButton,
                      isSelected && isCorrect ? styles.correctOption : null,
                      isSelected && !isCorrect ? styles.incorrectOption : null,
                      isOtherAfterSelect ? styles.disabledOption : null,
                    ]}
                    disabled={!!selectedOption}
                  >
                    <Text style={styles.optionText}>
                      {option.id}. {option.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      )}

      {isFinished && (
        <View style={styles.content}>
          <Text style={styles.question}>
            Level {session.status === "passed" ? "PASSED ✅" : "FAILED ❌"}
          </Text>
          <Text style={styles.subHeader}>Final score: {session.score}</Text>

          {rewardSummary && session.status === "passed" && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.subHeader}>
                XP Earned: {rewardSummary.xpEarned}
              </Text>
              <Text style={styles.subHeader}>
                Coins Earned (incl. bonuses): {rewardSummary.coinsEarned}
              </Text>
              <Text style={styles.subHeader}>
                Accuracy: {(rewardSummary.accuracy * 100).toFixed(0)}%
              </Text>

              {(rewardSummary.bonusAskQuizzers ?? 0) > 0 && (
                <Text style={styles.subHeader}>
                  Bonus Ask Quizzers: +{rewardSummary.bonusAskQuizzers}
                </Text>
              )}

              {(rewardSummary.bonusHearts ?? 0) > 0 && (
                <Text style={styles.subHeader}>
                  Bonus Hearts: +{rewardSummary.bonusHearts}
                </Text>
              )}
            </View>
          )}

          {rewardSummary && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                You answered {rewardSummary.totalCorrect} of{" "}
                {rewardSummary.totalQuestions} correctly (
                {Math.round(rewardSummary.accuracy * 100)}%).
              </Text>

              {rewardSummary.result === "passed" ? (
                <>
                  <Text style={styles.summaryText}>
                    XP gained: {rewardSummary.xpEarned}
                  </Text>
                  <Text style={styles.summaryText}>
                    Coins gained: {rewardSummary.coinsEarned}
                  </Text>
                </>
              ) : (
                <Text style={styles.summaryText}>
                  No XP or coins this time – try again!
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity style={styles.optionButton} onPress={onRestart}>
            <Text style={styles.optionText}>Play Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.backButton]}
            onPress={onBackToMenu}
          >
            <Text style={styles.optionText}>Back to Levels</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  content: {
    marginTop: 24,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 16,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    color: "#E5E7EB",
    fontSize: 16,
  },
  correctOption: {
    backgroundColor: "#16A34A",
  },
  incorrectOption: {
    backgroundColor: "#DC2626",
  },
  disabledOption: {
    opacity: 0.6,
  },
  backButton: {
    marginTop: 8,
    backgroundColor: "#374151",
  },
  lifelineRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  lifelineButton: {
    backgroundColor: "#4B5563",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginRight: 8,
  },
  lifelineButtonUsed: {
    opacity: 0.4,
  },
  lifelineText: {
    color: "#E5E7EB",
    fontSize: 12,
    fontWeight: "500",
  },
  pollContainer: {
    marginBottom: 8,
  },
  pollText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  timerText: {
    fontSize: 14,
    color: "#FBBF24", // amber-ish; tweak later with styling pass
    marginBottom: 8,
  },
  questionProgress: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
    marginBottom: 4,
  },
  shopButton: {
    marginTop: 8,
    backgroundColor: "#9333EA", // purple CTA (adjust later)
  },
  summaryBox: {
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
  },
  summaryText: {
    color: "#E5E7EB",
    fontSize: 14,
    marginBottom: 4,
  },
});
