// src/hooks/useLevelOutcome.ts
import * as React from "react";
import type {
  GameSession,
  LevelConfig,
  PlayerProfile,
  PlayerProgress,
  RewardSummary,
} from "../types/game";
// MAX_HEARTS imported for later use when we implement this hook properly
import { MAX_HEARTS } from "./usePlayerProfile";

export interface UseLevelOutcomeArgs {
  profile: PlayerProfile;
  progress: PlayerProgress;
  saveProfile: (next: PlayerProfile) => Promise<void>;
  saveProgress: (next: PlayerProgress) => Promise<void>;
  computeUpdatedStreak: (profile: PlayerProfile) => {
    newDailyStreak: number;
    newLastActiveAt: string;
  };
  applyUpdatedSessionForAnswer: (updated: GameSession) => void;
  clearTimer: () => void;
}

export interface UseLevelOutcomeResult {
  applyOutcome: (
    updated: GameSession,
    level: LevelConfig,
    setLastRewardSummary: (s: RewardSummary | null) => void
  ) => void;
}

// For now, this hook is just a placeholder.
// We'll wire the real outcome logic into here later,
// but right now it does nothing to keep things compiling and stable.
export const useLevelOutcome = (
  _args: UseLevelOutcomeArgs
): UseLevelOutcomeResult => {
  const applyOutcome = React.useCallback(
    (
      _updated: GameSession,
      _level: LevelConfig,
      _setLastRewardSummary: (s: RewardSummary | null) => void
    ) => {
      // TODO: move applyAnswerOutcome logic in here later.
      // Currently App.tsx still handles all outcome logic.
    },
    []
  );

  return { applyOutcome };
};
