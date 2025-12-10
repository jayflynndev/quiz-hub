// src/hooks/useAnswerHandlers.ts
import * as React from "react";
import {
  answerCurrentQuestion,
  getCurrentQuestion,
} from "../engine/gameEngine";
import type { GameSession, LevelConfig, LevelId } from "../types/game";
import { useToast } from "../contexts/ToastContext";
import type { AchievementId } from "../types/achievements";

interface UseAnswerHandlersArgs {
  session: GameSession | null;
  selectedLevelId: LevelId | null;
  selectedOption: string | null;
  setSelectedOption: (value: string | null) => void;
  lastAnswerTime: number;
  questionTimeLimitSeconds: number;
  getLevelById: (id: LevelId | null) => LevelConfig | null;
  onAnswerOutcome: (updated: GameSession, level: LevelConfig) => void;
  checkAndUnlockAchievement?: (achievementId: AchievementId, progress?: number) => void;
  profileHearts?: number;
}

interface UseAnswerHandlersResult {
  handleAnswer: (optionId: string) => void;
  handleTimeExpired: () => void;
}

export const useAnswerHandlers = (
  args: UseAnswerHandlersArgs
): UseAnswerHandlersResult => {
  const { showToast } = useToast();
  const {
    session,
    selectedLevelId,
    selectedOption,
    setSelectedOption,
    lastAnswerTime,
    questionTimeLimitSeconds,
    getLevelById,
    onAnswerOutcome,
    checkAndUnlockAchievement,
    profileHearts,
  } = args;

  const handleAnswer = React.useCallback(
    (optionId: string) => {
      if (selectedOption) return;
      if (!session || !selectedLevelId) return;

      const level = getLevelById(selectedLevelId);
      if (!level) return;

      setSelectedOption(optionId);

      const updated = answerCurrentQuestion(
        session,
        level,
        optionId,
        lastAnswerTime
      );

      // Check time_waster achievement (took more than 30 seconds)
      if (lastAnswerTime > 30000) {
        checkAndUnlockAchievement?.("time_waster");
      }

      // Check lucky_guess achievement (correct answer on last heart)
      if (profileHearts === 1 && updated.answers[updated.answers.length - 1]?.correct) {
        checkAndUnlockAchievement?.("lucky_guess");
      }

      // Preserve the slight delay for UI feedback
      setTimeout(() => {
        onAnswerOutcome(updated, level);
      }, 800);
    },
    [
      selectedOption,
      session,
      selectedLevelId,
      getLevelById,
      lastAnswerTime,
      onAnswerOutcome,
      setSelectedOption,
    ]
  );

  const handleTimeExpired = React.useCallback(() => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    const question = getCurrentQuestion(session);
    if (!question) return;

    const wrongOption = question.options.find(
      (o) => o.id !== question.correctOptionId
    );
    if (!wrongOption) return;

    const updated = answerCurrentQuestion(
      session,
      level,
      wrongOption.id,
      questionTimeLimitSeconds * 1000
    );

    onAnswerOutcome(updated, level);
  }, [
    session,
    selectedLevelId,
    getLevelById,
    questionTimeLimitSeconds,
    onAnswerOutcome,
  ]);

  return {
    handleAnswer,
    handleTimeExpired,
  };
};
