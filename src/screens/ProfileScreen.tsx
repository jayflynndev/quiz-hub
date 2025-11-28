import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PlayerProfile } from "../types/game";

interface ProfileScreenProps {
  profile: PlayerProfile;
  xpToNextLevel: number;
  isSignedIn: boolean;
  onOpenAuth: () => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  xpToNextLevel,
  onBack,
  isSignedIn,
  onOpenAuth,
}) => {
  const progressPercent =
    xpToNextLevel > 0 ? Math.round((profile.xp / xpToNextLevel) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.subHeader}>Player stats & progress</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Level</Text>
        <Text style={styles.value}>{profile.level}</Text>

        <Text style={styles.label}>XP</Text>
        <Text style={styles.value}>
          {profile.xp}/{xpToNextLevel} ({progressPercent}%)
        </Text>

        <Text style={styles.label}>Coins</Text>
        <Text style={styles.value}>{profile.coins}</Text>

        <Text style={styles.label}>Hearts</Text>
        <Text style={styles.value}>{profile.hearts}</Text>

        <Text style={styles.label}>Lifelines Owned</Text>
        <Text style={styles.value}>
          Ask Quizzers: {profile.askQuizzersOwned}
          {"\n"}
          50/50: {profile.fiftyFiftyOwned}
        </Text>
      </View>
      {!isSignedIn ? (
        <TouchableOpacity style={styles.authButton} onPress={onOpenAuth}>
          <Text style={styles.authButtonText}>Sign in / Save Progress</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.signedInText}>Account linked ✓</Text>
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
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: "#F9FAFB",
    fontWeight: "600",
    marginTop: 2,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 10,
  },
  backButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  authButton: {
    marginTop: 16,
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
  },
  authButtonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  signedInText: {
    marginTop: 16,
    color: "#22C55E",
    fontSize: 14,
    textAlign: "center",
  },
});
