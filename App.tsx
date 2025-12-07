// App.tsx
import * as React from "react";

import type {
  GameSession,
  LevelId,
  PlayerProgress,
  LifelineType,
  LevelConfig,
  PlayerProfile,
} from "./src/types/game";
import {
  createSessionForLevel,
  useLifeline,
  generateAudiencePoll,
  getCurrentQuestion,
  getLifelinesForLevel,
  LEVEL_UP_REWARDS,
} from "./src/engine/gameEngine";

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

import { useGameData } from "./src/hooks/useGameData";
import { useAnswerHandlers } from "./src/hooks/useAnswerHandlers";
import {
  usePlayerProfile,
  MAX_HEARTS,
  HEART_REGEN_MS,
} from "./src/hooks/usePlayerProfile";
import { useProgress } from "./src/hooks/useProgress";
import { useGameSession } from "./src/hooks/useGameSession";
import { computeUpdatedStreak } from "./src/hooks/streakUtils";
import { useShopHandlers } from "./src/hooks/useShopHandlers";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { ToastProvider, useToast } from "./src/contexts/ToastContext";
import { ToastContainer } from "./src/ui/Toast";

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

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const [screen, setScreen] = React.useState<Screen>("splash");
  const { toasts, showToast, hideToast } = useToast();

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

  const {
    progress,
    loadingProgress,
    saveProgress,
    getLevelStatus,
    getLevelsForVenueWithStatus,
  } = useProgress({ activeProfileId, profileReady });

  const {
    session,
    setSession,
    selectedOption,
    setSelectedOption,
    selectedLevelId,
    setSelectedLevelId,
    audiencePoll,
    setAudiencePoll,
    hiddenOptions,
    setHiddenOptions,
    askQuizzersRemaining,
    setAskQuizzersRemaining,
    usedAskQuizzersThisQuestion,
    setUsedAskQuizzersThisQuestion,
    fiftyFiftyRemaining,
    setFiftyFiftyRemaining,
    usedFiftyFiftyThisQuestion,
    setUsedFiftyFiftyThisQuestion,
    lastRewardSummary,
    setLastRewardSummary,
    lockedLevelInfo,
    setLockedLevelInfo,
    prepareSessionForLevel,
    initialiseLevelSession,
    resetForRestart,
    resetSessionForExit,
    applyUpdatedSessionForAnswer,
  } = useGameSession();

  const {
    regions,
    getVenuesForRegion,
    getLevelById,
    getVenueById,
    getOrderedVenueLevels,
  } = useGameData();

  const {
    handleBuyAskQuizzersUpgrade,
    handleBuyFiftyFiftyUpgrade,
    handleBuyHeart,
  } = useShopHandlers({ profile, saveProfile });

  const [lastAnswerTime] = React.useState(1500);
  const [selectedVenueId, setSelectedVenueId] = React.useState<string | null>(
    null
  );
  const [selectedRegionId, setSelectedRegionId] = React.useState<string | null>(
    null
  );
  const QUESTION_TIME_LIMIT_SECONDS = 10;

  // --- TIMER STATE (restored from last working version) ---
  const [timeLeft, setTimeLeft] = React.useState<number | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const clearQuestionTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimeLeft(null);
  }, []);

  const handleSelectRegion = (regionId: string) => {
    setSelectedRegionId(regionId);
    setSelectedVenueId(null);
    setSelectedLevelId(null);
    setScreen("venues");
  };

  const startLevel = (levelId: LevelId) => {
    const level = getLevelById(levelId);
    if (!level) return;

    const status = getLevelStatus(levelId);
    if (status === "locked") {
      const venue = getVenueById(selectedVenueId);
      const venueLevels = getOrderedVenueLevels(selectedVenueId);

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
    initialiseLevelSession(newSession, profile);

    clearQuestionTimer();
    setScreen("playing");
  };

  const applyAnswerOutcome = (updated: GameSession, level: LevelConfig) => {
    // Show toast for the last answer
    const lastAnswer = updated.answers[updated.answers.length - 1];
    if (lastAnswer) {
      if (lastAnswer.correct) {
        showToast("Correct! 🎉", "success", 1500);
      } else {
        showToast("Incorrect 😔", "error", 1500);
      }
    }

    // Update session + clear per-question state, then stop timer
    applyUpdatedSessionForAnswer(updated);
    clearQuestionTimer();

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

      showToast(`Level ${level.levelNumber} completed! 🏆`, "success", 3000);
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

      showToast("Level failed. Try again! 💪", "warning", 3000);
    }
  };

  const { handleAnswer, handleTimeExpired } = useAnswerHandlers({
    session,
    selectedLevelId,
    selectedOption,
    setSelectedOption,
    lastAnswerTime,
    questionTimeLimitSeconds: QUESTION_TIME_LIMIT_SECONDS,
    getLevelById,
    onAnswerOutcome: applyAnswerOutcome,
  });

  // --- TIMER EFFECT (restored behaviour) ---
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
    // NOTE: we intentionally do NOT include handleTimeExpired
    // in the dependency array, to mirror the last working version.
    return () => {
      clearQuestionTimer();
    };
  }, [
    screen,
    session?.currentQuestionIndex,
    session?.status,
    clearQuestionTimer,
  ]);

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

    // Reset per-run state, then start the level again
    prepareSessionForLevel(profile);
    resetForRestart(profile);
    clearQuestionTimer();
    startLevel(selectedLevelId);
  };

  const handleBackToLevels = () => {
    resetSessionForExit();
    clearQuestionTimer();
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
      <>
        <HomeMenuScreen
          onPlaySinglePlayer={() => setScreen("regions")}
          onOpenMultiplayer={() => {
            // coming soon
          }}
          onOpenProfile={() => setScreen("profile")}
          onOpenShop={() => setScreen("shop")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "regions") {
    return (
      <>
        <RegionSelectScreen
          regions={regions}
          onSelectRegion={handleSelectRegion}
          onBackToHome={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "auth") {
    return (
      <>
        <AuthScreen
          onLinked={async (userId) => {
            await linkGuestProfileToAuthUser(userId);
            setScreen("profile");
          }}
          onBack={() => setScreen("profile")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "profile") {
    const xpToNextLevel = profile.level * 100;
    return (
      <>
        <ProfileScreen
          profile={profile}
          xpToNextLevel={xpToNextLevel}
          isSignedIn={!!authUserId}
          onOpenAuth={() => setScreen("auth")}
          onLogout={handleLogout}
          onBack={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
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
      <>
        <OutOfHeartsScreen
          hearts={profile.hearts}
          maxHearts={MAX_HEARTS}
          lastHeartUpdateAt={profile.lastHeartUpdateAt}
          heartRegenMs={HEART_REGEN_MS}
          onGoToShop={() => setScreen("shop")}
          onBackToVenues={() => setScreen("venues")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "shop") {
    return (
      <>
        <ShopScreen
          profile={profile}
          onBuyAskQuizzersUpgrade={handleBuyAskQuizzersUpgrade}
          onBuyFiftyFiftyUpgrade={handleBuyFiftyFiftyUpgrade}
          onBuyHeart={handleBuyHeart}
          onBack={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "venues") {
    if (!selectedRegionId) {
      return (
        <>
          <RegionSelectScreen
            regions={regions}
            onSelectRegion={handleSelectRegion}
            onBackToHome={() => setScreen("home")}
          />
          <ToastContainer toasts={toasts} onHideToast={hideToast} />
        </>
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);
    const venue = getVenueById(selectedVenueId);
    const levelsWithStatus = getLevelsForVenueWithStatus(selectedVenueId);

    if (!venue) {
      return (
        <>
          <VenueSelectScreen
            venues={venuesForRegion}
            onSelectVenue={handleSelectVenue}
            onOpenShop={() => setScreen("shop")}
            onRefillHearts={handleRefillHeartsDebug}
            onBackToHome={() => setScreen("home")}
          />
          <ToastContainer toasts={toasts} onHideToast={hideToast} />
        </>
      );
    }

    return (
      <>
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
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "locked" && lockedLevelInfo) {
    return (
      <>
        <LockedLevelScreen
          venueName={lockedLevelInfo.venueName}
          levelNumber={lockedLevelInfo.levelNumber}
          requiredLevelNumber={lockedLevelInfo.requiredLevelNumber}
          onBack={() => {
            setScreen("levels");
            setLockedLevelInfo(null);
          }}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "levels") {
    if (!selectedRegionId) {
      return (
        <>
          <RegionSelectScreen
            regions={regions}
            onSelectRegion={handleSelectRegion}
            onBackToHome={() => setScreen("home")}
          />
          <ToastContainer toasts={toasts} onHideToast={hideToast} />
        </>
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);
    const venue = getVenueById(selectedVenueId);
    const levelsWithStatus = getLevelsForVenueWithStatus(selectedVenueId);

    if (!venue) {
      return (
        <>
          <VenueSelectScreen
            venues={venuesForRegion}
            onSelectVenue={handleSelectVenue}
            onOpenShop={() => setScreen("shop")}
            onRefillHearts={handleRefillHeartsDebug}
            onBackToHome={() => setScreen("home")}
          />
          <ToastContainer toasts={toasts} onHideToast={hideToast} />
        </>
      );
    }

    return (
      <>
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
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  // playing
  if (!session || !selectedLevelId) {
    if (!selectedRegionId) {
      return (
        <>
          <RegionSelectScreen
            regions={regions}
            onSelectRegion={handleSelectRegion}
            onBackToHome={() => setScreen("home")}
          />
          <ToastContainer toasts={toasts} onHideToast={hideToast} />
        </>
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);

    return (
      <>
        <VenueSelectScreen
          venues={venuesForRegion}
          onSelectVenue={handleSelectVenue}
          onOpenShop={() => setScreen("shop")}
          onRefillHearts={handleRefillHeartsDebug}
          onBackToHome={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  const currentLevel = getLevelById(selectedLevelId);
  const currentVenue = getVenueById(currentLevel?.venueId ?? null);

  if (!currentLevel || !currentVenue) {
    if (!selectedRegionId) {
      return (
        <>
          <RegionSelectScreen
            regions={regions}
            onSelectRegion={handleSelectRegion}
            onBackToHome={() => setScreen("home")}
          />
          <ToastContainer toasts={toasts} onHideToast={hideToast} />
        </>
      );
    }

    const venuesForRegion = getVenuesForRegion(selectedRegionId);

    return (
      <>
        <VenueSelectScreen
          venues={venuesForRegion}
          onSelectVenue={handleSelectVenue}
          onOpenShop={() => setScreen("shop")}
          onRefillHearts={handleRefillHeartsDebug}
          onBackToHome={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  const lifelinesAllowed = getLifelinesForLevel(currentLevel);
  const xpToNextLevel = profile.level * 100;

  return (
    <>
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
      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </>
  );
}
