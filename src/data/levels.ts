// src/data/levels.ts
import type { LevelConfig, LifelineType } from "../types/game";

type LevelPattern = {
  minCorrectToPass: number;
  basePointsPerCorrect: number;
  maxSpeedBonusPerQuestion: number;
};

const STANDARD_LIFELINES: LifelineType[] = ["ASK_QUIZZERS", "FIFTY_FIFTY"];

// This defines the difficulty / scoring shape for levels 1–10
const STANDARD_LEVEL_PATTERN: LevelPattern[] = [
  // L1
  {
    minCorrectToPass: 3,
    basePointsPerCorrect: 100,
    maxSpeedBonusPerQuestion: 50,
  },
  // L2
  {
    minCorrectToPass: 3,
    basePointsPerCorrect: 100,
    maxSpeedBonusPerQuestion: 50,
  },
  // L3
  {
    minCorrectToPass: 4,
    basePointsPerCorrect: 110,
    maxSpeedBonusPerQuestion: 55,
  },
  // L4
  {
    minCorrectToPass: 4,
    basePointsPerCorrect: 110,
    maxSpeedBonusPerQuestion: 55,
  },
  // L5
  {
    minCorrectToPass: 4,
    basePointsPerCorrect: 120,
    maxSpeedBonusPerQuestion: 60,
  },
  // L6
  {
    minCorrectToPass: 5,
    basePointsPerCorrect: 120,
    maxSpeedBonusPerQuestion: 60,
  },
  // L7
  {
    minCorrectToPass: 5,
    basePointsPerCorrect: 130,
    maxSpeedBonusPerQuestion: 65,
  },
  // L8
  {
    minCorrectToPass: 5,
    basePointsPerCorrect: 130,
    maxSpeedBonusPerQuestion: 65,
  },
  // L9
  {
    minCorrectToPass: 6,
    basePointsPerCorrect: 140,
    maxSpeedBonusPerQuestion: 70,
  },
  // L10
  {
    minCorrectToPass: 6,
    basePointsPerCorrect: 150,
    maxSpeedBonusPerQuestion: 75,
  },
];

const createStandardLevelsForVenue = (
  venueId: string,
  baseIdPrefix: string
): LevelConfig[] => {
  return STANDARD_LEVEL_PATTERN.map((pattern, index) => {
    const levelNumber = index + 1;
    const id = `${baseIdPrefix}_${levelNumber}`;

    const level: LevelConfig = {
      id,
      venueId,
      levelNumber,
      type: "normal",
      minCorrectToPass: pattern.minCorrectToPass,
      lifelinesAllowed: STANDARD_LIFELINES,
      maxLifelinesPerLevel: 3,
      basePointsPerCorrect: pattern.basePointsPerCorrect,
      maxSpeedBonusPerQuestion: pattern.maxSpeedBonusPerQuestion,
      // No questionIds/questionPoolIds needed:
      // engine will pull from global difficulty-based pool.
    };

    return level;
  });
};

export const LEVELS: LevelConfig[] = [
  // UK Local Pub
  ...createStandardLevelsForVenue("uk_local_pub", "uk_pub"),
  // UK Village Hall
  ...createStandardLevelsForVenue("uk_village_hall", "uk_vh"),
];
