import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HomeMenuScreenProps {
  onPlaySinglePlayer: () => void;
  onOpenMultiplayer: () => void;
  onOpenProfile: () => void;
  onOpenShop: () => void;
}

export const HomeMenuScreen: React.FC<HomeMenuScreenProps> = ({
  onPlaySinglePlayer,
  onOpenMultiplayer,
  onOpenProfile,
  onOpenShop,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Jay&apos;s Quiz Odyssey</Text>
      <Text style={styles.subHeader}>Prototype · v0.1</Text>

      <View style={styles.menu}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onPlaySinglePlayer}
        >
          <Text style={styles.buttonText}>Play (Single Player)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.disabledButton}
          onPress={onOpenMultiplayer}
        >
          <Text style={styles.buttonText}>Multiplayer (Coming Soon)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onOpenProfile}
        >
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onOpenShop}>
          <Text style={styles.buttonText}>Shop</Text>
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
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 24,
  },
  menu: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: "#374151",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: "#4B5563",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    opacity: 0.7,
  },
  buttonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
