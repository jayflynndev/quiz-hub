// src/hooks/useGameData.ts
import * as React from "react";
import { LEVELS } from "../data/levels";
import { VENUES } from "../data/venues";
import type { LevelConfig, LevelId } from "../types/game";

export interface RegionSummary {
  id: string;
  name: string;
  venueCount: number;
}

const getRegionName = (regionId: string): string => {
  switch (regionId) {
    case "uk":
      return "United Kingdom";
    default:
      return regionId;
  }
};

export interface UseGameDataResult {
  regions: RegionSummary[];
  getVenuesForRegion: (regionId: string | null) => typeof VENUES;
  getLevelById: (id: LevelId | null) => LevelConfig | null;
  getVenueById: (id: string | null) => (typeof VENUES)[number] | null;
  getOrderedVenueLevels: (venueId: string | null) => LevelConfig[];
}

export const useGameData = (): UseGameDataResult => {
  const allVenues = React.useMemo(
    () => [...VENUES].sort((a, b) => a.order - b.order),
    []
  );

  const getVenuesForRegion = (regionId: string | null) =>
    regionId ? allVenues.filter((v) => v.regionId === regionId) : [];

  const getLevelById = (id: LevelId | null): LevelConfig | null =>
    id ? LEVELS.find((l) => l.id === id) ?? null : null;

  const getVenueById = (id: string | null) =>
    id ? allVenues.find((v) => v.id === id) ?? null : null;

  const regions = React.useMemo<RegionSummary[]>(() => {
    const map: Record<string, RegionSummary> = {};
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

  const getOrderedVenueLevels = (venueId: string | null): LevelConfig[] => {
    if (!venueId) return [];
    return LEVELS.filter((l) => l.venueId === venueId).sort(
      (a, b) => a.levelNumber - b.levelNumber
    );
  };

  return {
    regions,
    getVenuesForRegion,
    getLevelById,
    getVenueById,
    getOrderedVenueLevels,
  };
};
