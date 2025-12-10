// src/hooks/usePlayerProfile.ts
import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabaseClient";
import type { PlayerProfile } from "../types/game";

const PROFILE_STORAGE_KEY = "quiz_odyssey_profile_v1";
const GUEST_PROFILE_ID_KEY = "quiz_odyssey_guest_profile_id_v1";

export const MAX_HEARTS = 5;
const HEART_REGEN_MINUTES = 20;
export const HEART_REGEN_MS = HEART_REGEN_MINUTES * 60 * 1000;

// ---- helpers ----

const withRegeneratedHearts = (profile: PlayerProfile): PlayerProfile => {
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

const generateGuestProfileId = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const isValidUuid = (value: string | null): boolean => {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
  );
};

export interface UsePlayerProfileResult {
  profile: PlayerProfile;
  profileReady: boolean;
  authUserId: string | null;
  activeProfileId: string | null;
  guestProfileId: string | null;
  saveProfile: (next: PlayerProfile) => Promise<void>;
  handleRefillHeartsDebug: () => void;
  handleLogout: () => Promise<void>;
  linkGuestProfileToAuthUser: (userId: string) => Promise<void>;
}

export const usePlayerProfile = (): UsePlayerProfileResult => {
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
    dailyStreak: 0,
    lastActiveAt: null,
    dailyChallengeProgress: [],
    claimedStreakRewards: [],
  });

  const [guestProfileId, setGuestProfileId] = React.useState<string | null>(
    null
  );
  const [authUserId, setAuthUserId] = React.useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = React.useState<string | null>(
    null
  );
  const [profileReady, setProfileReady] = React.useState(false);

  // --- saveProfile ---

  const saveProfile = React.useCallback(
    async (next: PlayerProfile) => {
      try {
        setProfile(next);
        await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next));

        const profileIdToUse = activeProfileId ?? guestProfileId;
        if (!profileIdToUse) return;

        const { error } = await supabase.from("profiles").upsert({
          id: profileIdToUse,
          auth_user_id: authUserId ?? null,
          xp: next.xp,
          level: next.level,
          coins: next.coins,
          hearts: next.hearts,
          last_heart_update_at: next.lastHeartUpdateAt,
          ask_quizzers_owned: next.askQuizzersOwned,
          fifty_fifty_owned: next.fiftyFiftyOwned,
          extra_lives_owned: next.extraLivesOwned,
          daily_streak: next.dailyStreak,
          last_active_at: next.lastActiveAt,
        });

        if (error) {
          console.warn("Supabase saveProfile error", error);
        }
      } catch (err) {
        console.warn("Failed to save profile", err);
      }
    },
    [activeProfileId, guestProfileId, authUserId]
  );

  const handleRefillHeartsDebug = React.useCallback(() => {
    const next: PlayerProfile = {
      ...profile,
      hearts: MAX_HEARTS,
      lastHeartUpdateAt: Date.now(),
    };
    void saveProfile(next);
  }, [profile, saveProfile]);

  // --- ensure guest id ---

  React.useEffect(() => {
    const ensureGuestProfileId = async () => {
      try {
        const stored = await AsyncStorage.getItem(GUEST_PROFILE_ID_KEY);

        if (isValidUuid(stored)) {
          setGuestProfileId(stored as string);
          return;
        }

        const newId = generateGuestProfileId();
        await AsyncStorage.setItem(GUEST_PROFILE_ID_KEY, newId);
        setGuestProfileId(newId);
      } catch (err) {
        console.warn("Failed to ensure guest profile id", err);
      }
    };

    ensureGuestProfileId();
  }, []);

  // --- auth init / subscribe ---

  React.useEffect(() => {
    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.warn("supabase.auth.getUser error", error);
        }
        setAuthUserId(data?.user?.id ?? null);
      } catch (err) {
        console.warn("initAuth failed", err);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUserId(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- load profile from Supabase + local ---

  React.useEffect(() => {
    if (!guestProfileId) return;

    const loadProfile = async () => {
      try {
        let profileRowId = guestProfileId;
        let dataFromSupabase: any | null = null;

        if (authUserId) {
          // Logged in: find profile(s) by auth_user_id.
          // There *might* be more than one row (ghost duplicates), so we
          // avoid .maybeSingle() and simply pick the first.
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_user_id", authUserId);

          if (error) {
            console.warn("Supabase loadProfile by auth_user_id error", error);
          }

          if (data && data.length > 0) {
            const primaryRow = data[0]; // For now, just use the first row
            dataFromSupabase = primaryRow;
            profileRowId = primaryRow.id as string;
          } else {
            // no profile yet for this auth user → fallback to guest id
            profileRowId = guestProfileId;
            const { data: byGuest, error: guestError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", guestProfileId)
              .maybeSingle();

            if (guestError) {
              console.warn(
                "Supabase loadProfile by guest id error",
                guestError
              );
            }

            if (byGuest) {
              dataFromSupabase = byGuest;
            }
          }
        } else {
          // Guest mode: use guestProfileId
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", guestProfileId)
            .maybeSingle();

          if (error) {
            console.warn("Supabase loadProfile (guest) error", error);
          }

          if (data) {
            dataFromSupabase = data;
          }
        }

        let baseProfile: PlayerProfile;

        if (dataFromSupabase) {
          baseProfile = {
            xp: dataFromSupabase.xp ?? 0,
            level: dataFromSupabase.level ?? 1,
            coins: dataFromSupabase.coins ?? 0,
            bonusAskQuizzers: 0,
            bonusFiftyFifty: 0,
            askQuizzersOwned: dataFromSupabase.ask_quizzers_owned ?? 3,
            fiftyFiftyOwned: dataFromSupabase.fifty_fifty_owned ?? 1,
            extraLivesOwned: dataFromSupabase.extra_lives_owned ?? 0,
            hearts: dataFromSupabase.hearts ?? MAX_HEARTS,
            lastHeartUpdateAt:
              typeof dataFromSupabase.last_heart_update_at === "number"
                ? dataFromSupabase.last_heart_update_at
                : Date.now(),
            dailyStreak: dataFromSupabase.daily_streak ?? 0,
            lastActiveAt: dataFromSupabase.last_active_at ?? null,
            dailyChallengeProgress: [], // TODO: Load from Supabase when schema is updated
            claimedStreakRewards: [], // TODO: Load from Supabase when schema is updated
          };
        } else {
          const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw) as Partial<PlayerProfile>;
            baseProfile = {
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
              dailyStreak: parsed.dailyStreak ?? 0,
              lastActiveAt: parsed.lastActiveAt ?? null,
              dailyChallengeProgress: parsed.dailyChallengeProgress ?? [],
              claimedStreakRewards: parsed.claimedStreakRewards ?? [],
            };
          } else {
            baseProfile = {
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
              dailyStreak: 0,
              lastActiveAt: null,
              dailyChallengeProgress: [],
              claimedStreakRewards: [],
            };
          }
        }

        const hydrated = withRegeneratedHearts(baseProfile);
        setProfile(hydrated);

        await AsyncStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(hydrated)
        );

        await supabase.from("profiles").upsert({
          id: profileRowId,
          auth_user_id: authUserId ?? null,
          xp: hydrated.xp,
          level: hydrated.level,
          coins: hydrated.coins,
          hearts: hydrated.hearts,
          last_heart_update_at: hydrated.lastHeartUpdateAt,
          ask_quizzers_owned: hydrated.askQuizzersOwned,
          fifty_fifty_owned: hydrated.fiftyFiftyOwned,
          extra_lives_owned: hydrated.extraLivesOwned,
          daily_streak: hydrated.dailyStreak,
          last_active_at: hydrated.lastActiveAt,
        });

        setActiveProfileId(profileRowId);
        setProfileReady(true);
      } catch (err) {
        console.warn("Failed to load profile (Supabase + local)", err);
        setProfileReady(true);
      }
    };

    loadProfile();
  }, [guestProfileId, authUserId]);

  // --- hearts regen ticker ---

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProfile((prev) => {
        const next = withRegeneratedHearts(prev);
        if (next === prev) return prev;

        AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(next)).catch(
          (err) => console.warn("Failed to save profile (regen)", err)
        );
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // --- link guest profile to auth user ---

  const linkGuestProfileToAuthUser = React.useCallback(
    async (userId: string) => {
      if (!guestProfileId) return;

      try {
        // 1) Check if there is already a profile row for this auth user
        const { data: existing, error: existingError } = await supabase
          .from("profiles")
          .select("id")
          .eq("auth_user_id", userId);

        if (existingError) {
          console.warn(
            "linkGuestProfileToAuthUser: check existing profiles error",
            existingError
          );
        }

        if (existing && existing.length > 0) {
          // We already have one or more rows for this auth_user_id.
          // Do NOT create another duplicate auth row – just switch to that user.
          setAuthUserId(userId);
          return;
        }

        // 2) No existing auth-linked profile: safe to link the guest row
        const { error } = await supabase
          .from("profiles")
          .update({ auth_user_id: userId })
          .eq("id", guestProfileId);

        if (error) {
          console.warn("linkGuestProfileToAuthUser error", error);
        } else {
          setAuthUserId(userId);
        }
      } catch (err) {
        console.warn("Failed to link guest profile to auth user", err);
      }
    },
    [guestProfileId]
  );

  const handleLogout = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Supabase signOut error", err);
    } finally {
      setAuthUserId(null);
      setActiveProfileId(guestProfileId);
    }
  }, [guestProfileId]);

  return {
    profile,
    profileReady,
    authUserId,
    activeProfileId,
    guestProfileId,
    saveProfile,
    handleRefillHeartsDebug,
    handleLogout,
    linkGuestProfileToAuthUser,
  };
};
