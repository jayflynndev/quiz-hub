// src/types/achievements.ts
export type AchievementId =
  | "first_win"
  | "speed_demon"
  | "perfect_score"
  | "quiz_master"
  | "streak_master"
  | "level_up"
  | "shopper"
  | "survivor"
  | "daily_warrior"
  | "challenge_master"
  | "speed_runner"
  | "perfectionist"
  | "streak_legend"
  | "lifeline_lover"
  | "self_made"
  | "coin_collector"
  | "xp_grinder"
  | "heart_hoarder"
  | "time_waster"
  | "venue_explorer"
  | "venue_master"
  | "combo_king"
  | "comeback_kid"
  | "lucky_guess"
  | "quiz_addict"
  | "millionaire"
  | "ultimate_player"
  | "week_warrior"
  | "month_master"
  | "xp_explorer"
  | "xp_master"
  | "level_legend"
  | "lifeline_avoider"
  | "wealthy_wizard"
  | "resilient_player"
  | "heart_breaker";

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string; // Ionicons name
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: number; // timestamp
  progress?: number; // current progress
  target?: number; // target for progress achievements
}

export interface AchievementProgress {
  [key: string]: {
    unlocked: boolean;
    unlockedAt?: number;
    progress?: number;
  };
}
