// src/contexts/AchievementContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Achievement,
  AchievementId,
  AchievementProgress,
} from "../types/achievements";
import { ACHIEVEMENTS } from "../data/achievements";
import { useToast } from "./ToastContext";

interface AchievementContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  checkAndUnlockAchievement: (
    achievementId: AchievementId,
    progress?: number
  ) => void;
  getAchievementProgress: (achievementId: AchievementId) => number;
  resetAchievements: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined
);

const ACHIEVEMENT_STORAGE_KEY = "@quizhub_achievements";

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within an AchievementProvider"
    );
  }
  return context;
};

interface AchievementProviderProps {
  children: React.ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({
  children,
}) => {
  const [achievementProgress, setAchievementProgress] =
    useState<AchievementProgress>({});
  const { showToast } = useToast();

  // Load achievements from storage on mount
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const stored = await AsyncStorage.getItem(ACHIEVEMENT_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setAchievementProgress(parsed);
        }
      } catch (error) {
        console.error("Failed to load achievements:", error);
      }
    };
    loadAchievements();
  }, []);

  // Save achievements to storage whenever they change
  useEffect(() => {
    const saveAchievements = async () => {
      try {
        await AsyncStorage.setItem(
          ACHIEVEMENT_STORAGE_KEY,
          JSON.stringify(achievementProgress)
        );
      } catch (error) {
        console.error("Failed to save achievements:", error);
      }
    };
    saveAchievements();
  }, [achievementProgress]);

  const checkAndUnlockAchievement = useCallback(
    (achievementId: AchievementId, progress: number = 1) => {
      const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (!achievement) return;

      const currentProgress = achievementProgress[achievementId] || {
        unlocked: false,
        progress: 0,
      };

      // Check if already unlocked using unlockedAt (more reliable)
      if (achievementProgress[achievementId]?.unlockedAt) return;

      let shouldUnlock = false;
      let newProgress = Math.max(currentProgress.progress || 0, progress);

      if (achievement.target) {
        // Progress-based achievement
        if (newProgress >= achievement.target) {
          shouldUnlock = true;
          newProgress = achievement.target;
        }
      } else {
        // Simple achievement
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        setAchievementProgress((prev) => ({
          ...prev,
          [achievementId]: {
            unlocked: true,
            unlockedAt: Date.now(),
            progress: newProgress,
          },
        }));

        // Show achievement unlocked toast
        showToast(`🏆 ${achievement.title} unlocked!`, "success", 4000);
      } else if (achievement.target) {
        // Update progress without unlocking
        setAchievementProgress((prev) => ({
          ...prev,
          [achievementId]: {
            unlocked: false,
            progress: newProgress,
          },
        }));
      }
    },
    [showToast]
  );

  const getAchievementProgress = useCallback(
    (achievementId: AchievementId): number => {
      return achievementProgress[achievementId]?.progress || 0;
    },
    [achievementProgress]
  );

  const resetAchievements = useCallback(() => {
    setAchievementProgress({});
  }, []);

  // Combine achievements with progress data
  const achievements = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlockedAt: achievementProgress[achievement.id]?.unlockedAt,
    progress: achievementProgress[achievement.id]?.progress || 0,
  }));

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockedAchievements,
        checkAndUnlockAchievement,
        getAchievementProgress,
        resetAchievements,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};
