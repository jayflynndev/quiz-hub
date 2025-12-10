// src/data/shopItems.ts

export type ShopItemId =
  | "HEART"
  | "HEART_PACK_5"
  | "HEART_PACK_15"
  | "ASK_QUIZZERS"
  | "ASK_QUIZZERS_PACK_5"
  | "FIFTY_FIFTY"
  | "FIFTY_FIFTY_PACK_5"
  | "COIN_PACK_SMALL"
  | "COIN_PACK_MEDIUM"
  | "COIN_PACK_LARGE"
  | "STARTER_PACK"
  | "POWER_PACK"
  | "ULTIMATE_PACK"
  | "REMOVE_ADS"
  | "PREMIUM_THEME_GOLD"
  | "PREMIUM_THEME_NEON"
  | "PREMIUM_THEME_DARK";

export type ShopCategory =
  | "consumables"
  | "currency"
  | "bundles"
  | "premium"
  | "cosmetic";

export type PurchaseType = "consumable" | "non_consumable" | "subscription";

export interface ShopItem {
  id: ShopItemId;
  name: string;
  description: string;
  cost: number;
  category: ShopCategory;
  purchaseType: PurchaseType;
  max?: number; // optional, only used for hearts
  icon: string; // emoji icon
  popular?: boolean; // show popular badge
  discount?: number; // percentage discount (0-100)
  originalCost?: number; // shown when discounted
  rewards?: {
    hearts?: number;
    coins?: number;
    askQuizzers?: number;
    fiftyFifty?: number;
    removeAds?: boolean;
    theme?: string;
  };
  iapProductId?: string; // For future App Store/Google Play integration
}

export const SHOP_ITEMS: Record<ShopItemId, ShopItem> = {
  // Hearts
  HEART: {
    id: "HEART",
    name: "1 Heart",
    description: "Restore one heart to continue playing",
    cost: 50,
    category: "consumables",
    purchaseType: "consumable",
    max: 5,
    icon: "❤️",
    rewards: { hearts: 1 },
  },
  HEART_PACK_5: {
    id: "HEART_PACK_5",
    name: "Heart Pack (5)",
    description: "Get 5 hearts with 20% savings!",
    cost: 200,
    category: "consumables",
    purchaseType: "consumable",
    max: 5,
    icon: "❤️",
    popular: true,
    discount: 20,
    originalCost: 250,
    rewards: { hearts: 5 },
  },
  HEART_PACK_15: {
    id: "HEART_PACK_15",
    name: "Mega Heart Pack (15)",
    description: "Maximum hearts with 35% savings!",
    cost: 450,
    category: "consumables",
    purchaseType: "consumable",
    max: 5,
    icon: "❤️",
    discount: 35,
    originalCost: 750,
    rewards: { hearts: 15 },
  },

  // Lifelines
  ASK_QUIZZERS: {
    id: "ASK_QUIZZERS",
    name: "Ask Quizzers",
    description: "Reveal what the quiz crowd picked",
    cost: 50,
    category: "consumables",
    purchaseType: "consumable",
    icon: "👥",
    rewards: { askQuizzers: 1 },
  },
  ASK_QUIZZERS_PACK_5: {
    id: "ASK_QUIZZERS_PACK_5",
    name: "Ask Quizzers Pack (5)",
    description: "5 Ask Quizzers with 25% savings!",
    cost: 188,
    category: "consumables",
    purchaseType: "consumable",
    icon: "👥",
    discount: 25,
    originalCost: 250,
    rewards: { askQuizzers: 5 },
  },
  FIFTY_FIFTY: {
    id: "FIFTY_FIFTY",
    name: "50/50",
    description: "Remove two wrong answers",
    cost: 70,
    category: "consumables",
    purchaseType: "consumable",
    icon: "✨",
    rewards: { fiftyFifty: 1 },
  },
  FIFTY_FIFTY_PACK_5: {
    id: "FIFTY_FIFTY_PACK_5",
    name: "50/50 Pack (5)",
    description: "5 Fifty-Fifty with 30% savings!",
    cost: 245,
    category: "consumables",
    purchaseType: "consumable",
    icon: "✨",
    discount: 30,
    originalCost: 350,
    rewards: { fiftyFifty: 5 },
  },

  // Currency
  COIN_PACK_SMALL: {
    id: "COIN_PACK_SMALL",
    name: "Coin Pack (500)",
    description: "500 coins to spend in the shop",
    cost: 99,
    category: "currency",
    purchaseType: "consumable",
    icon: "🪙",
    rewards: { coins: 500 },
    iapProductId: "coins_500",
  },
  COIN_PACK_MEDIUM: {
    id: "COIN_PACK_MEDIUM",
    name: "Coin Pack (1200)",
    description: "1200 coins with 20% bonus!",
    cost: 199,
    category: "currency",
    purchaseType: "consumable",
    icon: "🪙",
    popular: true,
    discount: 17,
    originalCost: 240,
    rewards: { coins: 1200 },
    iapProductId: "coins_1200",
  },
  COIN_PACK_LARGE: {
    id: "COIN_PACK_LARGE",
    name: "Mega Coin Pack (3000)",
    description: "3000 coins with 35% bonus!",
    cost: 399,
    category: "currency",
    purchaseType: "consumable",
    icon: "🪙",
    discount: 35,
    originalCost: 615,
    rewards: { coins: 3000 },
    iapProductId: "coins_3000",
  },

  // Bundles
  STARTER_PACK: {
    id: "STARTER_PACK",
    name: "Starter Pack",
    description: "Perfect for new players!",
    cost: 149,
    category: "bundles",
    purchaseType: "consumable",
    icon: "🎁",
    popular: true,
    discount: 40,
    originalCost: 250,
    rewards: {
      hearts: 3,
      coins: 200,
      askQuizzers: 2,
      fiftyFifty: 2,
    },
    iapProductId: "starter_pack",
  },
  POWER_PACK: {
    id: "POWER_PACK",
    name: "Power Pack",
    description: "Everything you need to dominate!",
    cost: 299,
    category: "bundles",
    purchaseType: "consumable",
    icon: "⚡",
    discount: 45,
    originalCost: 545,
    rewards: {
      hearts: 5,
      coins: 500,
      askQuizzers: 5,
      fiftyFifty: 5,
    },
    iapProductId: "power_pack",
  },
  ULTIMATE_PACK: {
    id: "ULTIMATE_PACK",
    name: "Ultimate Pack",
    description: "The complete quiz experience!",
    cost: 499,
    category: "bundles",
    purchaseType: "consumable",
    icon: "🏆",
    discount: 50,
    originalCost: 1000,
    rewards: {
      hearts: 10,
      coins: 1000,
      askQuizzers: 10,
      fiftyFifty: 10,
    },
    iapProductId: "ultimate_pack",
  },

  // Premium Features
  REMOVE_ADS: {
    id: "REMOVE_ADS",
    name: "Remove Ads",
    description: "Enjoy an ad-free experience forever",
    cost: 299,
    category: "premium",
    purchaseType: "non_consumable",
    icon: "🚫",
    rewards: { removeAds: true },
    iapProductId: "remove_ads",
  },

  // Cosmetic Items
  PREMIUM_THEME_GOLD: {
    id: "PREMIUM_THEME_GOLD",
    name: "Golden Theme",
    description: "Luxurious gold theme for your app",
    cost: 199,
    category: "cosmetic",
    purchaseType: "non_consumable",
    icon: "🎨",
    rewards: { theme: "gold" },
    iapProductId: "theme_gold",
  },
  PREMIUM_THEME_NEON: {
    id: "PREMIUM_THEME_NEON",
    name: "Neon Glow Theme",
    description: "Vibrant neon theme with glowing effects",
    cost: 199,
    category: "cosmetic",
    purchaseType: "non_consumable",
    icon: "🎨",
    rewards: { theme: "neon" },
    iapProductId: "theme_neon",
  },
  PREMIUM_THEME_DARK: {
    id: "PREMIUM_THEME_DARK",
    name: "Dark Mode Pro",
    description: "Premium dark theme with special effects",
    cost: 149,
    category: "cosmetic",
    purchaseType: "non_consumable",
    icon: "🌙",
    rewards: { theme: "dark_pro" },
    iapProductId: "theme_dark_pro",
  },
};

export const getItemsByCategory = (category: ShopCategory): ShopItem[] => {
  return Object.values(SHOP_ITEMS).filter((item) => item.category === category);
};

export const getPopularItems = (): ShopItem[] => {
  return Object.values(SHOP_ITEMS).filter((item) => item.popular);
};
