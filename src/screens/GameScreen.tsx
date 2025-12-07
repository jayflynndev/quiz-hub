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
      {/* Top scoreboard / HUD */}
      <View style={styles.hudContainer}>
        <View>
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
          <Text
            style={styles.hudMetaText}
            accessibilityLabel={`Coins: ${profile.coins}`}
          >
            Coins {profile.coins}
          </Text>
          <Text
            style={styles.hudMetaText}
            accessibilityLabel={`Hearts: ${profile.hearts}`}
          >
            Hearts {profile.hearts}
          </Text>
        </View>
        {timeLeft !== null && (
          <View
            style={styles.timerPill}
            accessibilityLabel={`Time remaining: ${timeLeft} seconds`}
          >
            <Text style={styles.timerLabel}>TIME</Text>
            <Text style={styles.timerValue}>{timeLeft}s</Text>
          </View>
        )}
      </View>

      {!isFinished && total > 0 && (
        <Text style={styles.questionProgress}>
          Question {currentIndex + 1} of {total}
        </Text>
      )}

      {/* Active question state */}
      {!isFinished && question && (
        <>
          {/* Lifelines */}
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
                  accessibilityState={{ disabled: usedAskQuizzersThisQuestion }}
                >
                  <Text style={styles.lifelineLabel}>Ask Quizzers</Text>
                  <Text style={styles.lifelineCount}>
                    x{askQuizzersRemaining}
                  </Text>
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
                  accessibilityState={{ disabled: usedFiftyFiftyThisQuestion }}
                >
                  <Text style={styles.lifelineLabel}>50 / 50</Text>
                  <Text style={styles.lifelineCount}>
                    x{fiftyFiftyRemaining}
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

          {/* Question card + options */}
          <View style={styles.questionCard}>
            <View style={styles.questionHighlightStrip} />
            <Text style={styles.questionText} accessibilityRole="text">
              Q{currentIndex + 1}. {question.text}
            </Text>
          </View>

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
                    <Text style={styles.optionText}>
                      {option.id}. {option.text}
                    </Text>
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
  venueTag: {
    fontSize: 12,
    color: "#9CA3FF",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  levelTag: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  hudStatsRow: {
    flexDirection: "row",
    gap: 8,
  },
  statPill: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
  },
  statLabel: {
    fontSize: 10,
    color: "#A5B4FC",
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  hudBottomRow: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hudInlineRow: {
    flexDirection: "row",
    gap: 12,
  },
  hudMetaText: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  timerPill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(30,64,175,0.95)",
    borderWidth: 1,
    borderColor: "#FBBF24",
  },
  timerLabel: {
    fontSize: 10,
    color: "#FBBF24",
    marginRight: 4,
    fontWeight: "700",
  },
  timerValue: {
    fontSize: 13,
    color: "#FEF9C3",
    fontWeight: "700",
  },
  questionProgress: {
    fontSize: 13,
    color: TEXT_MUTED,
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 4,
  },

  // Lifelines
  lifelineRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 8,
  },
  lifelineButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.9)",
    shadowColor: "#60A5FA",
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  lifelineButtonUsed: {
    opacity: 0.4,
    shadowOpacity: 0,
  },
  lifelineLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E0F2FE",
  },
  lifelineCount: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: "700",
    color: "#BAE6FD",
  },

  // Poll
  pollContainer: {
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  pollText: {
    color: TEXT_MUTED,
    fontSize: 12,
  },

  // Question + options
  questionCard: {
    marginTop: 14,
    marginHorizontal: 20,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
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
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  optionsContainer: {
    marginTop: 14,
    marginHorizontal: 20,
  },
  optionButton: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
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
    transform: [{ scale: 0.97 }],
  },
  optionText: {
    color: "#E5E7EB",
    fontSize: 15,
    fontWeight: "600",
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
    paddingVertical: 8,
    paddingHorizontal: 18,
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
    fontSize: 15,
    fontWeight: "800",
  },
  finishedSub: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 14,
    color: TEXT_MUTED,
  },
  finishedSubEm: {
    color: TEXT_MAIN,
    fontWeight: "700",
  },
  summaryBox: {
    marginTop: 18,
    borderRadius: 18,
    padding: 14,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
  },
  summaryLine: {
    color: TEXT_MAIN,
    fontSize: 13,
    marginBottom: 4,
  },

  // Centered edge states
  centerStateContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  centerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginBottom: 8,
    textAlign: "center",
  },
  centerSubtitle: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 16,
  },
});
