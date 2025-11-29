import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    <SafeAreaView style={styles.container}>
      {/* Global header to match other screens */}
      <Text style={styles.appTitle}>Jay&apos;s Quiz Odyssey</Text>
      <Text style={styles.appSubtitle}>Profile & progression</Text>

      <View style={styles.card}>
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

      {!isSignedIn ? (
        <TouchableOpacity style={styles.authButton} onPress={onOpenAuth}>
          <Text style={styles.authButtonText}>Sign in / Save Progress</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.signedInText}>Account linked ✓</Text>
      )}

      {isSignedIn && onLogout && (
        <TouchableOpacity style={styles.secondaryAuthButton} onPress={onLogout}>
          <Text style={styles.secondaryAuthButtonText}>Sign out</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 24,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
  },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelLabel: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  levelValue: {
    fontSize: 22,
    color: "#F9FAFB",
    fontWeight: "700",
    marginTop: 2,
  },
  heartsPill: {
    backgroundColor: "#4B5563",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  heartsText: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  value: {
    fontSize: 16,
    color: "#F9FAFB",
    fontWeight: "600",
    marginTop: 2,
  },
  progressBarOuter: {
    marginTop: 6,
    height: 8,
    backgroundColor: "#111827",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    backgroundColor: "#7C3AED",
    borderRadius: 999,
  },
  authButton: {
    marginTop: 20,
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 10,
  },
  authButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signedInText: {
    marginTop: 20,
    color: "#22C55E",
    fontSize: 14,
    textAlign: "center",
  },
  secondaryAuthButton: {
    marginTop: 12,
    backgroundColor: "#374151",
    paddingVertical: 10,
    borderRadius: 10,
  },
  secondaryAuthButtonText: {
    color: "#F9FAFB",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  backButton: {
    marginTop: 24,
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
