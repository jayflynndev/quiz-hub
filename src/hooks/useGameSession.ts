// src/hooks/useGameSession.ts
import * as React from "react";
import type {
  GameSession,
  LevelId,
  RewardSummary,
  PlayerProfile,
} from "../types/game";

export interface UseGameSessionResult {
  session: GameSession | null;
  setSession: React.Dispatch<React.SetStateAction<GameSession | null>>;

  selectedOption: string | null;
  setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;

  selectedLevelId: LevelId | null;
  setSelectedLevelId: React.Dispatch<React.SetStateAction<LevelId | null>>;

  audiencePoll: Record<string, number> | null;
  setAudiencePoll: React.Dispatch<
    React.SetStateAction<Record<string, number> | null>
  >;

  hiddenOptions: string[];
  setHiddenOptions: React.Dispatch<React.SetStateAction<string[]>>;

  askQuizzersRemaining: number;
  setAskQuizzersRemaining: React.Dispatch<React.SetStateAction<number>>;

  usedAskQuizzersThisQuestion: boolean;
  setUsedAskQuizzersThisQuestion: React.Dispatch<React.SetStateAction<boolean>>;

  fiftyFiftyRemaining: number;
  setFiftyFiftyRemaining: React.Dispatch<React.SetStateAction<number>>;

  usedFiftyFiftyThisQuestion: boolean;
  setUsedFiftyFiftyThisQuestion: React.Dispatch<React.SetStateAction<boolean>>;

  lastRewardSummary: RewardSummary | null;
  setLastRewardSummary: React.Dispatch<
    React.SetStateAction<RewardSummary | null>
  >;

  lockedLevelInfo: {
    venueName: string;
    levelNumber: number;
    requiredLevelNumber: number;
  } | null;
  setLockedLevelInfo: React.Dispatch<
    React.SetStateAction<{
      venueName: string;
      levelNumber: number;
      requiredLevelNumber: number;
    } | null>
  >;

  resetSessionForExit: () => void;

  // Per-run/session helpers
  prepareSessionForLevel: (profile: PlayerProfile) => void;
  initialiseLevelSession: (
    newSession: GameSession,
    profile: PlayerProfile
  ) => void;
  resetForRestart: (profile: PlayerProfile) => void;

  applyUpdatedSessionForAnswer: (updated: GameSession) => void;
}

export const useGameSession = (): UseGameSessionResult => {
  const [session, setSession] = React.useState<GameSession | null>(null);
  const [selectedOption, setSelectedOption] = React.useState<string | null>(
    null
  );
  const [selectedLevelId, setSelectedLevelId] = React.useState<LevelId | null>(
    null
  );

  const [audiencePoll, setAudiencePoll] = React.useState<Record<
    string,
    number
  > | null>(null);
  const [hiddenOptions, setHiddenOptions] = React.useState<string[]>([]);

  const [askQuizzersRemaining, setAskQuizzersRemaining] =
    React.useState<number>(3);
  const [usedAskQuizzersThisQuestion, setUsedAskQuizzersThisQuestion] =
    React.useState<boolean>(false);

  const [fiftyFiftyRemaining, setFiftyFiftyRemaining] =
    React.useState<number>(1);
  const [usedFiftyFiftyThisQuestion, setUsedFiftyFiftyThisQuestion] =
    React.useState<boolean>(false);

  const [lastRewardSummary, setLastRewardSummary] =
    React.useState<RewardSummary | null>(null);

  const [lockedLevelInfo, setLockedLevelInfo] = React.useState<{
    venueName: string;
    levelNumber: number;
    requiredLevelNumber: number;
  } | null>(null);

  // Centralised reset for starting/restarting a level run
  const prepareSessionForLevel = React.useCallback((profile: PlayerProfile) => {
    // Clear any previously selected option
    setSelectedOption(null);

    // Reset Ask Quizzers usage for this run
    setAskQuizzersRemaining(profile.askQuizzersOwned);
    setUsedAskQuizzersThisQuestion(false);
    setAudiencePoll(null);

    // Reset 50/50 usage for this run
    setFiftyFiftyRemaining(profile.fiftyFiftyOwned);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);

    // Clear last reward summary so the next run starts fresh
    setLastRewardSummary(null);
  }, []);

  const initialiseLevelSession = React.useCallback(
    (newSession: GameSession, profile: PlayerProfile) => {
      setSession(newSession);
      setSelectedOption(null);

      setAskQuizzersRemaining(profile.askQuizzersOwned);
      setUsedAskQuizzersThisQuestion(false);
      setAudiencePoll(null);

      setFiftyFiftyRemaining(profile.fiftyFiftyOwned);
      setUsedFiftyFiftyThisQuestion(false);
      setHiddenOptions([]);
    },
    []
  );

  const resetForRestart = React.useCallback((profile: PlayerProfile) => {
    setLastRewardSummary(null);
    setAudiencePoll(null);

    setAskQuizzersRemaining(profile.askQuizzersOwned);
    setUsedAskQuizzersThisQuestion(false);

    setFiftyFiftyRemaining(profile.fiftyFiftyOwned);
    setUsedFiftyFiftyThisQuestion(false);
    setHiddenOptions([]);
  }, []);

  const resetSessionForExit = React.useCallback(() => {
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
    // NOTE: we do NOT touch lockedLevelInfo here; that's for locked screens only
  }, []);

  const applyUpdatedSessionForAnswer = React.useCallback(
    (updated: GameSession) => {
      // Store the updated session, clear per-question UI state
      setSelectedOption(null);
      setSession(updated);

      setAudiencePoll(null);
      setUsedAskQuizzersThisQuestion(false);
      setUsedFiftyFiftyThisQuestion(false);
      setHiddenOptions([]);
      // Note: we do NOT touch lastRewardSummary here; that’s handled by outcome logic
    },
    []
  );

  return {
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
  };
};
