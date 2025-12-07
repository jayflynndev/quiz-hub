// src/hooks/useAccessibility.ts
import { useEffect } from "react";
import { AccessibilityInfo } from "react-native";

export const useAccessibilityAnnouncement = () => {
  const announce = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  const announceCorrectAnswer = () => {
    announce("Correct answer!");
  };

  const announceIncorrectAnswer = () => {
    announce("Incorrect answer. The correct answer was...");
  };

  const announceTimeRunningOut = (seconds: number) => {
    if (seconds <= 10) {
      announce(`${seconds} seconds remaining`);
    }
  };

  const announceLevelComplete = (level: number) => {
    announce(`Level ${level} completed!`);
  };

  const announceGameOver = () => {
    announce("Game over");
  };

  return {
    announce,
    announceCorrectAnswer,
    announceIncorrectAnswer,
    announceTimeRunningOut,
    announceLevelComplete,
    announceGameOver,
  };
};
