// src/types/game.ts

export type RegionId = string;
export type VenueId = string;
export type LevelId = string;
export type QuestionId = string;

export type LevelType = "normal" | "speed" | "boss";
export type LifelineType = "FIFTY_FIFTY" | "ASK_FRIENDS" | "ASK_QUIZZERS";
export type SessionStatus = "in_progress" | "passed" | "failed";

// ---- Content / configuration types ----

export interface AnswerOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export interface Question {
  id: QuestionId;
  levelId: LevelId;
  text: string;
  options: AnswerOption[];
  correctOptionId: string;
  timeLimitSeconds?: number;
}

export interface LevelConfig {
  id: LevelId;
  venueId: VenueId;
  levelNumber: number;
  type: LevelType;
  questionIds: QuestionId[];

  minCorrectToPass: number;

  lifelinesAllowed: LifelineType[];
  maxLifelinesPerLevel: number;

  basePointsPerCorrect: number;
  maxSpeedBonusPerQuestion: number;
}

export interface Venue {
  id: VenueId;
  regionId: RegionId;
  name: string;
  order: number;
  isBossVenue: boolean;
  description?: string;
  levelIds: LevelId[];
  baseDifficulty: number;
}

export interface Region {
  id: RegionId;
  name: string;
  order: number;
  flagEmoji: string;
}

// ---- Progress / ticks (placeholder for later) ----

export type TickRarity = "bronze" | "silver" | "gold" | "diamond";

export interface TickState {
  id: string;
  regionId: RegionId;
  rarity: TickRarity;
  earnedAt: string;
}

// ---- Runtime / session state ----

export interface PlayerAnswer {
  questionId: QuestionId;
  chosenOptionId: string;
  correct: boolean;
  timeTakenMs: number;
}

export interface GameSession {
  id: string;
  levelId: LevelId;
  questionIds: QuestionId[];
  currentQuestionIndex: number;
  score: number;
  livesRemaining: number;

  usedLifelines: LifelineType[];
  answers: PlayerAnswer[];

  startedAt: number;
  completedAt?: number;
  status: SessionStatus;
}

export interface GameTuningConfig {
  startingLivesPerLevel: number;
  speedBonusThresholdSeconds: number;
}

export type LevelProgressStatus = "locked" | "unlocked" | "completed";

export interface PlayerProgress {
  completedLevelIds: LevelId[];
}
