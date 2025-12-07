// src/hooks/useAnswerHandlers.ts
import * as React from "react";
import {
  answerCurrentQuestion,
  getCurrentQuestion,
} from "../engine/gameEngine";
import type { GameSession, LevelConfig, LevelId } from "../types/game";
import { useToast } from "../contexts/ToastContext";

interface UseAnswerHandlersArgs {
  session: GameSession | null;
  selectedLevelId: LevelId | null;
  selectedOption: string | null;
  setSelectedOption: (value: string | null) => void;
  lastAnswerTime: number;
  questionTimeLimitSeconds: number;
  getLevelById: (id: LevelId | null) => LevelConfig | null;
  onAnswerOutcome: (updated: GameSession, level: LevelConfig) => void;
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
