// src/hooks/useStreakRewards.ts
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  STREAK_REWARDS,
  getUnclaimedStreakRewards,
  getStreakRewardForDay,
} from "../data/streakRewards";
import type { PlayerProfile } from "../types/game";
import { useToast } from "../contexts/ToastContext";

const STREAK_REWARDS_STORAGE_KEY = "@quizhub_streak_rewards";

export const useStreakRewards = (profile: PlayerProfile) => {
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // Load claimed rewards from storage
  useEffect(() => {
    const loadClaimedRewards = async () => {
      try {
        const stored = await AsyncStorage.getItem(STREAK_REWARDS_STORAGE_KEY);
        if (stored) {
          setClaimedRewards(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Failed to load streak rewards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClaimedRewards();
  }, []);

  // Save claimed rewards to storage
  const saveClaimedRewards = useCallback(
    async (newClaimedRewards: string[]) => {
      try {
        await AsyncStorage.setItem(
          STREAK_REWARDS_STORAGE_KEY,
          JSON.stringify(newClaimedRewards)
        );
        setClaimedRewards(newClaimedRewards);
      } catch (error) {
        console.error("Failed to save streak rewards:", error);
      }
    },
    []
  );

  // Get unclaimed rewards for current streak
  const unclaimedRewards = getUnclaimedStreakRewards(
    profile.dailyStreak,
    claimedRewards
  );

  // Check for new streak rewards when streak increases
  const checkForNewStreakRewards = useCallback(async () => {
    const newUnclaimed = getUnclaimedStreakRewards(
      profile.dailyStreak,
      claimedRewards
    );
    if (newUnclaimed.length > 0) {
      // Show notification for new available rewards
      const nextReward = newUnclaimed[0];
      showToast(
        `New streak reward available: ${nextReward.title}!`,
        "success",
        4000
      );
    }
  }, [profile.dailyStreak, claimedRewards, showToast]);

  // Claim a specific streak reward
  const claimStreakReward = useCallback(
    async (
      rewardId: string
    ): Promise<{
      xp: number;
      coins: number;
      bonusHearts: number;
    } | null> => {
      const reward = STREAK_REWARDS.find((r) => r.id === rewardId);
      if (!reward || claimedRewards.includes(rewardId)) {
        return null;
      }

      const newClaimedRewards = [...claimedRewards, rewardId];
      await saveClaimedRewards(newClaimedRewards);

      showToast(
        `Claimed ${reward.title}: +${reward.rewards.xp} XP, +${
          reward.rewards.coins
        } coins${
          reward.rewards.bonusHearts
            ? `, +${reward.rewards.bonusHearts} hearts`
            : ""
        }!`,
        "success",
        5000
      );

      return {
        xp: reward.rewards.xp,
        coins: reward.rewards.coins,
        bonusHearts: reward.rewards.bonusHearts || 0,
      };
    },
    [claimedRewards, saveClaimedRewards, showToast]
  );

  // Get daily login bonus for current streak
  const getDailyLoginBonus = useCallback(() => {
    return getStreakRewardForDay(profile.dailyStreak);
  }, [profile.dailyStreak]);

  // Check if a reward is claimed
  const isRewardClaimed = useCallback(
    (rewardId: string) => {
      return claimedRewards.includes(rewardId);
    },
    [claimedRewards]
  );

  return {
    claimedRewards,
    unclaimedRewards,
    isLoading,
    checkForNewStreakRewards,
    claimStreakReward,
    getDailyLoginBonus,
    isRewardClaimed,
  };
};
