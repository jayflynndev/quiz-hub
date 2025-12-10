// App.tsx
import * as React from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type {
  GameSession,
  LevelId,
  PlayerProgress,
  LifelineType,
  LevelConfig,
  PlayerProfile,
  DailyChallenge,
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
import { ProfileStatsScreen } from "./src/screens/ProfileStatsScreen";
import { RegionSelectScreen } from "./src/screens/RegionSelectScreen";
import { AuthScreen } from "./src/screens/AuthScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { StreakRewardsScreen } from "./src/screens/StreakRewardsScreen";

import { DailyChallengesScreen } from "./src/screens/DailyChallengesScreen";
import { ChallengeGameScreen } from "./src/screens/ChallengeGameScreen";
import { ReturningPlayerScreen } from "./src/screens/ReturningPlayerScreen";

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
import { useSound } from "./src/hooks/useSound";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { ToastProvider, useToast } from "./src/contexts/ToastContext";
import {
  AchievementProvider,
  useAchievements,
} from "./src/contexts/AchievementContext";
import { SettingsProvider } from "./src/contexts/SettingsContext";
import { ToastContainer } from "./src/ui/Toast";

type Screen =
  | "splash"
  | "returning_player"
  | "home"
  | "regions"
  | "venues"
  | "levels"
  | "playing"
  | "shop"
  | "profile_stats"
  | "out_of_hearts"
  | "locked"
  | "auth"
  | "settings"
  | "streak_rewards"
  | "daily_challenges"
  | "challenge_playing";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "#020014" }}>
        <ThemeProvider>
          <SettingsProvider>
            <ToastProvider>
              <AchievementProvider>
                <AppContent />
              </AchievementProvider>
            </ToastProvider>
          </SettingsProvider>
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [screen, setScreen] = React.useState<Screen>("splash");
  const [currentChallenge, setCurrentChallenge] =
    React.useState<DailyChallenge | null>(null);

  // Challenge tracking state
  const [challengeStartTime, setChallengeStartTime] = React.useState<
    number | null
  >(null);
  const [challengeAnswers, setChallengeAnswers] = React.useState<boolean[]>([]);
  const [currentStreak, setCurrentStreak] = React.useState<number>(0);
  const [maxStreak, setMaxStreak] = React.useState<number>(0);
  const [totalTimeSpent, setTotalTimeSpent] = React.useState<number>(0);
  const [challengeSession, setChallengeSession] =
    React.useState<GameSession | null>(null);

  const { toasts, showToast, hideToast } = useToast();
  const { checkAndUnlockAchievement, getAchievementProgress } =
    useAchievements();
  const { playCorrectSound, playIncorrectSound, playLevelCompleteSound } =
    useSound();

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

  // Check for daily login bonuses when profile is ready
  React.useEffect(() => {
    if (!profileReady) return;

    const checkDailyLoginBonus = async () => {
      const { newDailyStreak, newLastActiveAt } = computeUpdatedStreak(profile);

      if (newDailyStreak !== profile.dailyStreak) {
        // User has logged in on a new day, award daily bonus
        const { getStreakRewardForDay } = await import(
          "./src/data/streakRewards"
        );
        const dailyBonus = getStreakRewardForDay(newDailyStreak);

        const updatedProfile = {
          ...profile,
          dailyStreak: newDailyStreak,
          lastActiveAt: newLastActiveAt,
          coins: profile.coins + dailyBonus.coins,
          xp: profile.xp + dailyBonus.xp,
        };

        await saveProfile(updatedProfile);

        if (dailyBonus.xp > 0 || dailyBonus.coins > 0) {
          showToast(
            `Daily login bonus: +${dailyBonus.xp} XP, +${dailyBonus.coins} coins! 🔥`,
            "success",
            5000
          );
        }
      }
    };

    checkDailyLoginBonus();
  }, [profileReady, profile, saveProfile, showToast]);

  // Check progress achievements when profile changes
  React.useEffect(() => {
    if (!profileReady) return;

    // Check coin-based achievements
    if (profile.coins >= 1000) {
      checkAndUnlockAchievement("coin_collector");
    }
    if (profile.coins >= 5000) {
      checkAndUnlockAchievement("millionaire");
      checkAndUnlockAchievement("wealthy_wizard");
    }

    // Check XP-based achievements
    if (profile.xp >= 1000) {
      checkAndUnlockAchievement("xp_explorer");
    }
    if (profile.xp >= 5000) {
      checkAndUnlockAchievement("xp_grinder");
      checkAndUnlockAchievement("xp_master");
    }

    // Check level-based achievements
    if (profile.level >= 5) {
      checkAndUnlockAchievement("level_up");
    }
    if (profile.level >= 25) {
      checkAndUnlockAchievement("ultimate_player");
    }

    // Check heart-based achievements
    if (profile.hearts >= 10) {
      checkAndUnlockAchievement("heart_hoarder");
    }

    // Check daily streak achievements
    if (profile.dailyStreak >= 7) {
      checkAndUnlockAchievement("week_warrior");
      checkAndUnlockAchievement("quiz_addict"); // Same as week_warrior
    }
    if (profile.dailyStreak >= 30) {
      checkAndUnlockAchievement("month_master");
    }
  }, [profileReady, profile, checkAndUnlockAchievement]);

  // Determine if user should see returning player screen
  const shouldShowReturningPlayer = React.useMemo(() => {
    if (!profileReady || !profile.lastActiveAt) return false;

    // Show if user has completed at least one level and has been away for more than 1 day
    const hasPlayedBefore = progress.completedLevelIds.length > 0;
    const lastActive = new Date(profile.lastActiveAt);
    const now = new Date();
    const daysSinceLastActive = Math.floor(
      (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    return hasPlayedBefore && daysSinceLastActive >= 1;
  }, [profileReady, profile.lastActiveAt, progress.completedLevelIds.length]);

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
    buyShopItem,
    handleBuyAskQuizzersUpgrade,
    handleBuyFiftyFiftyUpgrade,
    handleBuyHeart,
    getPurchaseHistory,
    restorePurchases,
  } = useShopHandlers({ profile, saveProfile, checkAndUnlockAchievement });

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
        playCorrectSound();
        showToast("Correct! 🎉", "success", 1500);
      } else {
        playIncorrectSound();
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
      // Check achievements
      checkAndUnlockAchievement("first_win"); // First level completion
      checkAndUnlockAchievement(
        "quiz_master",
        getAchievementProgress("quiz_master") + 1
      ); // Progress towards 10 levels

      if (accuracy === 1) {
        checkAndUnlockAchievement("perfect_score"); // 100% accuracy
      }

      // Check speed achievements
      const avgTime =
        updated.answers.reduce((sum, a) => sum + a.timeTakenMs, 0) /
        updated.answers.length;
      if (avgTime <= 3000) {
        // Average under 3 seconds per question
        checkAndUnlockAchievement("speed_demon");
      }

      // Check lifeline achievements
      if (updated.usedLifelines.length === 0) {
        checkAndUnlockAchievement("lifeline_avoider");
        checkAndUnlockAchievement("self_made"); // Complete level without lifelines
      }

      // Check survivor achievement (complete level with 1 heart remaining)
      if (profile.hearts === 1) {
        checkAndUnlockAchievement("survivor");
      }

      // Check comeback kid achievement (wrong on first question but completed level)
      const firstAnswer = updated.answers[0];
      if (firstAnswer && !firstAnswer.correct && updated.status === "passed") {
        checkAndUnlockAchievement("comeback_kid");
      }

      // Check combo king achievement (3 perfect scores in a row)
      if (accuracy === 1) {
        const perfectScoreProgress = getAchievementProgress("combo_king") + 1;
        checkAndUnlockAchievement("combo_king", perfectScoreProgress);
      } else {
        // Reset combo progress if not a perfect score
        // Note: We don't call checkAndUnlockAchievement with 0 here as it would create progress
        // The progress will naturally reset when not incremented
      }

      // Check streak achievements
      const currentStreak = profile.dailyStreak;
      if (currentStreak >= 7) {
        checkAndUnlockAchievement("week_warrior");
      }
      if (currentStreak >= 30) {
        checkAndUnlockAchievement("month_master");
      }

      // Check level achievements
      if (level.levelNumber >= 10) {
        checkAndUnlockAchievement("level_legend");
      }

      // Check venue achievements
      const venueId = level.venueId;
      const venueLevels = getOrderedVenueLevels(venueId);
      const completedVenueLevels =
        venueLevels.filter((level) =>
          progress.completedLevelIds.includes(level.id)
        ).length + 1; // +1 for current completion

      if (completedVenueLevels >= venueLevels.length) {
        checkAndUnlockAchievement("venue_master");
      }

      // Track unique venues completed
      const uniqueVenues = new Set(
        progress.completedLevelIds
          .map((levelId) => {
            const level = getLevelById(levelId);
            return level?.venueId;
          })
          .filter(Boolean)
      );
      if (uniqueVenues.size >= 3) {
        checkAndUnlockAchievement("venue_explorer");
      }

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
        // Check level up achievement
        checkAndUnlockAchievement("level_up");

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

      // Check coin/XP achievements after profile update
      if (newCoins >= 1000) {
        checkAndUnlockAchievement("coin_collector");
      }
      if (newCoins >= 5000) {
        checkAndUnlockAchievement("wealthy_wizard");
      }

      if (newXP >= 1000) {
        checkAndUnlockAchievement("xp_explorer");
      }
      if (newXP >= 5000) {
        checkAndUnlockAchievement("xp_master");
      }

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

      playLevelCompleteSound();
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

      // Check failure-related achievements
      const failedAttempts = getAchievementProgress("resilient_player") + 1;
      checkAndUnlockAchievement("resilient_player", failedAttempts);

      if (heartsAfterFail === 0) {
        checkAndUnlockAchievement("heart_breaker");
      }

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
    checkAndUnlockAchievement,
    profileHearts: profile.hearts,
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

    // Check lifeline usage achievements
    const totalLifelinesUsed = updatedSession.usedLifelines.length;
    if (totalLifelinesUsed >= 50) {
      checkAndUnlockAchievement("lifeline_lover");
    }

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

  // Challenge handlers
  const handleChallengeAnswer = React.useCallback(
    (optionId: string, timeTaken: number) => {
      if (!currentChallenge || challengeStartTime === null) return;

      // Get the current question to check if answer is correct
      const currentQuestionIndex = challengeSession?.currentQuestionIndex || 0;
      const questionId = currentChallenge.questionIds[currentQuestionIndex];
      const question = getCurrentQuestion({
        currentQuestionIndex,
        questionIds: currentChallenge.questionIds,
      } as any);

      if (!question) return;

      const isCorrect = optionId === question.correctOptionId;

      // Update tracking state
      const newAnswers = [...challengeAnswers, isCorrect];
      setChallengeAnswers(newAnswers);
      setTotalTimeSpent((prev) => prev + timeTaken);

      // Update streak
      if (isCorrect) {
        setCurrentStreak((prev) => {
          const newStreak = prev + 1;
          setMaxStreak((maxPrev) => Math.max(maxPrev, newStreak));
          return newStreak;
        });
      } else {
        setCurrentStreak(0);
      }

      // Check if challenge is completed
      const totalQuestions = currentChallenge.questionCount;
      const questionsAnswered = newAnswers.length;
      const isLastQuestion = questionsAnswered === totalQuestions;

      // Update challenge session
      setChallengeSession((prev) => {
        if (!prev) return prev;
        const playerAnswer = {
          questionId,
          chosenOptionId: optionId,
          correct: isCorrect,
          timeTakenMs: timeTaken,
        };
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
          answers: [...prev.answers, playerAnswer],
          correctCount: prev.correctCount + (isCorrect ? 1 : 0),
          score: prev.score + (isCorrect ? 10 : 0), // Simple scoring
        };
      });

      // For perfect_accuracy challenges, fail immediately on wrong answer
      if (currentChallenge.type === "perfect_accuracy" && !isCorrect) {
        // Record failure and lock for 24 hours
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        const lockedUntil = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(); // 24 hours from now

        const failureRecord = {
          challengeId: currentChallenge.id,
          date: today,
          completed: false,
          failed: true,
          lockedUntil,
          completedAt: new Date().toISOString(),
        };

        const updatedProgress = [
          ...profile.dailyChallengeProgress,
          failureRecord,
        ];

        // Update profile with challenge failure
        saveProfile({
          ...profile,
          dailyChallengeProgress: updatedProgress,
        });

        showToast(
          "Perfect accuracy challenge failed! You got a question wrong. 💪",
          "warning"
        );
        setTimeout(() => {
          setScreen("daily_challenges");
          setCurrentChallenge(null);
          // Reset challenge state
          setChallengeStartTime(null);
          setChallengeAnswers([]);
          setCurrentStreak(0);
          setMaxStreak(0);
          setTotalTimeSpent(0);
          setChallengeSession(null);
        }, 2000);
        return;
      }

      if (!isLastQuestion) {
        // Challenge continues - advance to next question
        return;
      }

      // All questions answered - check completion conditions
      let challengeCompleted = false;
      let finalScore = 0;
      let finalAccuracy = 0;

      switch (currentChallenge.type) {
        case "speed_run":
          // Must complete all questions within time limit
          challengeCompleted =
            totalTimeSpent <= (currentChallenge.timeLimitSeconds || 0) * 1000;
          finalScore = challengeCompleted
            ? Math.max(
                0,
                (currentChallenge.timeLimitSeconds || 0) * 1000 - totalTimeSpent
              )
            : 0;
          break;

        case "perfect_accuracy":
          // Must get target accuracy or higher
          finalAccuracy = newAnswers.filter(Boolean).length / newAnswers.length;
          challengeCompleted =
            finalAccuracy >= (currentChallenge.targetAccuracy || 1.0);
          finalScore = Math.round(finalAccuracy * 100);
          break;

        case "streak_master":
          // Must achieve target streak
          challengeCompleted =
            maxStreak >= (currentChallenge.targetStreak || 0);
          finalScore = maxStreak;
          break;

        default:
          // Default: complete if all questions answered
          challengeCompleted = true;
          finalAccuracy = newAnswers.filter(Boolean).length / newAnswers.length;
          finalScore = Math.round(finalAccuracy * 100);
      }

      if (!challengeCompleted) {
        // Challenge failed - record failure and lock for 24 hours
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
        const lockedUntil = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ).toISOString(); // 24 hours from now

        const failureRecord = {
          challengeId: currentChallenge.id,
          date: today,
          completed: false,
          failed: true,
          lockedUntil,
          completedAt: new Date().toISOString(),
        };

        const updatedProgress = [
          ...profile.dailyChallengeProgress,
          failureRecord,
        ];

        // Update profile with challenge failure
        saveProfile({
          ...profile,
          dailyChallengeProgress: updatedProgress,
        });

        showToast("Challenge failed! Try again tomorrow. 💪", "warning");
        setTimeout(() => {
          setScreen("daily_challenges");
          setCurrentChallenge(null);
          // Reset challenge state
          setChallengeStartTime(null);
          setChallengeAnswers([]);
          setCurrentStreak(0);
          setMaxStreak(0);
          setTotalTimeSpent(0);
          setChallengeSession(null);
        }, 2000);
        return;
      }

      // Challenge completed successfully!
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const completionRecord = {
        challengeId: currentChallenge.id,
        date: today,
        completed: true,
        failed: false,
        score: finalScore,
        accuracy: finalAccuracy,
        timeTakenSeconds: totalTimeSpent / 1000,
        completedAt: new Date().toISOString(),
      };

      const updatedProgress = [
        ...profile.dailyChallengeProgress,
        completionRecord,
      ];

      // Update profile with challenge completion
      saveProfile({
        ...profile,
        dailyChallengeProgress: updatedProgress,
        xp: profile.xp + currentChallenge.rewards.xp,
        coins: profile.coins + currentChallenge.rewards.coins,
        hearts: Math.min(
          MAX_HEARTS,
          profile.hearts + (currentChallenge.rewards.bonusHearts || 0)
        ),
      });

      // Check achievements
      checkAndUnlockAchievement("daily_warrior"); // First challenge completion
      const totalChallengesCompleted = updatedProgress.length;
      checkAndUnlockAchievement("challenge_master", totalChallengesCompleted);

      // Check challenge-specific achievements
      if (currentChallenge.type === "speed_run") {
        const speedRunsCompleted = updatedProgress.filter(
          (p) => p.challengeId.includes("speed_run") && p.completed
        ).length;
        checkAndUnlockAchievement("speed_runner", speedRunsCompleted);
      } else if (currentChallenge.type === "perfect_accuracy") {
        const perfectChallengesCompleted = updatedProgress.filter(
          (p) => p.challengeId.includes("perfect_accuracy") && p.completed
        ).length;
        checkAndUnlockAchievement("perfectionist", perfectChallengesCompleted);
      }

      showToast(
        `Challenge completed! +${currentChallenge.rewards.xp} XP, +${currentChallenge.rewards.coins} coins! 🎉`,
        "success"
      );

      setTimeout(() => {
        setScreen("daily_challenges");
        setCurrentChallenge(null);
        // Reset challenge state
        setChallengeStartTime(null);
        setChallengeAnswers([]);
        setCurrentStreak(0);
        setMaxStreak(0);
        setTotalTimeSpent(0);
        setChallengeSession(null);
      }, 2000);
    },
    [
      currentChallenge,
      challengeStartTime,
      challengeAnswers,
      totalTimeSpent,
      currentStreak,
      maxStreak,
      challengeSession,
      profile,
      saveProfile,
      checkAndUnlockAchievement,
      showToast,
    ]
  );

  const handleChallengeLifeline = React.useCallback(
    (lifelineType: LifelineType) => {
      showToast(`${lifelineType} used! 💪`, "info");
      // TODO: Implement lifeline logic for challenges
    },
    [showToast]
  );

  const handleChallengeTimeExpired = React.useCallback(() => {
    if (!currentChallenge) return;

    // For speed run challenges, time expiration means failure
    if (currentChallenge.type === "speed_run") {
      // Record failure and lock for 24 hours
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const lockedUntil = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ).toISOString(); // 24 hours from now

      const failureRecord = {
        challengeId: currentChallenge.id,
        date: today,
        completed: false,
        failed: true,
        lockedUntil,
        completedAt: new Date().toISOString(),
      };

      const updatedProgress = [
        ...profile.dailyChallengeProgress,
        failureRecord,
      ];

      // Update profile with challenge failure
      saveProfile({
        ...profile,
        dailyChallengeProgress: updatedProgress,
      });

      showToast("Time's up! Speed run challenge failed. ⏰", "warning");
      setTimeout(() => {
        setScreen("daily_challenges");
        setCurrentChallenge(null);
        // Reset challenge state
        setChallengeStartTime(null);
        setChallengeAnswers([]);
        setCurrentStreak(0);
        setMaxStreak(0);
        setTotalTimeSpent(0);
        setChallengeSession(null);
      }, 1000);
      return;
    }

    // For other challenges, treat as wrong answer
    handleChallengeAnswer("", 15000); // 15 seconds as time taken for wrong answer
  }, [currentChallenge, showToast, handleChallengeAnswer]);

  const handleSelectVenue = (venueId: string) => {
    setSelectedVenueId(venueId);
    setSelectedLevelId(null);
    setScreen("levels");
  };

  // --- RENDER ---

  if (screen === "splash") {
    return (
      <SplashScreen
        onFinish={() =>
          setScreen(shouldShowReturningPlayer ? "returning_player" : "home")
        }
      />
    );
  }

  if (screen === "returning_player") {
    return (
      <ReturningPlayerScreen
        onContinue={() => setScreen("home")}
        profile={profile}
        progress={progress}
        onProfileUpdate={saveProfile}
      />
    );
  }

  if (screen === "home") {
    return (
      <>
        <HomeMenuScreen
          onPlaySinglePlayer={() => setScreen("regions")}
          onOpenProfile={() => setScreen("profile_stats")}
          onOpenShop={() => setScreen("shop")}
          onOpenSettings={() => setScreen("settings")}
          onOpenStreakRewards={() => setScreen("streak_rewards")}
          onOpenDailyChallenges={() => setScreen("daily_challenges")}
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
            setScreen("profile_stats");
          }}
          onBack={() => setScreen("profile_stats")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "profile_stats") {
    const xpToNextLevel = profile.level * 100;
    return (
      <>
        <ProfileStatsScreen
          profile={profile}
          progress={progress}
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

  if (screen === "streak_rewards") {
    return (
      <>
        <StreakRewardsScreen
          profile={profile}
          onBack={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "daily_challenges") {
    return (
      <>
        <DailyChallengesScreen
          profile={profile}
          onStartChallenge={(challenge) => {
            setCurrentChallenge(challenge);
            // Reset challenge tracking state
            setChallengeStartTime(Date.now());
            setChallengeAnswers([]);
            setCurrentStreak(0);
            setMaxStreak(0);
            setTotalTimeSpent(0);

            // Create challenge session
            const newSession: GameSession = {
              id: `challenge_${challenge.id}_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              levelId: `challenge_${challenge.id}`,
              questionIds: challenge.questionIds,
              currentQuestionIndex: 0,
              score: 0,
              livesRemaining: 3,
              usedLifelines: [],
              answers: [],
              startedAt: Date.now(),
              status: "in_progress",
              correctCount: 0,
            };
            setChallengeSession(newSession);

            setScreen("challenge_playing");
          }}
          onBack={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "challenge_playing") {
    if (!currentChallenge || !challengeSession) {
      // Fallback if no challenge is set
      setScreen("daily_challenges");
      return null;
    }

    return (
      <>
        <ChallengeGameScreen
          session={challengeSession}
          challenge={currentChallenge}
          onAnswer={handleChallengeAnswer}
          onUseLifeline={handleChallengeLifeline}
          onTimeExpired={handleChallengeTimeExpired}
          onBack={() => setScreen("daily_challenges")}
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
          onBuyItem={buyShopItem}
          onRestorePurchases={restorePurchases}
          onBack={() => setScreen("home")}
        />
        <ToastContainer toasts={toasts} onHideToast={hideToast} />
      </>
    );
  }

  if (screen === "settings") {
    return (
      <>
        <SettingsScreen onBack={() => setScreen("home")} />
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
