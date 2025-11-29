// App.tsx
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./src/lib/supabaseClient";

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
  LEVEL_UP_REWARDS,
} from "./src/engine/gameEngine";
import { SHOP_ITEMS, ShopItemId } from "./src/data/shopItems";

import { MenuScreen } from "./src/screens/MenuScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { VenueSelectScreen } from "./src/screens/VenueSelectScreen";
import { ShopScreen } from "./src/screens/ShopScreen";
import { OutOfHeartsScreen } from "./src/screens/OutOfHeartsScreen";
import { LockedLevelScreen } from "./src/screens/LockedLevelScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import { HomeMenuScreen } from "./src/screens/HomeMenuScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { RegionSelectScreen } from "./src/screens/RegionSelectScreen";
import { AuthScreen } from "./src/screens/AuthScreen";

import {
  usePlayerProfile,
  MAX_HEARTS,
  HEART_REGEN_MS,
} from "./src/hooks/usePlayerProfile";
import { useProgress } from "./src/hooks/useProgress";
import { useQuestionTimer } from "./src/hooks/useQuestionTimer";

type Screen =
  | "splash"
  | "home"
  | "regions"
  | "venues"
  | "levels"
  | "playing"
  | "shop"
  | "profile"
  | "out_of_hearts"
  | "locked"
  | "auth";

const getPlannedQuestionCount = (level: LevelConfig): number => {
  if (level.questionIds && level.questionIds.length > 0) {
    return level.questionIds.length;
  }
  if (level.levelNumber <= 4) return 5;
  if (level.levelNumber <= 7) return 6;
  return 7;
};

const getRegionName = (regionId: string): string => {
  switch (regionId) {
    case "uk":
      return "United Kingdom";
    default:
      return regionId;
  }
};

const getTodayDateString = (): string => {
  // ISO date "YYYY-MM-DD" in UTC; good enough for now
  return new Date().toISOString().slice(0, 10);
};

const computeUpdatedStreak = (
  profile: PlayerProfile
): {
  newDailyStreak: number;
  newLastActiveAt: string;
} => {
  const today = getTodayDateString();
  const last = profile.lastActiveAt;

  if (!last) {
    return { newDailyStreak: 1, newLastActiveAt: today };
  }

  if (last === today) {
    return { newDailyStreak: profile.dailyStreak, newLastActiveAt: last };
  }

  const lastDate = new Date(`${last}T00:00:00Z`);
  const todayDate = new Date(`${today}T00:00:00Z`);
  const diffMs = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return {
      newDailyStreak: profile.dailyStreak + 1,
      newLastActiveAt: today,
    };
  }

  return {
    newDailyStreak: 1,
    newLastActiveAt: today,
  };
};

export default function App() {
  const [screen, setScreen] = React.useState<Screen>("splash");

  const {
    profile,
    profileReady,
    authUserId,
    activeProfileId,
    guestProfileId,
    saveProfile,
    handleRefillHeartsDebug,
    handleLogout,
    linkGuestProfileToAuthUser,
  } = usePlayerProfile();

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
  const {
    progress,
    loadingProgress,
    saveProgress,
    getLevelStatus,
    getLevelsForVenueWithStatus,
  } = useProgress({ activeProfileId, profileReady });

  const [audiencePoll, setAudiencePoll] = React.useState<Record<
    string,
    number
  > | null>(null);
  const [askQuizzersRemaining, setAskQuizzersRemaining] = React.useState(3);
  const [usedAskQuizzersThisQuestion, setUsedAskQuizzersThisQuestion] =
    React.useState(false);
  const [fiftyFiftyRemaining, setFiftyFiftyRemaining] = React.useState(1);
  const [usedFiftyFiftyThisQuestion, setUsedFiftyFiftyThisQuestion] =
    React.useState(false);
  const [hiddenOptions, setHiddenOptions] = React.useState<string[]>([]);
  const [lastRewardSummary, setLastRewardSummary] =
    React.useState<RewardSummary | null>(null);
  const [lockedLevelInfo, setLockedLevelInfo] = React.useState<{
    venueName: string;
    levelNumber: number;
    requiredLevelNumber: number;
  } | null>(null);
  const [selectedRegionId, setSelectedRegionId] = React.useState<string | null>(
    null
  );

  const QUESTION_TIME_LIMIT_SECONDS = 10;

  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedVenueId(null);
    setSelectedLevelId(null);
    setScreen("venues");
  };

  const buyShopItem = React.useCallback(
    (itemId: ShopItemId) => {
      const item = SHOP_ITEMS[itemId];
      if (!item) return;

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

  const handleBuyAskQuizzersUpgrade = () => {
    buyShopItem("ASK_QUIZZERS");
  };

  const handleBuyFiftyFiftyUpgrade = () => {
    buyShopItem("FIFTY_FIFTY");
  };

  const handleBuyHeart = () => {
    buyShopItem("HEART");
  };

  const allVenues = React.useMemo(
    () => [...VENUES].sort((a, b) => a.order - b.order),
    []
  );

  const getVenuesForRegion = (regionId: string | null) =>
    regionId ? allVenues.filter((v) => v.regionId === regionId) : [];

  const getLevelById = (id: LevelId | null) =>
    id ? LEVELS.find((l) => l.id === id) ?? null : null;

  const getVenueById = (id: string | null) =>
    id ? allVenues.find((v) => v.id === id) ?? null : null;

  const regions = React.useMemo(() => {
    const map: Record<
      string,
      { id: string; name: string; venueCount: number }
    > = {};
    allVenues.forEach((v) => {
      if (!map[v.regionId]) {
        map[v.regionId] = {
          id: v.regionId,
          name: getRegionName(v.regionId),
          venueCount: 0,
        };
      }
      map[v.regionId].venueCount += 1;
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  }, [allVenues]);

  const startLevel = (levelId: LevelId) => {
    const level = getLevelById(levelId);
    if (!level) return;

    const status = getLevelStatus(levelId);
    if (status === "locked") {
      const venue = getVenueById(selectedVenueId);
      const venueLevels = LEVELS.filter(
        (l) => l.venueId === selectedVenueId
      ).sort((a, b) => a.levelNumber - b.levelNumber);

      const thisLevel = venueLevels.find((l) => l.id === levelId);
      const prevLevel = venueLevels.find(
        (l) => l.levelNumber === (thisLevel?.levelNumber ?? 0) - 1
      );

      setLockedLevelInfo({
        venueName: venue?.name ?? "",
        levelNumber: thisLevel?.levelNumber ?? 0,
        requiredLevelNumber: prevLevel?.levelNumber ?? 1,
      });

      setScreen("locked");
      return;
    }

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

    clearTimer();
    setScreen("playing");
  };

  const applyAnswerOutcome = (updated: GameSession, level: LevelConfig) => {
    setSelectedOption(null);
    setSession(updated);

    setAudiencePoll(null);
    setUsedAskQuizzersThisQuestion(false);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);
    clearTimer();

    const totalCorrect = updated.answers.filter((a) => a.correct).length;
    const totalQuestions = updated.answers.length;
    const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    if (updated.status === "passed") {
      if (!progress.completedLevelIds.includes(level.id)) {
        const nextProgress: PlayerProgress = {
          ...progress,
          completedLevelIds: [...progress.completedLevelIds, level.id],
        };
        void saveProgress(nextProgress);
      }

      const baseXP = 50;
      const accuracyXP = Math.floor(accuracy * 150);
      const lifeXP = 0;
      const xpEarned = baseXP + accuracyXP + lifeXP;

      const coinsEarnedBase =
        5 +
        totalCorrect +
        (updated.usedLifelines.length === 0 ? 5 : 0) +
        (accuracy === 1 ? 3 : 0);

      let newXP = profile.xp + xpEarned;
      let newLevel = profile.level;
      let levelsGained = 0;

      let xpToNext = newLevel * 100;
      while (newXP >= xpToNext) {
        newXP -= xpToNext;
        newLevel += 1;
        levelsGained += 1;
        xpToNext = newLevel * 100;
      }

      let bonusCoins = 0;
      let bonusAskQuizzers = 0;
      let bonusHearts = 0;

      if (levelsGained > 0) {
        for (let i = 1; i <= levelsGained; i++) {
          const reachedLevel = profile.level + i;

          bonusCoins += LEVEL_UP_REWARDS.everyLevel.coins;

          if (reachedLevel % 3 === 0) {
            if (LEVEL_UP_REWARDS.every3Levels.lifeline === "ASK_QUIZZERS") {
              bonusAskQuizzers += 1;
            }
          }

          if (reachedLevel % 5 === 0) {
            bonusHearts += LEVEL_UP_REWARDS.every5Levels.heart;
          }
        }
      }

      const { newDailyStreak, newLastActiveAt } = computeUpdatedStreak(profile);

      let streakBonusCoins = 0;
      let streakBonusHearts = 0;

      if (newDailyStreak !== profile.dailyStreak) {
        streakBonusCoins = 5 + newDailyStreak;
        if (newDailyStreak % 5 === 0) {
          streakBonusHearts = 1;
        }
      }

      const totalCoinsEarned = coinsEarnedBase + bonusCoins + streakBonusCoins;

      const newCoins = profile.coins + totalCoinsEarned;
      const newAskOwned = profile.askQuizzersOwned + bonusAskQuizzers;
      const newHearts = Math.min(
        MAX_HEARTS,
        profile.hearts + bonusHearts + streakBonusHearts
      );

      void saveProfile({
        ...profile,
        xp: newXP,
        level: newLevel,
        coins: newCoins,
        askQuizzersOwned: newAskOwned,
        hearts: newHearts,
        dailyStreak: newDailyStreak,
        lastActiveAt: newLastActiveAt,
      });

      setLastRewardSummary({
        xpEarned,
        coinsEarned: totalCoinsEarned,
        totalCorrect,
        totalQuestions,
        accuracy,
        result: "passed",
        bonusAskQuizzers,
        bonusHearts: bonusHearts + streakBonusHearts,
      });
    } else if (updated.status === "failed") {
      const { newDailyStreak, newLastActiveAt } = computeUpdatedStreak(profile);

      let streakBonusCoins = 0;
      let streakBonusHearts = 0;

      if (newDailyStreak !== profile.dailyStreak) {
        streakBonusCoins = 5 + newDailyStreak;
        if (newDailyStreak % 5 === 0) {
          streakBonusHearts = 1;
        }
      }

      const heartsAfterFail = Math.max(0, profile.hearts - 1);
      const newHearts = Math.min(
        MAX_HEARTS,
        heartsAfterFail + streakBonusHearts
      );

      const newCoins = profile.coins + streakBonusCoins;

      void saveProfile({
        ...profile,
        hearts: newHearts,
        lastHeartUpdateAt: Date.now(),
        coins: newCoins,
        dailyStreak: newDailyStreak,
        lastActiveAt: newLastActiveAt,
      });

      setLastRewardSummary({
        xpEarned: 0,
        coinsEarned: streakBonusCoins,
        totalCorrect,
        totalQuestions,
        accuracy,
        result: "failed",
        bonusAskQuizzers: 0,
        bonusHearts: streakBonusHearts,
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

    const wrongOption = question.options.find(
      (o) => o.id !== question.correctOptionId
    );
    if (!wrongOption) return;

    const updated = answerCurrentQuestion(
      session,
      level,
      wrongOption.id,
      QUESTION_TIME_LIMIT_SECONDS * 1000
    );

    applyAnswerOutcome(updated, level);
  };

  const { timeLeft, clearTimer } = useQuestionTimer({
    isActive:
      screen === "playing" && !!session && session.status === "in_progress",
    questionIndex: session?.currentQuestionIndex ?? null,
    questionTimeLimitSeconds: QUESTION_TIME_LIMIT_SECONDS,
    onTimeExpired: handleTimeExpired,
  });

  const handleUseAskQuizzers = () => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    const lifelines = getLifelinesForLevel(level);
    if (!lifelines.includes("ASK_QUIZZERS")) return;

    if (askQuizzersRemaining <= 0) return;
    if (usedAskQuizzersThisQuestion) return;
    if (profile.askQuizzersOwned <= 0) return;

    const question = getCurrentQuestion(session);
    if (!question) return;

    const poll = generateAudiencePoll(question);
    setAudiencePoll(poll);
    setUsedAskQuizzersThisQuestion(true);

    setAskQuizzersRemaining((prev) => Math.max(0, prev - 1));

    void saveProfile({
      ...profile,
      askQuizzersOwned: Math.max(0, profile.askQuizzersOwned - 1),
    });
  };

  const handleUseFiftyFifty = () => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    const lifelines = getLifelinesForLevel(level);
    if (!lifelines.includes("FIFTY_FIFTY")) return;

    if (fiftyFiftyRemaining <= 0) return;
    if (usedFiftyFiftyThisQuestion) return;
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

    setFiftyFiftyRemaining((prev) => Math.max(0, prev - 1));

    void saveProfile({
      ...profile,
      fiftyFiftyOwned: Math.max(0, profile.fiftyFiftyOwned - 1),
    });
  };

  const handleUseLifeline = (lifeline: LifelineType) => {
    if (!session || !selectedLevelId) return;

    const level = getLevelById(selectedLevelId);
    if (!level) return;

    if (!level.lifelinesAllowed.includes(lifeline)) return;
    if (session.usedLifelines.includes(lifeline)) return;

    const updatedSession = useLifeline(session, level, lifeline);
    setSession(updatedSession);

    if (lifeline === "ASK_QUIZZERS") {
      const question = getCurrentQuestion(updatedSession);
      if (!question) return;
      const poll = generateAudiencePoll(question);
      setAudiencePoll(poll);
    }
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

    clearTimer();
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
    clearTimer();
    setScreen("levels");
  };

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    setSelectedLevelId(null);
    setScreen("levels");
  };

  // --- RENDER ---

  if (screen === "splash") {
    return <SplashScreen onFinish={() => setScreen("home")} />;
  }

  if (screen === "home") {
    return (
      <HomeMenuScreen
        onPlaySinglePlayer={() => setScreen("regions")}
        onOpenMultiplayer={() => {
          // coming soon
        }}
        onOpenProfile={() => setScreen("profile")}
        onOpenShop={() => setScreen("shop")}
      />
    );
  }

  if (screen === "regions") {
    return (
      <RegionSelectScreen
        regions={regions}
        onSelectRegion={handleSelectRegion}
        onBackToHome={() => setScreen("home")}
      />
    );
  }

  if (screen === "auth") {
    return (
      <AuthScreen
        onLinked={async (userId) => {
          await linkGuestProfileToAuthUser(userId);
          setScreen("profile");
        }}
        onBack={() => setScreen("profile")}
      />
    );
  }

  if (screen === "profile") {
    const xpToNextLevel = profile.level * 100;
    return (
      <ProfileScreen
        profile={profile}
        xpToNextLevel={xpToNextLevel}
        isSignedIn={!!authUserId}
        onOpenAuth={() => setScreen("auth")}
        onLogout={handleLogout}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (loadingProgress) {
    return (
      <RegionSelectScreen
        regions={regions}
        onSelectRegion={handleSelectRegion}
        onBackToHome={() => setScreen("home")}
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
        onBuyHeart={handleBuyHeart}
        onBack={() => setScreen("home")}
      />
    );
  }

  if (screen === "venues") {
    if (!selectedRegionId) {
      return (
        <RegionSelectScreen
          regions={regions}
          onSelectRegion={handleSelectRegion}
          onBackToHome={() => setScreen("home")}
        />
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);
    const venue = getVenueById(selectedVenueId);
    const levelsWithStatus = getLevelsForVenueWithStatus(selectedVenueId);

    if (!venue) {
      return (
        <VenueSelectScreen
          venues={venuesForRegion}
          onSelectVenue={handleSelectVenue}
          onOpenShop={() => setScreen("shop")}
          onRefillHearts={handleRefillHeartsDebug}
          onBackToHome={() => setScreen("home")}
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

  if (screen === "locked" && lockedLevelInfo) {
    return (
      <LockedLevelScreen
        venueName={lockedLevelInfo.venueName}
        levelNumber={lockedLevelInfo.levelNumber}
        requiredLevelNumber={lockedLevelInfo.requiredLevelNumber}
        onBack={() => {
          setScreen("levels");
          setLockedLevelInfo(null);
        }}
      />
    );
  }

  if (screen === "levels") {
    if (!selectedRegionId) {
      return (
        <RegionSelectScreen
          regions={regions}
          onSelectRegion={handleSelectRegion}
          onBackToHome={() => setScreen("home")}
        />
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);
    const venue = getVenueById(selectedVenueId);
    const levelsWithStatus = getLevelsForVenueWithStatus(selectedVenueId);

    if (!venue) {
      return (
        <VenueSelectScreen
          venues={venuesForRegion}
          onSelectVenue={handleSelectVenue}
          onOpenShop={() => setScreen("shop")}
          onRefillHearts={handleRefillHeartsDebug}
          onBackToHome={() => setScreen("home")}
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
    if (!selectedRegionId) {
      return (
        <RegionSelectScreen
          regions={regions}
          onSelectRegion={handleSelectRegion}
          onBackToHome={() => setScreen("home")}
        />
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);

    return (
      <VenueSelectScreen
        venues={venuesForRegion}
        onSelectVenue={handleSelectVenue}
        onOpenShop={() => setScreen("shop")}
        onRefillHearts={handleRefillHeartsDebug}
        onBackToHome={() => setScreen("home")}
      />
    );
  }

  const currentLevel = getLevelById(selectedLevelId);
  const currentVenue = getVenueById(currentLevel?.venueId ?? null);

  if (!currentLevel || !currentVenue) {
    if (!selectedRegionId) {
      return (
        <RegionSelectScreen
          regions={regions}
          onSelectRegion={handleSelectRegion}
          onBackToHome={() => setScreen("home")}
        />
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);

    return (
      <VenueSelectScreen
        venues={venuesForRegion}
        onSelectVenue={handleSelectVenue}
        onOpenShop={() => setScreen("shop")}
        onRefillHearts={handleRefillHeartsDebug}
        onBackToHome={() => setScreen("home")}
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
