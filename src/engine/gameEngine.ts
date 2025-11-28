// src/engine/gameEngine.ts
import type {
  GameSession,
  GameTuningConfig,
  LevelConfig,
  LifelineType,
  PlayerAnswer,
  Question,
  SessionStatus,
  QuestionDifficulty,
} from "../types/game";

import { QUESTIONS } from "../data/questions";

export const DEFAULT_TUNING: GameTuningConfig = {
  startingLivesPerLevel: 3,
  speedBonusThresholdSeconds: 3,
};

const findQuestionById = (id: string): Question | undefined =>
  QUESTIONS.find((q) => q.id === id);

const getLevelDifficulty = (levelNumber: number): QuestionDifficulty => {
  if (levelNumber <= 2) return "entry";
  if (levelNumber <= 4) return "easy";
  if (levelNumber <= 6) return "average";
  if (levelNumber <= 8) return "tricky";
  return "hard";
};

const getQuestionsPerRunForLevel = (levelNumber: number): number => {
  if (levelNumber <= 4) return 5;
  if (levelNumber <= 7) return 6;
  return 7;
};

export const createSessionForLevel = (
  level: LevelConfig,
  tuning: GameTuningConfig = DEFAULT_TUNING
): GameSession => {
  const questionsPerRun = getQuestionsPerRunForLevel(level.levelNumber);
  let questionIds: string[] = [];

  // 1) Try difficulty-based global pool
  const difficulty = getLevelDifficulty(level.levelNumber);
  const poolByDifficulty = QUESTIONS.filter(
    (q) => q.difficulty === difficulty
  ).map((q) => q.id);

  const desiredCount = getQuestionsPerRunForLevel(level.levelNumber);

  if (poolByDifficulty.length >= desiredCount) {
    questionIds = pickRandomQuestionIds(poolByDifficulty, desiredCount);
  } else {
    // 2) Fallback: explicit pool if defined
    if (level.questionPoolIds && level.questionPoolIds.length > 0) {
      questionIds = pickRandomQuestionIds(
        level.questionPoolIds,
        questionsPerRun
      );
    }
    // 3) Fallback: explicit questionIds if defined
    else if (level.questionIds && level.questionIds.length > 0) {
      questionIds = [...level.questionIds];
    }
    // 4) Fallback: per-level binding by levelId
    else {
      const poolByLevelId = QUESTIONS.filter((q) => q.levelId === level.id).map(
        (q) => q.id
      );

      if (poolByLevelId.length > 0) {
        const count = Math.min(desiredCount, poolByLevelId.length);
        questionIds = pickRandomQuestionIds(poolByLevelId, count);
      } else {
        console.warn(`No questions found for level ${level.id}`);
        questionIds = [];
      }
    }
  }

  return {
    id: `session_${level.id}_${Date.now()}`,
    levelId: level.id,
    questionIds,
    currentQuestionIndex: 0,
    score: 0,
    livesRemaining: tuning.startingLivesPerLevel,
    usedLifelines: [],
    answers: [],
    startedAt: Date.now(),
    status: "in_progress",
    correctCount: 0,
  };
};

export const getCurrentQuestion = (
  session: GameSession
): Question | undefined => {
  const questionId = session.questionIds[session.currentQuestionIndex];
  return findQuestionById(questionId);
};

// ✅ NEW: safe helper for Question X of Y
export const getQuestionProgress = (
  session: GameSession | null | undefined
): { currentIndex: number; total: number } => {
  if (!session || !session.questionIds || session.questionIds.length === 0) {
    return {
      currentIndex: 0,
      total: 0,
    };
  }

  const total = session.questionIds.length;

  // Clamp index defensively
  const currentIndex =
    session.currentQuestionIndex < 0
      ? 0
      : session.currentQuestionIndex >= total
      ? total - 1
      : session.currentQuestionIndex;

  return { currentIndex, total };
};

const pickRandomQuestionIds = (pool: string[], count: number): string[] => {
  if (pool.length <= count) {
    // Not enough to sample uniquely, just shuffle + return
    return [...pool].sort(() => Math.random() - 0.5);
  }

  const indices = [...pool].map((_, idx) => idx);
  // Fisher–Yates-ish partial shuffle for first `count`
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const chosen = indices.slice(0, count);
  return chosen.map((idx) => pool[idx]);
};

export const getLifelinesForLevel = (level: LevelConfig): LifelineType[] => {
  // Default: all current lifelines on
  return level.lifelinesAllowed && level.lifelinesAllowed.length > 0
    ? level.lifelinesAllowed
    : ["ASK_QUIZZERS", "FIFTY_FIFTY"];
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
    // Old in-level lives mechanic is no longer used.
    // Wrong answers just don't give points; pass/fail is decided at the end
    // based on total correct vs level.minCorrectToPass.
  }

  const updatedAnswers = [...session.answers, answer];

  const isLastQuestion =
    session.currentQuestionIndex >= session.questionIds.length - 1;

  let status: SessionStatus = session.status;

  if (isLastQuestion) {
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
