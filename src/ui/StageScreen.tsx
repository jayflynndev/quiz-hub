// src/ui/StageScreen.tsx
import * as React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ViewStyle,
  StyleProp,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface StageScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const StageScreen: React.FC<StageScreenProps> = ({
  children,
  style,
}) => {
  // Screen fade-in animation
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Blobs
  const pulse1 = React.useRef(new Animated.Value(0)).current;
  const pulse2 = React.useRef(new Animated.Value(0)).current;

  // Spotlights (top-left & bottom-right)
  const lightTop = React.useRef(new Animated.Value(0)).current;
  const lightBottom = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Screen fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    const loopFloat = (val: Animated.Value, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 1,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();

    // Gentle blob breathing
    loopFloat(pulse1, 9000);
    loopFloat(pulse2, 11000);

    // Spotlights sweeping (rotation + opacity only, anchored in corners)
    loopFloat(lightTop, 10000);
    loopFloat(lightBottom, 12000);
  }, [pulse1, pulse2, lightTop, lightBottom]);

  // Blob styles
  const blob1Style = {
    transform: [
      {
        scale: pulse1.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.08],
        }),
      },
      {
        translateY: pulse1.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
    opacity: pulse1.interpolate({
      inputRange: [0, 1],
      outputRange: [0.28, 0.42],
    }),
  };

  const blob2Style = {
    transform: [
      {
        scale: pulse2.interpolate({
          inputRange: [0, 1],
          outputRange: [1.04, 0.96],
        }),
      },
      {
        translateY: pulse2.interpolate({
          inputRange: [0, 1],
          outputRange: [8, -4],
        }),
      },
    ],
    opacity: pulse2.interpolate({
      inputRange: [0, 1],
      outputRange: [0.16, 0.32],
    }),
  };

  // Top-left spotlight: anchored, swings a bit across the top third
  const topLightStyle = {
    transform: [
      {
        rotate: lightTop.interpolate({
          inputRange: [0, 1],
          outputRange: ["-22deg", "-5deg"],
        }),
      },
    ],
    opacity: lightTop.interpolate({
      inputRange: [0, 1],
      outputRange: [0.1, 0.32],
    }),
  };

  // Bottom-right spotlight: anchored, sweeps up across bottom third
  const bottomLightStyle = {
    transform: [
      {
        rotate: lightBottom.interpolate({
          inputRange: [0, 1],
          outputRange: ["200deg", "160deg"],
        }),
      },
    ],
    opacity: lightBottom.interpolate({
      inputRange: [0, 1],
      outputRange: [0.08, 0.28],
    }),
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <SafeAreaView
        style={styles.safe}
        edges={["top", "right", "bottom", "left"]}
      >
        {/* Background stage */}
        <View style={styles.background}>
          <View style={styles.bgLayerDark} />
          <View style={styles.bgLayerSoft} />

          {/* Glowing blobs */}
          <Animated.View
            pointerEvents="none"
            style={[styles.blob, styles.blobPurple, blob1Style]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.blob, styles.blobBlue, blob2Style]}
          />

          {/* Spotlights */}
          <Animated.View
            pointerEvents="none"
            style={[styles.spotlightTopLeft, topLightStyle]}
          />
          <Animated.View
            pointerEvents="none"
            style={[styles.spotlightBottomRight, bottomLightStyle]}
          />
        </View>

        {/* Foreground content */}
        <View style={[styles.content, style]}>{children}</View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#020014",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  bgLayerDark: {
    flex: 1,
    backgroundColor: "#020014",
  },
  bgLayerSoft: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.9)",
  },

  // Blobs
  blob: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
  },
  blobPurple: {
    top: -80,
    right: -60,
    backgroundColor: "#7C3AED",
  },
  blobBlue: {
    bottom: -90,
    left: -50,
    backgroundColor: "#0EA5E9",
  },

  // Spotlights: big ellipses mostly off-screen
  spotlightTopLeft: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 380,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(191,219,254,0.4)", // soft blue/white
  },
  spotlightBottomRight: {
    position: "absolute",
    bottom: -140,
    right: -140,
    width: 420,
    height: 280,
    borderRadius: 280,
    backgroundColor: "rgba(167,139,250,0.4)", // soft purple
  },

  content: {
    flex: 1,
  },
});
