// src/data/shopItems.ts

export type ShopItemId = "HEART" | "ASK_QUIZZERS" | "FIFTY_FIFTY";

export interface ShopItem {
  id: ShopItemId;
  name: string;
  cost: number;
  max?: number; // optional, only used for hearts
}

export const SHOP_ITEMS: Record<ShopItemId, ShopItem> = {
  HEART: {
    id: "HEART",
    name: "Heart",
    cost: 50,
    max: 5,
  },
  ASK_QUIZZERS: {
    id: "ASK_QUIZZERS",
    name: "Ask Quizzers",
    cost: 40,
  },
  FIFTY_FIFTY: {
    id: "FIFTY_FIFTY",
    name: "50/50",
    cost: 60,
  },
};
