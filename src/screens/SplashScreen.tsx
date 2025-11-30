import * as React from "react";
import { StyleSheet, Text, Animated, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const scale = React.useRef(new Animated.Value(1)).current;
  const [dots, setDots] = React.useState("");

  React.useEffect(() => {
    // Gentle breathing animation on the whole splash
    const loopAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.03,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    );
    loopAnim.start();

    // Loading dots animation
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    // Auto-advance after 10 seconds
    const timeout = setTimeout(onFinish, 10000);

    return () => {
      loopAnim.stop();
      clearInterval(dotsInterval);
      clearTimeout(timeout);
    };
  }, [onFinish, scale]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[styles.animatedWrapper, { transform: [{ scale }] }]}
      >
        <ImageBackground
          // ⬇️ update the path/filename to match where you saved the image
          source={require("../../assets/branding/splash.png")}
          style={styles.bg}
          resizeMode="cover"
        >
          {/* Optional purple tint to keep it on-brand */}
          <Animated.View style={styles.overlay} />

          <Animated.View style={styles.bottomArea}>
            <Text style={styles.loadingText}>Loading your Quiz Hub{dots}</Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // fallback while image loads
  },
  animatedWrapper: {
    flex: 1,
  },
  bg: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(60, 0, 100, 0.35)", // subtle purple tint
  },
  bottomArea: {
    width: "100%",
    paddingVertical: 24,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#F9FAFB",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});
