import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StageScreen } from "../ui/StageScreen";
import type { PlayerProfile } from "../types/game";

interface ProfileScreenProps {
  profile: PlayerProfile;
  xpToNextLevel: number;
  isSignedIn: boolean;
  onOpenAuth: () => void;
  onLogout?: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  xpToNextLevel,
  onBack,
  isSignedIn,
  onLogout,
  onOpenAuth,
}) => {
  const rawPercent =
    xpToNextLevel > 0 ? Math.round((profile.xp / xpToNextLevel) * 100) : 0;
  const progressPercent = Math.max(0, Math.min(100, rawPercent));

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Profile</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Odyssey</Text>
        <Text style={styles.appSubtitle}>
          Track your level, XP, hearts and lifelines.
        </Text>
      </View>

      {/* Main card */}
      <View style={styles.cardOuter}>
        <View style={styles.cardInner}>
          <View style={styles.cardHighlightStrip} />

          <View style={styles.rowTop}>
            <View>
              <Text style={styles.levelLabel}>Level</Text>
              <Text style={styles.levelValue}>{profile.level}</Text>
            </View>
            <View style={styles.heartsPill}>
              <Text style={styles.heartsText}>❤️ {profile.hearts}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>XP</Text>
            <Text style={styles.value}>
              {profile.xp}/{xpToNextLevel} ({progressPercent}%)
            </Text>
            <View style={styles.progressBarOuter}>
              <View
                style={[
                  styles.progressBarInner,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Coins</Text>
            <Text style={styles.value}>{profile.coins}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Lifelines Owned</Text>
            <Text style={styles.value}>
              Ask Quizzers: {profile.askQuizzersOwned}
              {"\n"}
              50/50: {profile.fiftyFiftyOwned}
            </Text>
          </View>
        </View>
      </View>

      {/* Auth / account area */}
      <View style={styles.footer}>
        {!isSignedIn ? (
          <TouchableOpacity
            style={styles.authButton}
            onPress={onOpenAuth}
            activeOpacity={0.9}
          >
            <Text style={styles.authButtonText}>Sign in / Save Progress</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.signedInText}>Account linked ✓</Text>
            {onLogout && (
              <TouchableOpacity
                style={styles.secondaryAuthButton}
                onPress={onLogout}
                activeOpacity={0.9}
              >
                <Text style={styles.secondaryAuthButtonText}>Sign out</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.9}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  appTag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  appSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
  },

  // Card
  cardOuter: {
    paddingHorizontal: 24,
    paddingTop: 6,
  },
  cardInner: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "rgba(15,23,42,0.97)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    overflow: "hidden",
  },
  cardHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 40,
    backgroundColor: "rgba(79,70,229,0.45)",
    opacity: 0.7,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  levelLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  levelValue: {
    fontSize: 24,
    color: TEXT_MAIN,
    fontWeight: "800",
    marginTop: 2,
  },
  heartsPill: {
    backgroundColor: "rgba(248,113,113,0.12)",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(248,113,113,0.8)",
  },
  heartsText: {
    color: "#FCA5A5",
    fontSize: 14,
    fontWeight: "700",
  },

  section: {
    marginTop: 12,
  },
  sectionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  sectionHalf: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  value: {
    fontSize: 16,
    color: TEXT_MAIN,
    fontWeight: "600",
    marginTop: 2,
  },

  progressBarOuter: {
    marginTop: 6,
    height: 10,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#7C3AED",
  },

  // Footer / auth
  footer: {
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  authButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#3B82F6",
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  authButtonText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  signedInText: {
    marginTop: 4,
    color: "#22C55E",
    fontSize: 14,
    textAlign: "center",
  },
  secondaryAuthButton: {
    marginTop: 10,
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.8)",
  },
  secondaryAuthButtonText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    marginTop: 20,
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    alignItems: "center",
  },
  backButtonText: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});
