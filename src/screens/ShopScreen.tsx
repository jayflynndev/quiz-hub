import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { PlayerProfile } from "../types/game";

interface ShopScreenProps {
  profile: PlayerProfile;
  onBuyAskQuizzersUpgrade: () => void;
  onBuyFiftyFiftyUpgrade: () => void;
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  profile,
  onBuyAskQuizzersUpgrade,
  onBuyFiftyFiftyUpgrade,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Quiz Hub Shop</Text>
      <Text style={styles.subHeader}>
        Coins: {profile.coins} · Lv {profile.level}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upgrades</Text>

        <TouchableOpacity
          style={styles.itemButton}
          onPress={onBuyAskQuizzersUpgrade}
        >
          <Text style={styles.itemTitle}>Ask Quizzers (consumable)</Text>
          <Text style={styles.itemMeta}>
            Cost: 50 coins · Owned: {profile.askQuizzersOwned}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemButton}
          onPress={onBuyFiftyFiftyUpgrade}
        >
          <Text style={styles.itemTitle}>50/50 (consumable)</Text>
          <Text style={styles.itemMeta}>
            Cost: 70 coins · Owned: {profile.fiftyFiftyOwned}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
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
  itemButton: {
    backgroundColor: "#1F2937",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  itemTitle: {
    color: "#F9FAFB",
    fontSize: 15,
    fontWeight: "600",
  },
  itemMeta: {
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 4,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: "#374151",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  backText: {
    color: "#E5E7EB",
    fontSize: 14,
  },
});
