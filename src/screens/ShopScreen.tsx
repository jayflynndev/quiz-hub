import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { StageScreen } from "../ui/StageScreen";
import type { PlayerProfile } from "../types/game";
import { NeonButton } from "../ui/NeonButton";

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
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Shop</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Odyssey</Text>
        <Text style={styles.appSubtitle}>
          Spend coins on power-ups and extra hearts.
        </Text>
      </View>

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

      {/* Power-ups */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Power-ups</Text>

        <Pressable
          style={({ pressed }) => [
            styles.itemCardOuter,
            pressed && styles.itemCardOuterPressed,
          ]}
          onPress={onBuyAskQuizzersUpgrade}
        >
          <View style={styles.itemCardInner}>
            <View style={styles.itemHighlightStrip} />
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
          </View>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.itemCardOuter,
            pressed && styles.itemCardOuterPressed,
          ]}
          onPress={onBuyFiftyFiftyUpgrade}
        >
          <View style={styles.itemCardInner}>
            <View style={styles.itemHighlightStripAlt} />
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemTitle}>50 / 50</Text>
              <Text style={styles.itemChip}>
                Owned: {profile.fiftyFiftyOwned}
              </Text>
            </View>
            <Text style={styles.itemSubtitle}>
              Remove two wrong answers on tricky questions.
            </Text>
            <Text style={styles.itemMeta}>Cost: 70 coins (consumable)</Text>
          </View>
        </Pressable>
      </View>

      {/* Hearts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hearts</Text>

        <Pressable
          style={({ pressed }) => [
            styles.itemCardOuter,
            pressed && styles.itemCardOuterPressed,
          ]}
          onPress={onBuyHeart}
        >
          <View style={styles.itemCardInner}>
            <View style={styles.itemHighlightStripHeart} />
            <View style={styles.itemHeaderRow}>
              <Text style={styles.itemTitle}>Buy 1 Heart</Text>
              <Text style={styles.itemChip}>You have: {profile.hearts}</Text>
            </View>
            <Text style={styles.itemSubtitle}>
              Hearts let you attempt levels. Fail a level, lose a heart.
            </Text>
            <Text style={styles.itemMeta}>Cost: 50 coins</Text>
          </View>
        </Pressable>
      </View>

      {/* Back */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.9}
          style={{ alignSelf: "flex-start" }}
        >
          <NeonButton label="Back to Home" />
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

  // Wallet
  walletRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 12,
    gap: 8,
  },
  walletPill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.8)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  walletLabel: {
    fontSize: 11,
    color: TEXT_MUTED,
  },
  walletValue: {
    fontSize: 16,
    color: TEXT_MAIN,
    fontWeight: "700",
    marginTop: 2,
  },

  // Sections
  section: {
    marginTop: 8,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 10,
  },

  // Item cards
  itemCardOuter: {
    borderRadius: 18,
    padding: 2,
    marginBottom: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    shadowColor: "#000",
    shadowOpacity: 0.65,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  itemCardOuterPressed: {
    transform: [{ scale: 0.97 }],
  },
  itemCardInner: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15,23,42,0.97)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    overflow: "hidden",
  },
  itemHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 32,
    backgroundColor: "rgba(59,130,246,0.45)", // blue glow
    opacity: 0.7,
  },
  itemHighlightStripAlt: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 32,
    backgroundColor: "rgba(139,92,246,0.45)", // purple glow
    opacity: 0.7,
  },
  itemHighlightStripHeart: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 32,
    backgroundColor: "rgba(248,113,113,0.45)", // red glow
    opacity: 0.7,
  },
  itemHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemTitle: {
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: "700",
  },
  itemChip: {
    backgroundColor: "rgba(55,65,81,0.9)",
    color: TEXT_MAIN,
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    overflow: "hidden",
  },
  itemSubtitle: {
    color: "#D1D5DB",
    fontSize: 13,
    marginTop: 6,
  },
  itemMeta: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 4,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  backText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "700",
  },
});
