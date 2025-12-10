import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";

interface OutOfHeartsScreenProps {
  hearts: number;
  maxHearts: number;
  lastHeartUpdateAt?: number;
  heartRegenMs: number;
  onGoToShop: () => void;
  onBackToVenues: () => void;
}

export const OutOfHeartsScreen: React.FC<OutOfHeartsScreenProps> = ({
  hearts,
  maxHearts,
  lastHeartUpdateAt,
  heartRegenMs,
  onGoToShop,
  onBackToVenues,
}) => {
  const [timeLeftMs, setTimeLeftMs] = React.useState<number | null>(null);

  // ⬇️ same regen logic as before – untouched
  React.useEffect(() => {
    if (!lastHeartUpdateAt || hearts >= maxHearts) {
      setTimeLeftMs(null);
      return;
    }

    const update = () => {
      const now = Date.now();
      const nextHeartAt = lastHeartUpdateAt + heartRegenMs;
      const diff = nextHeartAt - now;
      setTimeLeftMs(diff > 0 ? diff : 0);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [hearts, maxHearts, lastHeartUpdateAt, heartRegenMs]);

  const formatTime = (ms: number | null): string => {
    if (ms === null) return "";
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const heartsLabel = `${hearts}/${maxHearts}`;

  return (
    <StageScreen>
      {/* Top header to match other screens */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Energy System</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Hub</Text>
        <Text style={styles.appSubtitle}>
          Hearts power your runs. Run out, and you&apos;ll need to recharge.
        </Text>
      </View>

      {/* Main card */}
      <View style={styles.cardOuter}>
        <View style={styles.cardInner}>
          <View style={[styles.cardHighlightStrip, styles.energyStrip]} />

          <Text style={styles.cardTitle}>💔 Out of Hearts</Text>

          <Text style={styles.subHeader}>
            Hearts are needed to attempt levels. Fail a level, lose a heart.
          </Text>

          {/* Hearts meter */}
          <View style={styles.heartsRow}>
            <Text style={styles.heartsLabel}>Hearts</Text>
            <Text style={styles.heartsValue}>{heartsLabel}</Text>
          </View>

          <View style={styles.heartsBarOuter}>
            <View
              style={[
                styles.heartsBarInner,
                {
                  width: `${
                    Math.max(0, Math.min(1, hearts / Math.max(1, maxHearts))) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          {timeLeftMs !== null && hearts < maxHearts && (
            <View style={styles.timerPill}>
              <Text style={styles.timerLabel}>Next heart in</Text>
              <Text style={styles.timerValue}>{formatTime(timeLeftMs)}</Text>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttons}>
            {/* Neon primary CTA */}
            <NeonButton
              label="Go to Shop"
              onPress={onGoToShop}
              style={{ marginBottom: 10 }}
            />

            {/* Secondary outline-style button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onBackToVenues}
              activeOpacity={0.9}
            >
              <Text style={styles.secondaryButtonText}>Back to Venues</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
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

  cardOuter: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingBottom: 32,
  },
  cardInner: {
    borderRadius: 22,
    paddingTop: 58, // 40 for strip + 18 for spacing
    paddingBottom: 18,
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
    opacity: 0.7,
  },
  energyStrip: {
    backgroundColor: "rgba(220,38,38,0.45)", // red for energy/hearts
  },
  cardTitle: {
    position: "absolute",
    top: 0,
    left: 18,
    right: 18,
    height: 40,
    fontSize: 18,
    fontWeight: "bold",
    color: TEXT_MAIN,
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 40,
  },

  subHeader: {
    fontSize: 14,
    color: TEXT_MUTED,
    textAlign: "center",
    marginBottom: 16,
  },

  heartsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  heartsLabel: {
    fontSize: 13,
    color: TEXT_MUTED,
  },
  heartsValue: {
    fontSize: 15,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  heartsBarOuter: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "rgba(31,41,55,0.9)",
    overflow: "hidden",
    marginBottom: 12,
  },
  heartsBarInner: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#F97316",
  },

  timerPill: {
    alignSelf: "center",
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: "rgba(30,64,175,0.95)",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FBBF24",
  },
  timerLabel: {
    fontSize: 12,
    color: "#FEF9C3",
    marginRight: 6,
  },
  timerValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FEF9C3",
  },

  buttons: {
    marginTop: 22,
  },
  // primaryButton styles kept in case you still use them elsewhere
  primaryButton: {
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "#F9FAFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    borderRadius: 999,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.95)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.8)",
  },
  secondaryButtonText: {
    color: TEXT_MAIN,
    fontSize: 14,
    fontWeight: "600",
  },
});
