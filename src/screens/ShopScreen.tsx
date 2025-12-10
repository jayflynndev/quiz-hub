import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { StageScreen } from "../ui/StageScreen";
import type { PlayerProfile } from "../types/game";
import { NeonButton } from "../ui/NeonButton";
import {
  SHOP_ITEMS,
  getItemsByCategory,
  getPopularItems,
  ShopItemId,
  ShopCategory,
} from "../data/shopItems";

interface ShopScreenProps {
  profile: PlayerProfile;
  onBuyItem: (itemId: ShopItemId) => void;
  onRestorePurchases: () => Promise<void>;
  onBack: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({
  profile,
  onBuyItem,
  onRestorePurchases,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<
    ShopCategory | "all"
  >("all");

  const categories: {
    id: ShopCategory | "all";
    label: string;
    icon: string;
  }[] = [
    { id: "all", label: "All", icon: "🛒" },
    { id: "consumables", label: "Power-ups", icon: "⚡" },
    { id: "currency", label: "Coins", icon: "🪙" },
    { id: "bundles", label: "Bundles", icon: "🎁" },
    { id: "premium", label: "Premium", icon: "⭐" },
    { id: "cosmetic", label: "Themes", icon: "🎨" },
  ];

  const getFilteredItems = () => {
    if (selectedCategory === "all") {
      return Object.values(SHOP_ITEMS);
    }
    return getItemsByCategory(selectedCategory);
  };

  const popularItems = getPopularItems();
  const filteredItems = getFilteredItems();

  const renderShopItem = (
    item: (typeof SHOP_ITEMS)[keyof typeof SHOP_ITEMS]
  ) => {
    const canAfford =
      item.category === "premium" || item.category === "cosmetic"
        ? profile.coins >= item.cost
        : profile.coins >= item.cost;

    const isOwned =
      item.purchaseType === "non_consumable" &&
      ((item.rewards?.removeAds && profile.adsRemoved) ||
        (item.rewards?.theme &&
          profile.unlockedThemes?.includes(item.rewards.theme)));

    return (
      <Pressable
        key={item.id}
        style={({ pressed }) => [
          styles.itemCardOuter,
          pressed && styles.itemCardOuterPressed,
          item.popular && styles.itemCardPopular,
        ]}
        onPress={() => !isOwned && onBuyItem(item.id)}
        disabled={!!isOwned}
      >
        <View style={styles.itemCardInner}>
          {item.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>POPULAR</Text>
            </View>
          )}

          <View style={styles.itemHeaderRow}>
            <View style={styles.itemTitleRow}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
              <Text style={styles.itemTitle}>{item.name}</Text>
            </View>
            {item.discount && item.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountBadgeText}>-{item.discount}%</Text>
              </View>
            )}
          </View>

          <Text style={styles.itemDescription}>{item.description}</Text>

          {item.rewards && (
            <View style={styles.rewardsContainer}>
              {item.rewards.hearts && (
                <Text style={styles.rewardText}>❤️ ×{item.rewards.hearts}</Text>
              )}
              {item.rewards.coins && (
                <Text style={styles.rewardText}>🪙 ×{item.rewards.coins}</Text>
              )}
              {item.rewards.askQuizzers && (
                <Text style={styles.rewardText}>
                  👥 ×{item.rewards.askQuizzers}
                </Text>
              )}
              {item.rewards.fiftyFifty && (
                <Text style={styles.rewardText}>
                  ✨ ×{item.rewards.fiftyFifty}
                </Text>
              )}
              {item.rewards.removeAds && (
                <Text style={styles.rewardText}>🚫 Ads</Text>
              )}
              {item.rewards.theme && (
                <Text style={styles.rewardText}>🎨 {item.rewards.theme}</Text>
              )}
            </View>
          )}

          <View style={styles.itemFooter}>
            {isOwned ? (
              <Text style={styles.ownedText}>OWNED</Text>
            ) : (
              <>
                <Text
                  style={[
                    styles.itemCost,
                    !canAfford && styles.itemCostDisabled,
                  ]}
                >
                  {item.discount && item.discount > 0 && item.originalCost ? (
                    <>
                      <Text style={styles.originalCost}>
                        {item.originalCost}
                      </Text>{" "}
                    </>
                  ) : null}
                  {item.cost} coins
                </Text>
                {!canAfford && (
                  <Text style={styles.insufficientFunds}>Not enough coins</Text>
                )}
              </>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Shop</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Hub</Text>
        <Text style={styles.appSubtitle}>
          Spend coins on power-ups, bundles, and premium features.
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

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Tabs */}
        <View style={styles.categoryTabs}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                selectedCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.id &&
                    styles.categoryLabelActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Popular Items Section */}
        {selectedCategory === "all" && popularItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Popular Items</Text>
            {popularItems.map(renderShopItem)}
          </View>
        )}

        {/* Filtered Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === "all"
              ? "All Items"
              : `${categories.find((c) => c.id === selectedCategory)?.label}`}
          </Text>
          {filteredItems.length > 0 ? (
            filteredItems.map(renderShopItem)
          ) : (
            <Text style={styles.noItemsText}>No items in this category</Text>
          )}
        </View>

        {/* Restore Purchases */}
        <View style={styles.restoreSection}>
          <Text style={styles.restoreText}>
            Lost your purchases? Restore them here.
          </Text>
          <NeonButton
            label="Restore Purchases"
            onPress={onRestorePurchases}
            style={{ alignSelf: "center", marginTop: 8 }}
          />
        </View>
      </ScrollView>

      {/* Back */}
      <View style={styles.footer}>
        <NeonButton
          label="Back to Home"
          onPress={onBack}
          style={{ alignSelf: "flex-start" }}
        />
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
    justifyContent: "space-around",
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  walletPill: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.6)",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
  },
  walletLabel: {
    fontSize: 12,
    color: TEXT_MUTED,
    textAlign: "center",
  },
  walletValue: {
    fontSize: 18,
    color: TEXT_MAIN,
    fontWeight: "800",
    marginTop: 2,
    textAlign: "center",
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
    padding: 3,
    marginBottom: 16,
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
  itemCardPopular: {
    borderColor: "rgba(139,92,246,0.8)",
    borderWidth: 2,
  },

  // Item Content
  itemDescription: {
    fontSize: 14,
    color: "#D1D5DB",
    lineHeight: 20,
    marginBottom: 12,
  },
  itemCardInner: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: 24, // Extra top padding for popular badge
    backgroundColor: "rgba(15,23,42,0.97)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    overflow: "visible", // Allow popular badge to show outside
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
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemTitle: {
    color: TEXT_MAIN,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
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

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },

  // Category Tabs
  categoryTabs: {
    flexDirection: "row",
    marginBottom: 24,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  categoryTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 6,
    marginHorizontal: 2,
    borderRadius: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.3)",
    minWidth: 0, // Allow flex shrinking
  },
  categoryTabActive: {
    backgroundColor: "rgba(59,130,246,0.8)",
    borderColor: "rgba(59,130,246,0.8)",
  },
  categoryIcon: {
    fontSize: 18,
    marginBottom: 4,
    color: TEXT_MAIN,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    color: TEXT_MAIN,
    lineHeight: 12,
  },
  categoryLabelActive: {
    color: TEXT_MAIN,
  },

  // Badges
  popularBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "rgba(139,92,246,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(139,92,246,1)",
    zIndex: 10,
  },
  popularBadgeText: {
    color: TEXT_MAIN,
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  discountBadge: {
    backgroundColor: "rgba(220,38,38,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: TEXT_MAIN,
    fontSize: 10,
    fontWeight: "bold",
  },

  // Item Content
  itemTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemIcon: {
    fontSize: 20,
    marginRight: 8,
    color: TEXT_MAIN,
  },

  // Rewards
  rewardsContainer: {
    marginBottom: 12,
  },
  rewardText: {
    fontSize: 13,
    color: "rgba(59,130,246,0.9)",
    marginBottom: 4,
  },

  // Item Footer
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  itemCost: {
    fontSize: 16,
    fontWeight: "bold",
    color: TEXT_MAIN,
  },
  itemCostDisabled: {
    color: TEXT_MUTED,
  },
  originalCost: {
    textDecorationLine: "line-through",
    color: TEXT_MUTED,
  },
  insufficientFunds: {
    fontSize: 12,
    color: "rgba(220,38,38,0.9)",
  },
  ownedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },

  // No Items
  noItemsText: {
    fontSize: 16,
    color: TEXT_MUTED,
    textAlign: "center",
    paddingVertical: 32,
  },

  // Restore Section
  restoreSection: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 24,
  },
  restoreText: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 8,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
