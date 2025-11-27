// src/data/levels.ts
import type { LevelConfig } from "../types/game";

export const LEVELS: LevelConfig[] = [
  // Local Pub – Level 1 (easy intro)
  {
    id: "uk_pub_1",
    venueId: "uk_local_pub",
    levelNumber: 1,
    type: "normal",
    questionIds: ["q_uk_pub_1_1", "q_uk_pub_1_2", "q_uk_pub_1_3"],
    minCorrectToPass: 2,
    lifelinesAllowed: ["ASK_QUIZZERS"],
    maxLifelinesPerLevel: 1,
    basePointsPerCorrect: 100,
    maxSpeedBonusPerQuestion: 50,
  },

  // Level 2 – still easy, introduces 4 questions
  {
    id: "uk_pub_2",
    venueId: "uk_local_pub",
    levelNumber: 2,
    type: "normal",
    questionIds: [
      "q_uk_pub_2_1",
      "q_uk_pub_2_2",
      "q_uk_pub_2_3",
      "q_uk_pub_2_4",
    ],
    minCorrectToPass: 3,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 100,
    maxSpeedBonusPerQuestion: 50,
  },

  // Level 3 – 4 questions, slightly higher pass bar
  {
    id: "uk_pub_3",
    venueId: "uk_local_pub",
    levelNumber: 3,
    type: "normal",
    questionIds: [
      "q_uk_pub_3_1",
      "q_uk_pub_3_2",
      "q_uk_pub_3_3",
      "q_uk_pub_3_4",
    ],
    minCorrectToPass: 3,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 110,
    maxSpeedBonusPerQuestion: 60,
  },

  // Level 4 – 5 questions, getting tougher
  {
    id: "uk_pub_4",
    venueId: "uk_local_pub",
    levelNumber: 4,
    type: "normal",
    questionIds: [
      "q_uk_pub_4_1",
      "q_uk_pub_4_2",
      "q_uk_pub_4_3",
      "q_uk_pub_4_4",
      "q_uk_pub_4_5",
    ],
    minCorrectToPass: 4,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 120,
    maxSpeedBonusPerQuestion: 70,
  },

  // Level 5 – 5 questions, “mini-boss” of the pub
  {
    id: "uk_pub_5",
    venueId: "uk_local_pub",
    levelNumber: 5,
    type: "normal",
    questionIds: [
      "q_uk_pub_5_1",
      "q_uk_pub_5_2",
      "q_uk_pub_5_3",
      "q_uk_pub_5_4",
      "q_uk_pub_5_5",
    ],
    minCorrectToPass: 4,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 130,
    maxSpeedBonusPerQuestion: 80,
  },

  // --- Village Hall ---

  {
    id: "uk_vh_1",
    venueId: "uk_village_hall",
    levelNumber: 1,
    type: "normal",
    questionIds: ["q_uk_vh_1_1", "q_uk_vh_1_2", "q_uk_vh_1_3", "q_uk_vh_1_4"],
    minCorrectToPass: 3,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 140,
    maxSpeedBonusPerQuestion: 80,
  },
  {
    id: "uk_vh_2",
    venueId: "uk_village_hall",
    levelNumber: 2,
    type: "normal",
    questionIds: ["q_uk_vh_2_1", "q_uk_vh_2_2", "q_uk_vh_2_3", "q_uk_vh_2_4"],
    minCorrectToPass: 3,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 150,
    maxSpeedBonusPerQuestion: 90,
  },
  {
    id: "uk_vh_3",
    venueId: "uk_village_hall",
    levelNumber: 3,
    type: "normal",
    questionIds: [
      "q_uk_vh_3_1",
      "q_uk_vh_3_2",
      "q_uk_vh_3_3",
      "q_uk_vh_3_4",
      "q_uk_vh_3_5",
    ],
    minCorrectToPass: 4,
    lifelinesAllowed: [],
    maxLifelinesPerLevel: 0,
    basePointsPerCorrect: 160,
    maxSpeedBonusPerQuestion: 100,
  },
];
