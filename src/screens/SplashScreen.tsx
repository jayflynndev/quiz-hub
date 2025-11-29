// src/screens/SplashScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const scale = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    // Simple logo/title fade + scale in
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // After a short delay, move into the app
    const timer = setTimeout(() => {
      onFinish();
    }, 1800); // ~1.8 seconds

    return () => clearTimeout(timer);
  }, [onFinish, opacity, scale]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.logoText}>QUIZ HUB</Text>
        <Text style={styles.subtitle}>Quizzing around the world</Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" />
        <Text style={styles.loadingText}>Loading your quiz world...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050816", // deep dark background
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: 4,
    color: "#FFFFFF",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#C4B5FD", // soft purple accent
  },
  footer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#9CA3AF",
  },
});
