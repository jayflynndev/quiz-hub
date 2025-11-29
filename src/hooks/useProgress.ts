// src/hooks/useProgress.ts
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabaseClient";
import type {
  PlayerProgress,
  LevelId,
  LevelProgressStatus,
  LevelConfig,
} from "../types/game";
import { LEVELS } from "../data/levels";

const PROGRESS_STORAGE_KEY = "quiz_odyssey_progress_v1";

const defaultProgress: PlayerProgress = {
  completedLevelIds: [],
};

interface UseProgressArgs {
  activeProfileId: string | null;
  profileReady: boolean;
}

export interface UseProgressResult {
  progress: PlayerProgress;
  loadingProgress: boolean;
  saveProgress: (next: PlayerProgress) => Promise<void>;
  getLevelStatus: (levelId: LevelId) => LevelProgressStatus;
  getLevelsForVenueWithStatus: (
    venueId: string | null
  ) => (LevelConfig & { status: LevelProgressStatus })[];
}

export const useProgress = ({
  activeProfileId,
  profileReady,
}: UseProgressArgs): UseProgressResult => {
  const [progress, setProgress] =
    React.useState<PlayerProgress>(defaultProgress);
  const [loadingProgress, setLoadingProgress] = React.useState(true);

  // --- Load progress from Supabase + AsyncStorage once profile is ready ---
  React.useEffect(() => {
    if (!activeProfileId || !profileReady) return;

    const loadProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("profile_id", activeProfileId)
          .maybeSingle();

        let baseProgress: PlayerProgress;

        if (error) {
          console.warn("Supabase loadProgress error", error);
        }

        if (data) {
          baseProgress = {
            completedLevelIds: (data.completed_level_ids ?? []) as LevelId[],
          };
        } else {
          const raw = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as PlayerProgress;
            baseProgress = parsed;
          } else {
            baseProgress = defaultProgress;
          }
        }

        setProgress(baseProgress);

        await AsyncStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify(baseProgress)
        );

        const { error: upsertError } = await supabase.from("progress").upsert({
          profile_id: activeProfileId,
          completed_level_ids: baseProgress.completedLevelIds,
          updated_at: new Date().toISOString(),
        });

        if (upsertError) {
          console.warn("Supabase upsert progress error", upsertError);
        }
      } catch (err) {
        console.warn("Failed to load progress (Supabase + local)", err);
        setProgress(defaultProgress);
      } finally {
        setLoadingProgress(false);
      }
    };

    void loadProgress();
  }, [activeProfileId, profileReady]);

  const saveProgress = React.useCallback(
    async (next: PlayerProgress) => {
      try {
        setProgress(next);
        await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));

        if (!activeProfileId) return;

        const { error } = await supabase.from("progress").upsert({
          profile_id: activeProfileId,
          completed_level_ids: next.completedLevelIds,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.warn("Supabase saveProgress error", error);
        }
      } catch (err) {
        console.warn("Failed to save progress", err);
      }
    },
    [activeProfileId]
  );

  const getLevelStatus = React.useCallback(
    (levelId: LevelId): LevelProgressStatus => {
      const level = LEVELS.find((l) => l.id === levelId);
      if (!level) return "locked";

      const isCompleted = progress.completedLevelIds.includes(levelId);
      if (isCompleted) return "completed";

      if (level.levelNumber === 1) {
        return "unlocked";
      }

      const venueLevels = LEVELS.filter(
        (l) => l.venueId === level.venueId
      ).sort((a, b) => a.levelNumber - b.levelNumber);

      const previousLevel = venueLevels.find(
        (l) => l.levelNumber === level.levelNumber - 1
      );
      if (!previousLevel) return "locked";

      const previousCompleted = progress.completedLevelIds.includes(
        previousLevel.id
      );

      return previousCompleted ? "unlocked" : "locked";
    },
    [progress.completedLevelIds]
  );

  const getLevelsForVenueWithStatus = React.useCallback(
    (
      venueId: string | null
    ): (LevelConfig & { status: LevelProgressStatus })[] => {
      if (!venueId) return [];

      const venueLevels = LEVELS.filter((l) => l.venueId === venueId).sort(
        (a, b) => a.levelNumber - b.levelNumber
      );

      return venueLevels.map((level) => ({
        ...level,
        status: getLevelStatus(level.id),
      }));
    },
    [getLevelStatus]
  );

  return {
    progress,
    loadingProgress,
    saveProgress,
    getLevelStatus,
    getLevelsForVenueWithStatus,
  };
};
