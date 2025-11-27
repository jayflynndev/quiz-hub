// src/screens/GameScreen.tsx
import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { GameSession, LevelConfig, LifelineType } from "../types/game";

import { getCurrentQuestion } from "../engine/gameEngine";

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
  audiencePoll: Record<string, number> | null;
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
  audiencePoll,
}) => {
  const question = getCurrentQuestion(session);
  const isFinished = session.status === "passed" || session.status === "failed";

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        UK · {venueName} · Level {level.levelNumber}
      </Text>
      <Text style={styles.subHeader}>
        Score: {session.score} · Lives: {session.livesRemaining}
      </Text>

      {!isFinished && question && (
        <>
          {/* Lifeline buttons */}
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
                >
                  <Text style={styles.lifelineText}>
                    Ask Quizzers ({askQuizzersRemaining})
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
            Q{session.currentQuestionIndex + 1}. {question.text}
          </Text>

          <View style={styles.optionsContainer}>
            {question.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => onAnswer(option.id)}
                style={[
                  styles.optionButton,
                  selectedOption === option.id &&
                    option.id === question.correctOptionId &&
                    styles.correctOption,
                  selectedOption === option.id &&
                    option.id !== question.correctOptionId &&
                    styles.incorrectOption,
                  selectedOption &&
                    option.id !== selectedOption &&
                    styles.disabledOption,
                ]}
                disabled={!!selectedOption}
              >
                <Text style={styles.optionText}>
                  {option.id}. {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isFinished && (
        <View style={styles.content}>
          <Text style={styles.question}>
            Level {session.status === "passed" ? "PASSED ✅" : "FAILED ❌"}
          </Text>
          <Text style={styles.subHeader}>Final score: {session.score}</Text>

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
});
