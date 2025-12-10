// src/data/achievements.ts
import { Achievement } from "../types/achievements";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    title: "First Victory",
    description: "Complete your first level",
    icon: "🏆",
    rarity: "common",
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Answer a question in under 3 seconds",
    icon: "⚡",
    rarity: "rare",
  },
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Complete a level with 100% accuracy",
    icon: "⭐",
    rarity: "epic",
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Complete 10 levels",
    icon: "🎓",
    rarity: "rare",
    target: 10,
  },
  {
    id: "streak_master",
    title: "Streak Master",
    description: "Get a 10 question streak",
    icon: "🔥",
    rarity: "epic",
    target: 10,
  },
  {
    id: "level_up",
    title: "Level Up!",
    description: "Reach player level 5",
    icon: "📈",
    rarity: "common",
    target: 5,
  },
  {
    id: "shopper",
    title: "Shopaholic",
    description: "Spend 100 coins in the shop",
    icon: "🛒",
    rarity: "common",
    target: 100,
  },
  {
    id: "survivor",
    title: "Survivor",
    description: "Complete a level with 1 heart remaining",
    icon: "❤️",
    rarity: "rare",
  },
  {
    id: "daily_warrior",
    title: "Daily Warrior",
    description: "Complete your first daily challenge",
    icon: "📅",
    rarity: "common",
  },
  {
    id: "challenge_master",
    title: "Challenge Master",
    description: "Complete 10 daily challenges",
    icon: "🏆",
    rarity: "epic",
    target: 10,
  },
  {
    id: "speed_runner",
    title: "Speed Runner",
    description: "Complete 5 speed run challenges",
    icon: "⚡",
    rarity: "rare",
    target: 5,
  },
  {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Complete 5 perfect accuracy challenges",
    icon: "⭐",
    rarity: "epic",
    target: 5,
  },
  {
    id: "streak_legend",
    title: "Streak Legend",
    description: "Get a 15 question streak",
    icon: "🔥",
    rarity: "legendary",
    target: 15,
  },
  {
    id: "lifeline_lover",
    title: "Lifeline Lover",
    description: "Use 50 lifelines total",
    icon: "❓",
    rarity: "common",
    target: 50,
  },
  {
    id: "self_made",
    title: "Self Made",
    description: "Complete a level without using any lifelines",
    icon: "🛡️",
    rarity: "rare",
  },
  {
    id: "coin_collector",
    title: "Coin Collector",
    description: "Earn 1000 coins total",
    icon: "💰",
    rarity: "rare",
    target: 1000,
  },
  {
    id: "xp_grinder",
    title: "XP Grinder",
    description: "Earn 5000 XP total",
    icon: "📈",
    rarity: "epic",
    target: 5000,
  },
  {
    id: "heart_hoarder",
    title: "Heart Hoarder",
    description: "Have 10 hearts at once",
    icon: "❤️",
    rarity: "rare",
    target: 10,
  },
  {
    id: "time_waster",
    title: "Time Waster",
    description: "Take more than 30 seconds to answer a question",
    icon: "⏰",
    rarity: "common",
  },
  {
    id: "venue_explorer",
    title: "Venue Explorer",
    description: "Complete levels in 3 different venues",
    icon: "🗺️",
    rarity: "common",
    target: 3,
  },
  {
    id: "venue_master",
    title: "Venue Master",
    description: "Complete all levels in one venue",
    icon: "🏅",
    rarity: "epic",
  },
  {
    id: "combo_king",
    title: "Combo King",
    description: "Get 3 perfect scores in a row",
    icon: "⚡",
    rarity: "rare",
    target: 3,
  },
  {
    id: "comeback_kid",
    title: "Comeback Kid",
    description: "Win a level after being wrong on the first question",
    icon: "🔄",
    rarity: "rare",
  },
  {
    id: "lucky_guess",
    title: "Lucky Guess",
    description: "Get the correct answer on your last heart",
    icon: "🎲",
    rarity: "common",
  },
  {
    id: "quiz_addict",
    title: "Quiz Addict",
    description: "Play for 7 days in a row",
    icon: "📅",
    rarity: "epic",
    target: 7,
  },
  {
    id: "millionaire",
    title: "Quiz Millionaire",
    description: "Have 5000 coins at once",
    icon: "💰",
    rarity: "legendary",
    target: 5000,
  },
  {
    id: "ultimate_player",
    title: "Ultimate Player",
    description: "Reach player level 25",
    icon: "👑",
    rarity: "legendary",
    target: 25,
  },
  {
    id: "week_warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "📅",
    rarity: "rare",
    target: 7,
  },
  {
    id: "month_master",
    title: "Month Master",
    description: "Maintain a 30-day streak",
    icon: "📅",
    rarity: "epic",
    target: 30,
  },
  {
    id: "xp_explorer",
    title: "XP Explorer",
    description: "Earn 1000 XP total",
    icon: "📈",
    rarity: "common",
    target: 1000,
  },
  {
    id: "xp_master",
    title: "XP Master",
    description: "Earn 5000 XP total",
    icon: "📈",
    rarity: "epic",
    target: 5000,
  },
  {
    id: "level_legend",
    title: "Level Legend",
    description: "Complete level 10",
    icon: "🏆",
    rarity: "rare",
    target: 10,
  },
  {
    id: "lifeline_avoider",
    title: "Lifeline Avoider",
    description: "Complete 5 levels without using lifelines",
    icon: "🛡️",
    rarity: "rare",
    target: 5,
  },
  {
    id: "wealthy_wizard",
    title: "Wealthy Wizard",
    description: "Have 5000 coins at once",
    icon: "💰",
    rarity: "legendary",
    target: 5000,
  },
  {
    id: "resilient_player",
    title: "Resilient Player",
    description: "Fail 10 levels and keep trying",
    icon: "🔄",
    rarity: "rare",
    target: 10,
  },
  {
    id: "heart_breaker",
    title: "Heart Breaker",
    description: "Lose your last heart",
    icon: "💔",
    rarity: "common",
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
};

export const getRarityColor = (rarity: Achievement["rarity"]) => {
  switch (rarity) {
    case "common":
      return "#64748B";
    case "rare":
      return "#3B82F6";
    case "epic":
      return "#8B5CF6";
    case "legendary":
      return "#F59E0B";
    default:
      return "#64748B";
  }
};
