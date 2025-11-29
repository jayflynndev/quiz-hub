import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PlayerProfile } from "../types/game";

interface ShopScreenProps {
  profile: PlayerProfile;
  onBuyAskQuizzersUpgrade: () => void;
  onBuyFiftyFiftyUpgrade: () => void;
  onBuyHeart: () => void;
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  profile,
  onBuyAskQuizzersUpgrade,
  onBuyFiftyFiftyUpgrade,
  onBuyHeart,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Global header to match other screens */}
      <Text style={styles.appTitle}>Jay&apos;s Quiz Odyssey</Text>
      <Text style={styles.appSubtitle}>Shop · Power-ups & hearts</Text>

      {/* Wallet summary */}
      <View style={styles.walletRow}>
        <View style={styles.walletPill}>
          <Text style={styles.walletLabel}>Coins</Text>
          <Text style={styles.walletValue}>{profile.coins}</Text>
        </View>
        <View style={styles.walletPill}>
          <Text style={styles.walletLabel}>Hearts</Text>
          <Text style={styles.walletValue}>{profile.hearts}</Text>
        </View>
        <View style={styles.walletPill}>
          <Text style={styles.walletLabel}>Level</Text>
          <Text style={styles.walletValue}>{profile.level}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Power-ups</Text>

        <TouchableOpacity
          style={styles.itemCard}
          onPress={onBuyAskQuizzersUpgrade}
        >
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemTitle}>Ask Quizzers</Text>
            <Text style={styles.itemChip}>
              Owned: {profile.askQuizzersOwned}
            </Text>
          </View>
          <Text style={styles.itemSubtitle}>
            Reveal what the quiz crowd picked.
          </Text>
          <Text style={styles.itemMeta}>Cost: 50 coins (consumable)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemCard}
          onPress={onBuyFiftyFiftyUpgrade}
        >
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemTitle}>50/50</Text>
            <Text style={styles.itemChip}>
              Owned: {profile.fiftyFiftyOwned}
            </Text>
          </View>
          <Text style={styles.itemSubtitle}>
            Remove two wrong answers on tricky questions.
          </Text>
          <Text style={styles.itemMeta}>Cost: 70 coins (consumable)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hearts</Text>

        <TouchableOpacity style={styles.itemCard} onPress={onBuyHeart}>
          <View style={styles.itemHeaderRow}>
            <Text style={styles.itemTitle}>Buy 1 Heart</Text>
            <Text style={styles.itemChip}>You have: {profile.hearts}</Text>
          </View>
          <Text style={styles.itemSubtitle}>
            Hearts let you attempt levels. Fail a level, lose a heart.
          </Text>
          <Text style={styles.itemMeta}>Cost: 50 coins</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back to Home</Text>
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
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  walletPill: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#1F2937",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  walletLabel: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  walletValue: {
    fontSize: 16,
    color: "#F9FAFB",
    fontWeight: "700",
    marginTop: 2,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "600",
  },
  itemChip: {
    backgroundColor: "#4B5563",
    color: "#F9FAFB",
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  itemSubtitle: {
    color: "#D1D5DB",
    fontSize: 13,
    marginTop: 4,
  },
  itemMeta: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: "#374151",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#E5E7EB",
    fontSize: 14,
    fontWeight: "600",
  },
});
