// src/utils/streakUtils.ts
import type { PlayerProfile } from "../types/game";

export const getTodayDateString = (): string => {
  // ISO date "YYYY-MM-DD" in UTC; good enough for now
  return new Date().toISOString().slice(0, 10);
};

export const computeUpdatedStreak = (
  profile: PlayerProfile
): {
  newDailyStreak: number;
  newLastActiveAt: string;
} => {
  const today = getTodayDateString();
  const last = profile.lastActiveAt;

  if (!last) {
    return { newDailyStreak: 1, newLastActiveAt: today };
  }

  if (last === today) {
    return { newDailyStreak: profile.dailyStreak, newLastActiveAt: last };
  }

  const lastDate = new Date(`${last}T00:00:00Z`);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const diffMs = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return {
      newDailyStreak: profile.dailyStreak + 1,
      newLastActiveAt: today,
    };
  }

  return {
    newDailyStreak: 1,
    newLastActiveAt: today,
  };
};
