// src/hooks/useShopHandlers.ts
import * as React from "react";
import type { PlayerProfile } from "../types/game";
import { SHOP_ITEMS, ShopItemId } from "../data/shopItems";
import { MAX_HEARTS } from "./usePlayerProfile";
import { useToast } from "../contexts/ToastContext";
import type { AchievementId } from "../types/achievements";

interface UseShopHandlersArgs {
  profile: PlayerProfile;
  saveProfile: (next: PlayerProfile) => Promise<void>;
  checkAndUnlockAchievement?: (achievementId: AchievementId) => void;
}

interface UseShopHandlersResult {
  buyShopItem: (itemId: ShopItemId) => void;
  handleBuyAskQuizzersUpgrade: () => void;
  handleBuyFiftyFiftyUpgrade: () => void;
  handleBuyHeart: () => void;
  getPurchaseHistory: () => PurchaseRecord[];
  restorePurchases: () => Promise<void>;
}

interface PurchaseRecord {
  id: string;
  itemId: ShopItemId;
  timestamp: number;
  cost: number;
  rewards: Record<string, number | boolean | string>;
}

export const useShopHandlers = ({
  profile,
  saveProfile,
  checkAndUnlockAchievement,
}: UseShopHandlersArgs): UseShopHandlersResult => {
  const { showToast } = useToast();

  // Store purchase history (in a real app, this would be persisted)
  const [purchaseHistory, setPurchaseHistory] = React.useState<
    PurchaseRecord[]
  >([]);

  const buyShopItem = React.useCallback(
    (itemId: ShopItemId) => {
      const item = SHOP_ITEMS[itemId];
      if (!item) {
        showToast("Item not found!", "error");
        return;
      }

      // Check if enough coins (only for coin purchases)
      if (
        item.category !== "premium" &&
        item.category !== "cosmetic" &&
        profile.coins < item.cost
      ) {
        showToast("Not enough coins!", "error");
        return;
      }

      let next: PlayerProfile = { ...profile };

      // Handle different purchase types
      if (item.category === "premium" || item.category === "cosmetic") {
        // For premium/cosmetic items, this would normally go through IAP
        // For now, we'll simulate with coins
        if (profile.coins < item.cost) {
          showToast("Not enough coins!", "error");
          return;
        }
        next.coins = profile.coins - item.cost;
      } else {
        // Regular coin purchases
        next.coins = profile.coins - item.cost;
      }

      // Apply rewards
      if (item.rewards) {
        if (item.rewards.hearts) {
          const max = item.max ?? MAX_HEARTS;
          next.hearts = Math.min(max, next.hearts + item.rewards.hearts);
        }
        if (item.rewards.coins) {
          next.coins = next.coins + item.rewards.coins;
        }
        if (item.rewards.askQuizzers) {
          next.askQuizzersOwned =
            next.askQuizzersOwned + item.rewards.askQuizzers;
        }
        if (item.rewards.fiftyFifty) {
          next.fiftyFiftyOwned = next.fiftyFiftyOwned + item.rewards.fiftyFifty;
        }
        if (item.rewards.removeAds) {
          next.adsRemoved = true;
        }
        if (item.rewards.theme) {
          next.unlockedThemes = [
            ...(next.unlockedThemes || []),
            item.rewards.theme,
          ];
        }
      }

      // Special handling for legacy items
      switch (itemId) {
        case "HEART": {
          const max = item.max ?? MAX_HEARTS;
          if (next.hearts >= max) {
            showToast("Maximum hearts reached!", "warning");
            return;
          }
          break;
        }
      }

      void saveProfile(next);

      // Record purchase
      const purchaseRecord: PurchaseRecord = {
        id: `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        itemId,
        timestamp: Date.now(),
        cost: item.cost,
        rewards: item.rewards || {},
      };
      setPurchaseHistory((prev) => [...prev, purchaseRecord]);

      // Check achievements
      checkAndUnlockAchievement?.("shopper");

      // Check heart-related achievements
      if (item.rewards?.hearts) {
        const totalHearts = next.hearts;
        if (totalHearts >= 10) {
          checkAndUnlockAchievement?.("heart_hoarder");
        }
      }

      // Check lifeline-related achievements
      if (item.rewards?.askQuizzers || item.rewards?.fiftyFifty) {
        const totalLifelines = next.askQuizzersOwned + next.fiftyFiftyOwned;
        if (totalLifelines >= 50) {
          checkAndUnlockAchievement?.("lifeline_lover");
        }
      }

      // Show success toast with rewards summary
      const rewardText = getRewardText(item.rewards);
      showToast(`${item.name} purchased! ${rewardText}`, "success");
    },
    [profile, saveProfile, checkAndUnlockAchievement, showToast]
  );

  const getRewardText = (
    rewards?: Record<string, number | boolean | string>
  ): string => {
    if (!rewards) return "";

    const parts: string[] = [];
    if (rewards.hearts) parts.push(`❤️ ${rewards.hearts}`);
    if (rewards.coins) parts.push(`🪙 ${rewards.coins}`);
    if (rewards.askQuizzers) parts.push(`👥 ${rewards.askQuizzers}`);
    if (rewards.fiftyFifty) parts.push(`✨ ${rewards.fiftyFifty}`);
    if (rewards.removeAds) parts.push("🚫 Ads Removed");
    if (rewards.theme) parts.push(`🎨 ${rewards.theme} Theme`);

    return parts.join(", ");
  };

  const handleBuyAskQuizzersUpgrade = React.useCallback(
    () => buyShopItem("ASK_QUIZZERS"),
    [buyShopItem]
  );

  const handleBuyFiftyFiftyUpgrade = React.useCallback(
    () => buyShopItem("FIFTY_FIFTY"),
    [buyShopItem]
  );

  const handleBuyHeart = React.useCallback(
    () => buyShopItem("HEART"),
    [buyShopItem]
  );

  const getPurchaseHistory = React.useCallback(() => {
    return purchaseHistory;
  }, [purchaseHistory]);

  const restorePurchases = React.useCallback(async () => {
    // In a real app, this would restore purchases from App Store/Google Play
    // For now, just show a message
    showToast("Purchase restoration not available in demo mode", "info");
  }, [showToast]);

  return {
    buyShopItem,
    handleBuyAskQuizzersUpgrade,
    handleBuyFiftyFiftyUpgrade,
    handleBuyHeart,
    getPurchaseHistory,
    restorePurchases,
  };
};
