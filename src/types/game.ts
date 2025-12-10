// src/types/game.ts

export type RegionId = string;
export type VenueId = string;
export type LevelId = string;
export type QuestionId = string;

export type LifelineType = "FIFTY_FIFTY" | "ASK_FRIENDS" | "ASK_QUIZZERS";
export type SessionStatus = "in_progress" | "passed" | "failed";

// ---- Content / configuration types ----

export interface AnswerOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
}

export type QuestionDifficulty =
  | "entry"
  | "easy"
  | "average"
  | "tricky"
  | "hard";

export interface Question {
  id: string;

  // We keep this but make it optional so we can move away from per-level binding
  levelId?: string;

  // NEW: global difficulty tagging for pool-based selection
  difficulty?: QuestionDifficulty;

  // NEW: category for filtering questions by theme
  category: string;

  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface LevelConfig {
  id: LevelId;
  venueId: string;
  levelNumber: number;
  type: "normal";

  // Optional / legacy – engine can ignore these now
  questionIds?: string[];
  questionPoolIds?: string[];

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

// export type TickRarity = "bronze" | "silver" | "gold" | "diamond";

// export interface TickState {
//   id: string;
//   regionId: RegionId;
//   rarity: TickRarity;
//   earnedAt: string;
// }

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
  correctCount: number;
}

export interface GameTuningConfig {
  startingLivesPerLevel: number;
  speedBonusThresholdSeconds: number;
}

export type LevelProgressStatus = "locked" | "unlocked" | "completed";

export interface PlayerProgress {
  completedLevelIds: LevelId[];
}

export interface PlayerProfile {
  xp: number;
  level: number;
  coins: number;
  bonusAskQuizzers: number;
  bonusFiftyFifty: number;
  askQuizzersOwned: number;
  fiftyFiftyOwned: number;
  extraLivesOwned: number;
  hearts: number;
  lastHeartUpdateAt?: number;
  dailyStreak: number; // 👈 new
  lastActiveAt: string | null; // ISO date string "YYYY-MM-DD" or null
  dailyChallengeProgress: DailyChallengeProgress[]; // Track completed daily challenges
  claimedStreakRewards: string[]; // Array of claimed streak reward IDs
  adsRemoved?: boolean; // Whether ads have been removed via purchase
  unlockedThemes?: string[]; // Array of unlocked theme IDs
}

export interface RewardSummary {
  xpEarned: number;
  coinsEarned: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number; // 0–1
  result: "passed" | "failed";
  bonusAskQuizzers?: number;
  bonusHearts?: number;
}

// ---- Daily Challenges ----

export type DailyChallengeType =
  | "speed_run"
  | "perfect_accuracy"
  | "streak_master"
  | "category_specialist"
  | "time_limited";

export interface DailyChallenge {
  id: string;
  type: DailyChallengeType;
  title: string;
  description: string;
  icon: string;
  difficulty: "easy" | "medium" | "hard";
  questionCount: number;
  timeLimitSeconds?: number; // For time-limited challenges
  targetAccuracy?: number; // For accuracy challenges (0-1)
  targetStreak?: number; // For streak challenges
  categoryFilter?: string; // For category specialist challenges
  rewards: {
    xp: number;
    coins: number;
    bonusHearts?: number;
  };
  questionIds: string[]; // Pre-selected questions for this challenge
}

export interface DailyChallengeProgress {
  challengeId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  failed: boolean;
  lockedUntil?: string; // ISO timestamp when challenge unlocks again
  score?: number;
  accuracy?: number;
  timeTakenSeconds?: number;
  completedAt?: string; // ISO timestamp
}

// ---- Streak Rewards ----

export interface StreakReward {
  id: string;
  streakDays: number;
  title: string;
  description: string;
  icon: string;
  rewards: {
    xp: number;
    coins: number;
    bonusHearts?: number;
  };
  claimed: boolean;
}
