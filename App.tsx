// App.tsx
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  GameSession,
  LevelId,
  PlayerProgress,
  LevelProgressStatus,
  LifelineType,
} from "./src/types/game";
import { LEVELS } from "./src/data/levels";
import { VENUES } from "./src/data/venues";
import {
  createSessionForLevel,
  answerCurrentQuestion,
  useLifeline,
  generateAudiencePoll,
  getCurrentQuestion,
} from "./src/engine/gameEngine";

import { MenuScreen } from "./src/screens/MenuScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { VenueSelectScreen } from "./src/screens/VenueSelectScreen";

type Screen = "venues" | "levels" | "playing";

const PROGRESS_STORAGE_KEY = "quiz_odyssey_progress_v1";

const defaultProgress: PlayerProgress = {
  completedLevelIds: [],
};

export default function App() {
  const [screen, setScreen] = React.useState<Screen>("venues");
  const [session, setSession] = React.useState<GameSession | null>(null);
  const [lastAnswerTime] = React.useState(1500);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [selectedLevelId, setSelectedLevelId] = React.useState<LevelId | null>(
    null
  );
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(
    null
  );
  const [progress, setProgress] =
    React.useState<PlayerProgress>(defaultProgress);
  const [loadingProgress, setLoadingProgress] = React.useState(true);
  const [audiencePoll, setAudiencePoll] = React.useState<Record<
    string,
    number
  > | null>(null);
  const [askQuizzersRemaining, setAskQuizzersRemaining] = React.useState(3); // 3 uses per level for now
  const [usedAskQuizzersThisQuestion, setUsedAskQuizzersThisQuestion] =
    React.useState(false);

  // Load progress from AsyncStorage on mount
  React.useEffect(() => {
    const loadProgress = async () => {
      try {
        const raw = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as PlayerProgress;
          setProgress(parsed);
        } else {
          setProgress(defaultProgress);
        }
      } catch (err) {
        console.warn("Failed to load progress", err);
        setProgress(defaultProgress);
      } finally {
        setLoadingProgress(false);
      }
    };

    loadProgress();
  }, []);

  const saveProgress = React.useCallback(async (next: PlayerProgress) => {
    try {
      setProgress(next);
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("Failed to save progress", err);
    }
  }, []);

  const ukVenues = React.useMemo(
    () =>
      VENUES.filter((v) => v.regionId === "uk").sort(
        (a, b) => a.order - b.order
      ),
    []
  );

  const getLevelById = (id: LevelId | null) =>
    id ? LEVELS.find((l) => l.id === id) ?? null : null;

  const getVenueById = (id: string | null) =>
    id ? ukVenues.find((v) => v.id === id) ?? null : null;

  const getLevelStatus = React.useCallback(
    (levelId: LevelId): LevelProgressStatus => {
      const level = getLevelById(levelId);
      if (!level) return "locked";

      const isCompleted = progress.completedLevelIds.includes(levelId);
      if (isCompleted) return "completed";

      // Within each venue: Level 1 is always unlocked
      if (level.levelNumber === 1) {
        return "unlocked";
      }

      // To unlock Level N: Level N-1 in the same venue must be completed
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

  const getLevelsForCurrentVenueWithStatus = React.useCallback(() => {
    if (!selectedVenueId) return [];

    const venueLevels = LEVELS.filter(
      (l) => l.venueId === selectedVenueId
    ).sort((a, b) => a.levelNumber - b.levelNumber);

    return venueLevels.map((level) => ({
      ...level,
      status: getLevelStatus(level.id),
    }));
  }, [selectedVenueId, getLevelStatus]);

  const startLevel = (levelId: LevelId) => {
    const level = getLevelById(levelId);
    if (!level) return;

    const status = getLevelStatus(levelId);
    if (status === "locked") {
      return;
    }

    const newSession = createSessionForLevel(level);
    setSelectedLevelId(levelId);
    setSession(newSession);
    setSelectedOption(null);
    setAskQuizzersRemaining(3); // or another number later
    setUsedAskQuizzersThisQuestion(false);
    setAudiencePoll(null);
    setScreen("playing");
  };

  const handleAnswer = (optionId: string) => {
    if (selectedOption) return;
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    setSelectedOption(optionId);

    const updated = answerCurrentQuestion(
      session,
      level,
      optionId,
      lastAnswerTime
    );

    setTimeout(() => {
      setSelectedOption(null);
      setSession(updated);
      setAudiencePoll(null);
      setUsedAskQuizzersThisQuestion(false);

      // If level just finished and is passed, update progress
      if (
        updated.status === "passed" &&
        !progress.completedLevelIds.includes(level.id)
      ) {
        const nextProgress: PlayerProgress = {
          ...progress,
          completedLevelIds: [...progress.completedLevelIds, level.id],
        };
        saveProgress(nextProgress);
      }
    }, 800);
  };

  const handleUseAskQuizzers = () => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    // Lifeline must be allowed on this level
    if (!level.lifelinesAllowed.includes("ASK_QUIZZERS")) return;

    // No charges left
    if (askQuizzersRemaining <= 0) return;

    // Already used on this question
    if (usedAskQuizzersThisQuestion) return;

    const question = getCurrentQuestion(session);
    if (!question) return;

    const poll = generateAudiencePoll(question);
    setAudiencePoll(poll);
    setUsedAskQuizzersThisQuestion(true);
    setAskQuizzersRemaining((prev) => prev - 1);
  };

  const handleUseLifeline = (lifeline: LifelineType) => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    // Don’t apply if level doesn’t allow it
    if (!level.lifelinesAllowed.includes(lifeline)) return;

    // Don’t reuse same lifeline
    if (session.usedLifelines.includes(lifeline)) return;

    const updatedSession = useLifeline(session, level, lifeline);
    setSession(updatedSession);

    if (lifeline === "ASK_QUIZZERS") {
      const question = getCurrentQuestion(updatedSession);
      if (!question) return;
      const poll = generateAudiencePoll(question);
      setAudiencePoll(poll);
    }

    // (We’ll handle FIFTY_FIFTY etc later)
  };

  const handleRestart = () => {
    if (!selectedLevelId) return;
    setAudiencePoll(null);
    setAskQuizzersRemaining(3);
    setUsedAskQuizzersThisQuestion(false);
    startLevel(selectedLevelId);
  };

  const handleBackToLevels = () => {
    setSession(null);
    setSelectedOption(null);
    setSelectedLevelId(null);
    setAudiencePoll(null);
    setAskQuizzersRemaining(3);
    setUsedAskQuizzersThisQuestion(false);
    setScreen("levels");
  };

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    setSelectedLevelId(null);
    setScreen("levels");
  };

  // --- RENDER ---

  if (loadingProgress) {
    // While loading, just show venue list (locks won't be accurate yet)
    return (
      <VenueSelectScreen venues={ukVenues} onSelectVenue={handleSelectVenue} />
    );
  }

  if (screen === "venues") {
    return (
      <VenueSelectScreen venues={ukVenues} onSelectVenue={handleSelectVenue} />
    );
  }

  if (screen === "levels") {
    const venue = getVenueById(selectedVenueId);
    const levelsWithStatus = getLevelsForCurrentVenueWithStatus();

    if (!venue) {
      return (
        <VenueSelectScreen
          venues={ukVenues}
          onSelectVenue={handleSelectVenue}
        />
      );
    }

    return (
      <MenuScreen
        venueName={venue.name}
        levels={levelsWithStatus}
        onStartLevel={startLevel}
        onBackToVenues={() => {
          setSelectedVenueId(null);
          setSelectedLevelId(null);
          setScreen("venues");
        }}
      />
    );
  }

  // playing
  if (!session || !selectedLevelId) {
    // Fallback if something odd happened
    return (
      <VenueSelectScreen venues={ukVenues} onSelectVenue={handleSelectVenue} />
    );
  }

  const currentLevel = getLevelById(selectedLevelId);
  const currentVenue = getVenueById(currentLevel?.venueId ?? null);

  if (!currentLevel || !currentVenue) {
    return (
      <VenueSelectScreen venues={ukVenues} onSelectVenue={handleSelectVenue} />
    );
  }

  return (
    <GameScreen
      session={session}
      level={currentLevel}
      venueName={currentVenue.name}
      selectedOption={selectedOption}
      onAnswer={handleAnswer}
      onRestart={handleRestart}
      onBackToMenu={handleBackToLevels}
      lifelinesAllowed={currentLevel.lifelinesAllowed}
      askQuizzersRemaining={askQuizzersRemaining}
      usedAskQuizzersThisQuestion={usedAskQuizzersThisQuestion}
      onUseAskQuizzers={handleUseAskQuizzers}
      audiencePoll={audiencePoll}
    />
  );
}
