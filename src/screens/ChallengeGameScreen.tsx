import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type {
  GameSession,
  LifelineType,
  DailyChallenge,
  PlayerAnswer,
} from "../types/game";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { useTheme } from "../contexts/ThemeContext";
import { useToast } from "../contexts/ToastContext";
import { getCurrentQuestion, useLifeline } from "../engine/gameEngine";

interface ChallengeGameScreenProps {
  session: GameSession;
  challenge: DailyChallenge;
  onAnswer: (optionId: string, timeTaken: number) => void;
  onUseLifeline: (lifelineType: LifelineType) => void;
  onTimeExpired: () => void;
  onBack: () => void;
}

export const ChallengeGameScreen: React.FC<ChallengeGameScreenProps> = ({
  session,
  challenge,
  onAnswer,
  onUseLifeline,
  onTimeExpired,
  onBack,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();

  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [timeLeft, setTimeLeft] = React.useState(
    challenge.type === "speed_run" ? challenge.timeLimitSeconds || 30 : 15
  ); // Total time for speed run, per question for others
  const [questionStartTime, setQuestionStartTime] = React.useState(Date.now());

  const currentQuestionData = getCurrentQuestion(session);
  const progress =
    (session.currentQuestionIndex + 1) / session.questionIds.length;

  // Timer effect
  React.useEffect(() => {
    if (!currentQuestionData || session.status !== "in_progress") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionData, session.status, onTimeExpired]);

  // Reset timer when question changes (only for non-speed-run challenges)
  React.useEffect(() => {
    if (challenge.type !== "speed_run") {
      setTimeLeft(15);
    }
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
  }, [session.currentQuestionIndex, challenge.type]);

  const handleAnswer = (optionId: string) => {
    if (selectedOption || !currentQuestionData) return;

    setSelectedOption(optionId);
    const timeTaken = Date.now() - questionStartTime;

    // Add a small delay for visual feedback
    setTimeout(() => {
      onAnswer(optionId, timeTaken);
    }, 500);
  };

  const handleLifeline = (lifelineType: LifelineType) => {
    if (session.usedLifelines.includes(lifelineType)) return;

    onUseLifeline(lifelineType);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
    },
    backButton: {
      position: "absolute",
      top: 40,
      left: 20,
      padding: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.3,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
      zIndex: 10,
    },
    challengeInfo: {
      alignItems: "center",
    },
    challengeTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 4,
    },
    progressText: {
      fontSize: 14,
      color: "#E5E7EB",
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.colors.surface,
      borderRadius: 2,
      marginTop: 8,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
    },
    gameArea: {
      flex: 1,
      paddingHorizontal: 20,
    },
    questionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 20,
      shadowColor: theme.colors.text,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    questionText: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      lineHeight: 24,
      marginBottom: 20,
      textAlign: "center",
    },
    optionsGrid: {
      gap: 12,
    },
    optionButton: {
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      padding: 16,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "20",
    },
    optionCorrect: {
      backgroundColor: "#16A34A",
      borderColor: "#BBF7D0",
    },
    optionIncorrect: {
      backgroundColor: "#DC2626",
      borderColor: "#FCA5A5",
    },
    optionText: {
      fontSize: 16,
      color: theme.colors.text,
      textAlign: "center",
    },
    timerContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    timerText: {
      fontSize: 24,
      fontWeight: "700",
      color: timeLeft <= 5 ? theme.colors.error : "#FFFFFF",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    statLabel: {
      fontSize: 12,
      color: "#E5E7EB",
      marginTop: 2,
    },
    lifelinesContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 16,
      marginBottom: 20,
    },
    lifelineButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    lifelineUsed: {
      opacity: 0.5,
    },
  });

  if (!currentQuestionData) {
    return (
      <StageScreen>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ color: "#FFFFFF" }}>Loading challenge...</Text>
          </View>
        </View>
      </StageScreen>
    );
  }

  return (
    <StageScreen>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <Text style={styles.progressText}>
              Question {session.currentQuestionIndex + 1} of{" "}
              {session.questionIds.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.gameArea}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{session.score}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{session.livesRemaining}</Text>
              <Text style={styles.statLabel}>Lives</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{session.correctCount}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
          </View>

          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { fontSize: 14, marginBottom: 4 }]}>
              {challenge.type === "speed_run" ? "Total Time" : "Time Left"}
            </Text>
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestionData.text}</Text>

            <View style={styles.optionsGrid}>
              {currentQuestionData.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrectOption =
                  option.id === currentQuestionData.correctOptionId;
                const hasUserAnswered = selectedOption !== null;

                // Only show highlighting after user has selected an answer
                const shouldShowCorrect = hasUserAnswered && isCorrectOption;
                const shouldShowIncorrect =
                  hasUserAnswered && isSelected && !isCorrectOption;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      shouldShowCorrect && styles.optionCorrect,
                      shouldShowIncorrect && styles.optionIncorrect,
                    ]}
                    onPress={() => handleAnswer(option.id)}
                    disabled={!!selectedOption}
                    accessibilityLabel={`Option ${option.id}: ${option.text}`}
                    accessibilityHint="Select this answer"
                  >
                    <Text style={styles.optionText}>{option.text}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.lifelinesContainer}>
            {(["FIFTY_FIFTY", "ASK_QUIZZERS"] as LifelineType[]).map(
              (lifelineType) => {
                const isUsed = session.usedLifelines.includes(lifelineType);
                const iconName =
                  lifelineType === "FIFTY_FIFTY" ? "remove-circle" : "people";

                return (
                  <TouchableOpacity
                    key={lifelineType}
                    style={[
                      styles.lifelineButton,
                      isUsed && styles.lifelineUsed,
                    ]}
                    onPress={() => handleLifeline(lifelineType)}
                    disabled={isUsed}
                    accessibilityLabel={`${lifelineType} lifeline ${
                      isUsed ? "used" : "available"
                    }`}
                  >
                    <Ionicons
                      name={iconName as any}
                      size={24}
                      color={
                        isUsed ? theme.colors.textSecondary : theme.colors.text
                      }
                    />
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </ScrollView>
      </View>
    </StageScreen>
  );
};
