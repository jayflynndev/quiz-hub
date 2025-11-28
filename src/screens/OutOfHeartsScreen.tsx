import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>You&apos;re Out of Hearts 💔</Text>
      <Text style={styles.subHeader}>
        Hearts are needed to attempt levels. Fail a level, lose a heart.
      </Text>
      <Text style={styles.subHeader}>
        Hearts: {hearts}/{maxHearts}
      </Text>

      {timeLeftMs !== null && hearts < maxHearts && (
        <Text style={styles.timerText}>
          Next heart in {formatTime(timeLeftMs)}
        </Text>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryButton} onPress={onGoToShop}>
          <Text style={styles.buttonText}>Go to Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onBackToVenues}
        >
          <Text style={styles.buttonText}>Back to Venues</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 12,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
    textAlign: "center",
  },
  timerText: {
    fontSize: 16,
    color: "#FBBF24",
    marginTop: 8,
    textAlign: "center",
  },
  buttons: {
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "#374151",
    paddingVertical: 12,
    borderRadius: 999,
  },
  buttonText: {
    color: "#F9FAFB",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
