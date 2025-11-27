// src/engine/gameEngine.ts
import type {
  GameSession,
  GameTuningConfig,
  LevelConfig,
  LifelineType,
  PlayerAnswer,
  Question,
  SessionStatus,
} from "../types/game";

import { QUESTIONS } from "../data/questions";

export const DEFAULT_TUNING: GameTuningConfig = {
  startingLivesPerLevel: 3,
  speedBonusThresholdSeconds: 3,
};

const findQuestionById = (id: string): Question | undefined =>
  QUESTIONS.find((q) => q.id === id);

export const createSessionForLevel = (
  level: LevelConfig,
  tuning: GameTuningConfig = DEFAULT_TUNING
): GameSession => {
  return {
    id: `session_${level.id}_${Date.now()}`,
    levelId: level.id,
    questionIds: level.questionIds,
    currentQuestionIndex: 0,
    score: 0,
    livesRemaining: tuning.startingLivesPerLevel,
    usedLifelines: [],
    answers: [],
    startedAt: Date.now(),
    status: "in_progress",
  };
};

export const getCurrentQuestion = (
  session: GameSession
): Question | undefined => {
  const questionId = session.questionIds[session.currentQuestionIndex];
  return findQuestionById(questionId);
};

export const answerCurrentQuestion = (
  session: GameSession,
  level: LevelConfig,
  chosenOptionId: string,
  timeTakenMs: number
): GameSession => {
  if (session.status !== "in_progress") return session;

  const question = getCurrentQuestion(session);
  if (!question) return session;

  const correct = chosenOptionId === question.correctOptionId;

  const answer: PlayerAnswer = {
    questionId: question.id,
    chosenOptionId,
    correct,
    timeTakenMs,
  };

  let scoreDelta = 0;
  if (correct) {
    scoreDelta += level.basePointsPerCorrect;

    const seconds = timeTakenMs / 1000;
    const threshold = DEFAULT_TUNING.speedBonusThresholdSeconds;
    if (seconds <= threshold) {
      scoreDelta += level.maxSpeedBonusPerQuestion;
    } else if (seconds <= threshold * 2) {
      const ratio = (threshold * 2 - seconds) / threshold;
      scoreDelta += Math.max(
        0,
        Math.round(level.maxSpeedBonusPerQuestion * ratio)
      );
    }
  } else {
    session.livesRemaining = Math.max(0, session.livesRemaining - 1);
  }

  const updatedAnswers = [...session.answers, answer];

  const isLastQuestion =
    session.currentQuestionIndex >= session.questionIds.length - 1;

  let status: SessionStatus = session.status;

  if (session.livesRemaining <= 0) {
    status = "failed";
  } else if (isLastQuestion) {
    const totalCorrect = updatedAnswers.filter((a) => a.correct).length;
    status = totalCorrect >= level.minCorrectToPass ? "passed" : "failed";
  }

  return {
    ...session,
    answers: updatedAnswers,
    currentQuestionIndex: isLastQuestion
      ? session.currentQuestionIndex
      : session.currentQuestionIndex + 1,
    score: session.score + scoreDelta,
    status,
    completedAt: status !== "in_progress" ? Date.now() : session.completedAt,
  };
};

export const generateAudiencePoll = (
  question: Question
): Record<string, number> => {
  const optionIds = question.options.map((o) => o.id);
  const correctId = question.correctOptionId;

  // Base correct percentage: somewhere between 50–70
  const baseCorrect = 50;
  const extra = Math.floor(Math.random() * 21); // 0–20
  const correctPercent = baseCorrect + extra; // 50–70

  let remaining = 100 - correctPercent;
  const others = optionIds.filter((id) => id !== correctId);
  const distribution: Record<string, number> = {};

  // Roughly spread the remaining percentage across the wrong answers
  others.forEach((id, index) => {
    if (index === others.length - 1) {
      distribution[id] = remaining;
    } else {
      const chunkBase = Math.floor(remaining / (others.length - index));
      const noise = Math.floor(Math.random() * 11) - 5; // -5..+5
      const value = Math.max(0, chunkBase + noise);
      distribution[id] = value;
      remaining -= value;
    }
  });

  const result: Record<string, number> = {};
  optionIds.forEach((id) => {
    if (id === correctId) {
      result[id] = correctPercent;
    } else {
      result[id] = distribution[id] ?? 0;
    }
  });

  return result;
};

export const useLifeline = (
  session: GameSession,
  level: LevelConfig,
  lifeline: LifelineType
): GameSession => {
  if (!level.lifelinesAllowed.includes(lifeline)) return session;
  if (session.usedLifelines.includes(lifeline)) return session;
  if (session.usedLifelines.length >= level.maxLifelinesPerLevel)
    return session;

  return {
    ...session,
    usedLifelines: [...session.usedLifelines, lifeline],
  };
};
