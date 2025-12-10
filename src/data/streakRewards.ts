// src/data/streakRewards.ts
import type { StreakReward } from "../types/game";

export const STREAK_REWARDS: StreakReward[] = [
  {
    id: "streak_3",
    streakDays: 3,
    title: "Getting Started",
    description: "3-day streak achieved!",
    icon: "🌱",
    rewards: {
      xp: 25,
      coins: 15,
      bonusHearts: 1,
    },
    claimed: false,
  },
  {
    id: "streak_7",
    streakDays: 7,
    title: "Week Warrior",
    description: "7-day streak achieved!",
    icon: "⚔️",
    rewards: {
      xp: 75,
      coins: 50,
      bonusHearts: 2,
    },
    claimed: false,
  },
  {
    id: "streak_14",
    streakDays: 14,
    title: "Fortnight Fighter",
    description: "14-day streak achieved!",
    icon: "🛡️",
    rewards: {
      xp: 150,
      coins: 100,
      bonusHearts: 3,
    },
    claimed: false,
  },
  {
    id: "streak_30",
    streakDays: 30,
    title: "Monthly Master",
    description: "30-day streak achieved!",
    icon: "👑",
    rewards: {
      xp: 300,
      coins: 200,
      bonusHearts: 5,
    },
    claimed: false,
  },
  {
    id: "streak_50",
    streakDays: 50,
    title: "Golden Streak",
    description: "50-day streak achieved!",
    icon: "🥇",
    rewards: {
      xp: 500,
      coins: 350,
      bonusHearts: 7,
    },
    claimed: false,
  },
  {
    id: "streak_100",
    streakDays: 100,
    title: "Century Champion",
    description: "100-day streak achieved!",
    icon: "💎",
    rewards: {
      xp: 1000,
      coins: 750,
      bonusHearts: 10,
    },
    claimed: false,
  },
];

export const getStreakRewardForDay = (
  streakDay: number
): { xp: number; coins: number } => {
  if (streakDay <= 0) return { xp: 0, coins: 0 };

  // Base daily reward
  let baseXP = 10;
  let baseCoins = 5;

  // Bonus multipliers based on streak length
  if (streakDay >= 100) {
    baseXP *= 5;
    baseCoins *= 5;
  } else if (streakDay >= 50) {
    baseXP *= 4;
    baseCoins *= 4;
  } else if (streakDay >= 30) {
    baseXP *= 3;
    baseCoins *= 3;
  } else if (streakDay >= 14) {
    baseXP *= 2.5;
    baseCoins *= 2.5;
  } else if (streakDay >= 7) {
    baseXP *= 2;
    baseCoins *= 2;
  } else if (streakDay >= 3) {
    baseXP *= 1.5;
    baseCoins *= 1.5;
  }

  return {
    xp: Math.floor(baseXP),
    coins: Math.floor(baseCoins),
  };
};

export const getUnclaimedStreakRewards = (
  currentStreak: number,
  claimedRewards: string[]
): StreakReward[] => {
  return STREAK_REWARDS.filter(
    (reward) =>
      reward.streakDays <= currentStreak && !claimedRewards.includes(reward.id)
  );
};

export const getNextStreakReward = (
  currentStreak: number,
  claimedRewards: string[]
): StreakReward | null => {
  const unclaimed = getUnclaimedStreakRewards(currentStreak, claimedRewards);
  return unclaimed.length > 0 ? unclaimed[0] : null;
};
