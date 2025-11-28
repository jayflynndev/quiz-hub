// App.tsx
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type {
  GameSession,
  LevelId,
  PlayerProgress,
  LevelProgressStatus,
  LifelineType,
  LevelConfig,
  PlayerProfile,
  RewardSummary,
} from "./src/types/game";
import { LEVELS } from "./src/data/levels";
import { VENUES } from "./src/data/venues";
import {
  createSessionForLevel,
  answerCurrentQuestion,
  useLifeline,
  generateAudiencePoll,
  getCurrentQuestion,
  getLifelinesForLevel,
} from "./src/engine/gameEngine";

import { MenuScreen } from "./src/screens/MenuScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { VenueSelectScreen } from "./src/screens/VenueSelectScreen";
import { ShopScreen } from "./src/screens/ShopScreen";
import { OutOfHeartsScreen } from "./src/screens/OutOfHeartsScreen";

type Screen = "venues" | "levels" | "playing" | "shop" | "out_of_hearts";

const PROGRESS_STORAGE_KEY = "quiz_odyssey_progress_v1";

const defaultProgress: PlayerProgress = {
  completedLevelIds: [],
};

const getPlannedQuestionCount = (level: LevelConfig): number => {
  // If this level has explicit questionIds, use them
  if (level.questionIds && level.questionIds.length > 0) {
    return level.questionIds.length;
  }

  // Fallback: derive from level number (same logic as the engine)
  if (level.levelNumber <= 4) return 5;
  if (level.levelNumber <= 7) return 6;
  return 7;
};

const MAX_HEARTS = 5;
const HEART_REGEN_MINUTES = 20; // tweak this later if you like
const HEART_REGEN_MS = HEART_REGEN_MINUTES * 60 * 1000;

const withRegeneratedHearts = (profile: PlayerProfile): PlayerProfile => {
  // Already full – nothing to do
  if (profile.hearts >= MAX_HEARTS) {
    return profile.hearts === MAX_HEARTS
      ? profile
      : { ...profile, hearts: MAX_HEARTS };
  }

  const last = profile.lastHeartUpdateAt ?? Date.now();
  const now = Date.now();
  if (now <= last) return profile;

  const elapsed = now - last;
  const heartsToAdd = Math.floor(elapsed / HEART_REGEN_MS);
  if (heartsToAdd <= 0) return profile;

  const newHearts = Math.min(MAX_HEARTS, profile.hearts + heartsToAdd);
  const consumedMs = heartsToAdd * HEART_REGEN_MS;
  const newLast = last + consumedMs;

  return {
    ...profile,
    hearts: newHearts,
    lastHeartUpdateAt: newLast,
  };
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
  const [fiftyFiftyRemaining, setFiftyFiftyRemaining] = React.useState(1);
  const [usedFiftyFiftyThisQuestion, setUsedFiftyFiftyThisQuestion] =
    React.useState(false);
  const [hiddenOptions, setHiddenOptions] = React.useState<string[]>([]);
  const [lastRewardSummary, setLastRewardSummary] =
    React.useState<RewardSummary | null>(null);

  const QUESTION_TIME_LIMIT_SECONDS = 10;

  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const PROFILE_STORAGE_KEY = "quiz_odyssey_profile_v1";
  const [profile, setProfile] = React.useState<PlayerProfile>({
    xp: 0,
    level: 1,
    coins: 0,
    bonusAskQuizzers: 0,
    bonusFiftyFifty: 0,
    askQuizzersOwned: 3,
    fiftyFiftyOwned: 1,
    extraLivesOwned: 0,
    hearts: MAX_HEARTS,
    lastHeartUpdateAt: Date.now(),
  });

  const handleBuyAskQuizzersUpgrade = () => {
    const cost = 50;
    if (profile.coins < cost) return;

    const next: PlayerProfile = {
      ...profile,
      coins: profile.coins - cost,
      askQuizzersOwned: profile.askQuizzersOwned + 1,
    };

    saveProfile(next);
  };

  const handleBuyFiftyFiftyUpgrade = () => {
    const cost = 70;
    if (profile.coins < cost) return;

    const next: PlayerProfile = {
      ...profile,
      coins: profile.coins - cost,
      fiftyFiftyOwned: profile.fiftyFiftyOwned + 1,
    };

    saveProfile(next);
  };

  const handleRefillHeartsDebug = () => {
    const next: PlayerProfile = {
      ...profile,
      hearts: MAX_HEARTS,
      lastHeartUpdateAt: Date.now(),
    };
    saveProfile(next);
  };

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

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PlayerProfile>;

          const baseProfile: PlayerProfile = {
            xp: parsed.xp ?? 0,
            level: parsed.level ?? 1,
            coins: parsed.coins ?? 0,
            bonusAskQuizzers: parsed.bonusAskQuizzers ?? 0,
            bonusFiftyFifty: parsed.bonusFiftyFifty ?? 0,
            askQuizzersOwned: parsed.askQuizzersOwned ?? 3,
            fiftyFiftyOwned: parsed.fiftyFiftyOwned ?? 1,
            extraLivesOwned: parsed.extraLivesOwned ?? 0,
            hearts: parsed.hearts ?? MAX_HEARTS,
            lastHeartUpdateAt: parsed.lastHeartUpdateAt ?? Date.now(),
          };

          const hydrated = withRegeneratedHearts(baseProfile);
          setProfile(hydrated);
        }
      } catch (err) {
        console.warn("Failed to load profile", err);
      }
    };

    loadProfile();
  }, []);

  const saveProfile = React.useCallback(async (next: PlayerProfile) => {
    try {
      setProfile(next);
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      console.warn("Failed to save profile", err);
    }
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProfile((prev) => {
        const next = withRegeneratedHearts(prev);
        if (next === prev) return prev;

        // Persist updated hearts
        AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next)).catch(
          (err) => console.warn("Failed to save profile (regen)", err)
        );
        return next;
      });
    }, 1000); // tick every second

    return () => clearInterval(interval);
  }, []);

  const clearQuestionTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  };

  React.useEffect(() => {
    // Only run timer while actually playing a level
    if (screen !== "playing" || !session || session.status !== "in_progress") {
      clearQuestionTimer();
      return;
    }

    // New question (or restarted) → reset timer
    clearQuestionTimer();
    setTimeLeft(QUESTION_TIME_LIMIT_SECONDS);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          // Will hit 0 now: stop timer, trigger timeout handling
          clearQuestionTimer();
          // Defer to allow state to settle
          setTimeout(() => {
            handleTimeExpired();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup if component/effect changes
    return () => {
      clearQuestionTimer();
    };
    // 👇 We care about: screen, current question index, and session status
  }, [screen, session?.currentQuestionIndex, session?.status]);

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

    // ❤️ No hearts left → show Out-of-Hearts screen
    if (profile.hearts <= 0) {
      setScreen("out_of_hearts");
      return;
    }

    const newSession = createSessionForLevel(level);
    setSelectedLevelId(levelId);
    setSession(newSession);
    setSelectedOption(null);

    setAskQuizzersRemaining(profile.askQuizzersOwned);
    setUsedAskQuizzersThisQuestion(false);
    setAudiencePoll(null);

    setFiftyFiftyRemaining(profile.fiftyFiftyOwned);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);

    clearQuestionTimer();
    setScreen("playing");
  };

  const applyAnswerOutcome = (updated: GameSession, level: LevelConfig) => {
    setSelectedOption(null);
    setSession(updated);

    // Clear per-question stuff
    setAudiencePoll(null);
    setUsedAskQuizzersThisQuestion(false);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);
    clearQuestionTimer(); // stop timer for this question; effect will restart if there's another
    const totalCorrect = updated.answers.filter((a) => a.correct).length;
    const totalQuestions = updated.answers.length;
    const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    // Handle level completion
    // --- Level completion + rewards ---
    if (updated.status === "passed") {
      if (!progress.completedLevelIds.includes(level.id)) {
        const nextProgress: PlayerProgress = {
          ...progress,
          completedLevelIds: [...progress.completedLevelIds, level.id],
        };
        saveProgress(nextProgress);
      }

      const baseXP = 50;
      const accuracyXP = Math.floor(accuracy * 150);
      const lifeXP = 0; // in-level lives removed
      const xpEarned = baseXP + accuracyXP + lifeXP;

      const coinsEarned =
        5 +
        totalCorrect +
        (updated.usedLifelines.length === 0 ? 5 : 0) +
        (accuracy === 1 ? 3 : 0);

      let newXP = profile.xp + xpEarned;
      let newLevel = profile.level;

      let xpToNext = newLevel * 100;
      while (newXP >= xpToNext) {
        newXP -= xpToNext;
        newLevel += 1;
        xpToNext = newLevel * 100;
      }

      const newCoins = profile.coins + coinsEarned;

      saveProfile({
        ...profile,
        xp: newXP,
        level: newLevel,
        coins: newCoins,
      });

      setLastRewardSummary({
        xpEarned,
        coinsEarned,
        totalCorrect,
        totalQuestions,
        accuracy,
        result: "passed",
      });
    } else if (updated.status === "failed") {
      const nextHearts = Math.max(0, profile.hearts - 1);

      saveProfile({
        ...profile,
        hearts: nextHearts,
        lastHeartUpdateAt: Date.now(),
      });

      setLastRewardSummary({
        xpEarned: 0,
        coinsEarned: 0,
        totalCorrect,
        totalQuestions,
        accuracy,
        result: "failed",
      });
    }
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
      applyAnswerOutcome(updated, level);
    }, 800);
  };

  const handleTimeExpired = () => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    const question = getCurrentQuestion(session);
    if (!question) return;

    // Pick a guaranteed wrong option to simulate a wrong answer
    const wrongOption = question.options.find(
      (o) => o.id !== question.correctOptionId
    );
    if (!wrongOption) return;

    // Treat as a very slow wrong answer
    const updated = answerCurrentQuestion(
      session,
      level,
      wrongOption.id,
      QUESTION_TIME_LIMIT_SECONDS * 1000
    );

    // No need for delay animation here; go straight to next state
    applyAnswerOutcome(updated, level);
  };

  const handleUseAskQuizzers = () => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    const lifelines = getLifelinesForLevel(level);
    if (!lifelines.includes("ASK_QUIZZERS")) return;

    // No uses left in this level
    if (askQuizzersRemaining <= 0) return;

    // Already used on this question
    if (usedAskQuizzersThisQuestion) return;

    // No inventory left overall (Candy Crush style check)
    if (profile.askQuizzersOwned <= 0) return;

    const question = getCurrentQuestion(session);
    if (!question) return;

    const poll = generateAudiencePoll(question);
    setAudiencePoll(poll);
    setUsedAskQuizzersThisQuestion(true);

    // Decrease per-level count
    setAskQuizzersRemaining((prev) => Math.max(0, prev - 1));

    // Decrease inventory and persist
    saveProfile({
      ...profile,
      askQuizzersOwned: Math.max(0, profile.askQuizzersOwned - 1),
    });
  };

  const handleUseFiftyFifty = () => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    // Lifeline must be allowed on this level
    const lifelines = getLifelinesForLevel(level);
    if (!lifelines.includes("FIFTY_FIFTY")) return;

    // No uses left in this level
    if (fiftyFiftyRemaining <= 0) return;

    // Already used on this question
    if (usedFiftyFiftyThisQuestion) return;

    // No inventory left overall
    if (profile.fiftyFiftyOwned <= 0) return;

    const question = getCurrentQuestion(session);
    if (!question) return;

    const wrongOptions = question.options.filter(
      (o) => o.id !== question.correctOptionId
    );
    if (wrongOptions.length < 2) return;

    const shuffled = [...wrongOptions].sort(() => Math.random() - 0.5);
    const toHide = shuffled.slice(0, 2).map((o) => o.id);

    setHiddenOptions(toHide);
    setUsedFiftyFiftyThisQuestion(true);

    // Decrease per-level count
    setFiftyFiftyRemaining((prev) => Math.max(0, prev - 1));

    // Decrease inventory and persist
    saveProfile({
      ...profile,
      fiftyFiftyOwned: Math.max(0, profile.fiftyFiftyOwned - 1),
    });
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

    setLastRewardSummary(null);
    setAudiencePoll(null);
    setAskQuizzersRemaining(profile.askQuizzersOwned);
    setUsedAskQuizzersThisQuestion(false);

    setFiftyFiftyRemaining(profile.fiftyFiftyOwned);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);

    clearQuestionTimer();
    startLevel(selectedLevelId);
  };

  const handleBackToLevels = () => {
    setSession(null);
    setSelectedOption(null);
    setSelectedLevelId(null);
    setAudiencePoll(null);
    setAskQuizzersRemaining(0);
    setUsedAskQuizzersThisQuestion(false);
    setFiftyFiftyRemaining(0);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);
    setLastRewardSummary(null);
    clearQuestionTimer();
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
      <VenueSelectScreen
        venues={ukVenues}
        onSelectVenue={handleSelectVenue}
        onOpenShop={() => setScreen("shop")}
        onRefillHearts={handleRefillHeartsDebug}
      />
    );
  }

  if (screen === "out_of_hearts") {
    return (
      <OutOfHeartsScreen
        hearts={profile.hearts}
        maxHearts={MAX_HEARTS}
        lastHeartUpdateAt={profile.lastHeartUpdateAt}
        heartRegenMs={HEART_REGEN_MS}
        onGoToShop={() => setScreen("shop")}
        onBackToVenues={() => setScreen("venues")}
      />
    );
  }

  if (screen === "shop") {
    return (
      <ShopScreen
        profile={profile}
        onBuyAskQuizzersUpgrade={handleBuyAskQuizzersUpgrade}
        onBuyFiftyFiftyUpgrade={handleBuyFiftyFiftyUpgrade}
        onBack={() => setScreen("venues")}
      />
    );
  }

  if (screen === "venues") {
    return (
      <VenueSelectScreen
        venues={ukVenues}
        onSelectVenue={handleSelectVenue}
        onOpenShop={() => setScreen("shop")}
        onRefillHearts={handleRefillHeartsDebug}
      />
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
          onOpenShop={() => setScreen("shop")}
          onRefillHearts={handleRefillHeartsDebug}
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
      <VenueSelectScreen
        venues={ukVenues}
        onSelectVenue={handleSelectVenue}
        onOpenShop={() => setScreen("shop")}
        onRefillHearts={handleRefillHeartsDebug}
      />
    );
  }

  const currentLevel = getLevelById(selectedLevelId);
  const currentVenue = getVenueById(currentLevel?.venueId ?? null);

  if (!currentLevel || !currentVenue) {
    return (
      <VenueSelectScreen
        venues={ukVenues}
        onSelectVenue={handleSelectVenue}
        onOpenShop={() => setScreen("shop")}
        onRefillHearts={handleRefillHeartsDebug}
      />
    );
  }

  const lifelinesAllowed = getLifelinesForLevel(currentLevel);
  const xpToNextLevel = profile.level * 100;

  return (
    <GameScreen
      session={session}
      level={currentLevel}
      venueName={currentVenue.name}
      selectedOption={selectedOption}
      onAnswer={handleAnswer}
      onRestart={handleRestart}
      onBackToMenu={handleBackToLevels}
      lifelinesAllowed={lifelinesAllowed}
      askQuizzersRemaining={askQuizzersRemaining}
      usedAskQuizzersThisQuestion={usedAskQuizzersThisQuestion}
      onUseAskQuizzers={handleUseAskQuizzers}
      fiftyFiftyRemaining={fiftyFiftyRemaining}
      usedFiftyFiftyThisQuestion={usedFiftyFiftyThisQuestion}
      onUseFiftyFifty={handleUseFiftyFifty}
      hiddenOptions={hiddenOptions}
      audiencePoll={audiencePoll}
      timeLeft={timeLeft}
      profile={profile}
      xpToNextLevel={xpToNextLevel}
      rewardSummary={lastRewardSummary}
    />
  );
}
