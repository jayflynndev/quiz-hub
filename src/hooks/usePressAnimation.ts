// src/hooks/usePressAnimation.ts
import { useRef } from "react";
import { Animated, Easing } from "react-native";

export const usePressAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  const animatePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();
  };

  return {
    scaleAnim,
    animatePressIn,
    animatePressOut,
  };
};
