// src/hooks/useSound.ts
import { useSettings } from "../contexts/SettingsContext";

export const useSound = () => {
  const { settings } = useSettings();

  const playSoundEffect = async (soundName: string) => {
    if (!settings.soundEnabled) return;

    // TODO: Implement actual sound playback with expo-av
  };

  const playHapticFeedback = async (
    type: "light" | "medium" | "heavy" | "success" | "error" = "medium"
  ) => {
    if (!settings.hapticFeedbackEnabled) return;

    // TODO: Implement actual haptic feedback with expo-haptics
  };

  const playButtonSound = () => playSoundEffect("button");
  const playCorrectSound = () => playSoundEffect("correct");
  const playIncorrectSound = () => playSoundEffect("incorrect");
  const playLevelCompleteSound = () => playSoundEffect("level_complete");

  return {
    playSoundEffect,
    playHapticFeedback,
    playButtonSound,
    playCorrectSound,
    playIncorrectSound,
    playLevelCompleteSound,
  };
};
