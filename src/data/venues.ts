// src/data/venues.ts
import type { Venue } from "../types/game";

export const VENUES: Venue[] = [
  {
    id: "uk_local_pub",
    regionId: "uk",
    name: "The Local Pub",
    order: 1,
    isBossVenue: false,
    description: "A friendly warm-up down the local.",
    baseDifficulty: 1,
    levelIds: ["uk_pub_1", "uk_pub_2", "uk_pub_3", "uk_pub_4", "uk_pub_5"],
  },
  {
    id: "uk_village_hall",
    regionId: "uk",
    name: "Village Hall Quiz Night",
    order: 2,
    isBossVenue: false,
    description: "Classic community quiz vibes.",
    baseDifficulty: 2,
    levelIds: ["uk_vh_1", "uk_vh_2", "uk_vh_3"],
  },
];
