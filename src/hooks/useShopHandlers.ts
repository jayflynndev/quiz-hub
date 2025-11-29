// src/hooks/useShopHandlers.ts
import * as React from "react";
import type { PlayerProfile } from "../types/game";
import { SHOP_ITEMS, ShopItemId } from "../data/shopItems";
import { MAX_HEARTS } from "./usePlayerProfile";

interface UseShopHandlersArgs {
  profile: PlayerProfile;
  saveProfile: (next: PlayerProfile) => Promise<void>;
}

interface UseShopHandlersResult {
  buyShopItem: (itemId: ShopItemId) => void;
  handleBuyAskQuizzersUpgrade: () => void;
  handleBuyFiftyFiftyUpgrade: () => void;
  handleBuyHeart: () => void;
}

export const useShopHandlers = ({
  profile,
  saveProfile,
}: UseShopHandlersArgs): UseShopHandlersResult => {
  const buyShopItem = React.useCallback(
    (itemId: ShopItemId) => {
      const item = SHOP_ITEMS[itemId];
      if (!item) return;

      // Not enough coins
      if (profile.coins < item.cost) {
        // later: show "not enough coins" toast
        return;
      }

      let next: PlayerProfile = {
        ...profile,
        coins: profile.coins - item.cost,
      };

      switch (itemId) {
        case "HEART": {
          const max = item.max ?? MAX_HEARTS;
          if (next.hearts >= max) {
            return;
          }
          next.hearts = Math.min(max, next.hearts + 1);
          break;
        }
        case "ASK_QUIZZERS": {
          next.askQuizzersOwned = next.askQuizzersOwned + 1;
          break;
        }
        case "FIFTY_FIFTY": {
          next.fiftyFiftyOwned = next.fiftyFiftyOwned + 1;
          break;
        }
      }

      void saveProfile(next);
    },
    [profile, saveProfile]
  );

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

  return {
    buyShopItem,
    handleBuyAskQuizzersUpgrade,
    handleBuyFiftyFiftyUpgrade,
    handleBuyHeart,
  };
};
