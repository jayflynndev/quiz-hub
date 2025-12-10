// src/data/dailyChallenges.ts
import type { DailyChallenge, DailyChallengeProgress } from "../types/game";

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: "speed_run_easy",
    type: "speed_run",
    title: "Speed Run",
    description: "Answer 5 questions in under 30 seconds total",
    icon: "flash",
    difficulty: "easy",
    questionCount: 5,
    timeLimitSeconds: 30,
    rewards: {
      xp: 50,
      coins: 25,
    },
    questionIds: ["1", "2", "3", "4", "5"], // Easy questions
  },
  {
    id: "perfect_accuracy_easy",
    type: "perfect_accuracy",
    title: "Perfect Score",
    description: "Get 100% accuracy on 5 questions",
    icon: "star",
    difficulty: "easy",
    questionCount: 5,
    targetAccuracy: 1.0,
    rewards: {
      xp: 75,
      coins: 30,
    },
    questionIds: ["6", "7", "8", "9", "10"],
  },
  {
    id: "streak_master_easy",
    type: "streak_master",
    title: "Streak Master",
    description: "Get a 5 question streak",
    icon: "flame",
    difficulty: "easy",
    questionCount: 8,
    targetStreak: 5,
    rewards: {
      xp: 60,
      coins: 20,
    },
    questionIds: ["11", "12", "13", "14", "15", "16", "17", "18"],
  },
  {
    id: "speed_run_medium",
    type: "speed_run",
    title: "Lightning Round",
    description: "Answer 8 questions in under 45 seconds total",
    icon: "flash",
    difficulty: "medium",
    questionCount: 8,
    timeLimitSeconds: 45,
    rewards: {
      xp: 100,
      coins: 50,
    },
    questionIds: ["19", "20", "21", "22", "23", "24", "25", "26"],
  },
  {
    id: "perfect_accuracy_medium",
    type: "perfect_accuracy",
    title: "Flawless Victory",
    description: "Get 100% accuracy on 8 questions",
    icon: "star",
    difficulty: "medium",
    questionCount: 8,
    targetAccuracy: 1.0,
    rewards: {
      xp: 125,
      coins: 60,
    },
    questionIds: ["27", "28", "29", "30", "31", "32", "33", "34"],
  },
  {
    id: "streak_master_medium",
    type: "streak_master",
    title: "Streak Champion",
    description: "Get a 8 question streak",
    icon: "flame",
    difficulty: "medium",
    questionCount: 12,
    targetStreak: 8,
    rewards: {
      xp: 150,
      coins: 75,
    },
    questionIds: [
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
    ],
  },
  {
    id: "speed_run_hard",
    type: "speed_run",
    title: "Ultimate Speed",
    description: "Answer 10 questions in under 60 seconds total",
    icon: "flash",
    difficulty: "hard",
    questionCount: 10,
    timeLimitSeconds: 60,
    rewards: {
      xp: 200,
      coins: 100,
      bonusHearts: 1,
    },
    questionIds: ["47", "48", "49", "50", "51", "52", "53", "54", "55", "56"],
  },
  {
    id: "perfect_accuracy_hard",
    type: "perfect_accuracy",
    title: "Perfectionist",
    description: "Get 100% accuracy on 10 questions",
    icon: "star",
    difficulty: "hard",
    questionCount: 10,
    targetAccuracy: 1.0,
    rewards: {
      xp: 250,
      coins: 125,
      bonusHearts: 1,
    },
    questionIds: ["57", "58", "59", "60", "61", "62", "63", "64", "65", "66"],
  },
  {
    id: "streak_master_hard",
    type: "streak_master",
    title: "Streak Legend",
    description: "Get a 12 question streak",
    icon: "flame",
    difficulty: "hard",
    questionCount: 15,
    targetStreak: 12,
    rewards: {
      xp: 300,
      coins: 150,
      bonusHearts: 2,
    },
    questionIds: [
      "67",
      "68",
      "69",
      "70",
      "71",
      "72",
      "73",
      "74",
      "75",
      "76",
      "77",
      "78",
      "79",
      "80",
      "81",
    ],
  },
];

// Helper function to get today's challenges (rotates based on date)
export function getTodaysChallenges(): DailyChallenge[] {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // Rotate through different challenge combinations based on day
  const challengeSets = [
    [DAILY_CHALLENGES[0], DAILY_CHALLENGES[1], DAILY_CHALLENGES[2]], // Easy set
    [DAILY_CHALLENGES[3], DAILY_CHALLENGES[4], DAILY_CHALLENGES[5]], // Medium set
    [DAILY_CHALLENGES[6], DAILY_CHALLENGES[7], DAILY_CHALLENGES[8]], // Hard set
    [DAILY_CHALLENGES[0], DAILY_CHALLENGES[3], DAILY_CHALLENGES[6]], // Mixed speed
    [DAILY_CHALLENGES[1], DAILY_CHALLENGES[4], DAILY_CHALLENGES[7]], // Mixed accuracy
    [DAILY_CHALLENGES[2], DAILY_CHALLENGES[5], DAILY_CHALLENGES[8]], // Mixed streak
  ];

  const setIndex = dayOfYear % challengeSets.length;
  return challengeSets[setIndex];
}

// Helper function to check if a challenge was completed today
export function isChallengeCompletedToday(
  challengeId: string,
  progress: DailyChallengeProgress[]
): boolean {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  return progress.some(
    (p) => p.challengeId === challengeId && p.date === today && p.completed
  );
}

// Helper function to check if a challenge is currently locked
export function isChallengeLocked(
  challengeId: string,
  progress: DailyChallengeProgress[]
): boolean {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  // Find the most recent attempt for this challenge today
  const todaysAttempts = progress.filter(
    (p) => p.challengeId === challengeId && p.date === today
  );

  if (todaysAttempts.length === 0) return false;

  // Check if any recent attempt has a lockout that hasn't expired
  const now = new Date();
  return todaysAttempts.some((attempt) => {
    if (attempt.failed && attempt.lockedUntil) {
      const lockoutTime = new Date(attempt.lockedUntil);
      return lockoutTime > now;
    }
    return false;
  });
}

// Helper function to get remaining lockout time in minutes
export function getChallengeLockoutMinutes(
  challengeId: string,
  progress: DailyChallengeProgress[]
): number {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

  const todaysAttempts = progress.filter(
    (p) =>
      p.challengeId === challengeId &&
      p.date === today &&
      p.failed &&
      p.lockedUntil
  );

  if (todaysAttempts.length === 0) return 0;

  const now = new Date();
  const lockoutTime = new Date(todaysAttempts[0].lockedUntil!);
  const remainingMs = lockoutTime.getTime() - now.getTime();

  return Math.max(0, Math.ceil(remainingMs / (1000 * 60))); // Convert to minutes
}
