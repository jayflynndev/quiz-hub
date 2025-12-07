// src/ui/Toast.tsx
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { Toast } from "../contexts/ToastContext";

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide with slide out animation
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => onHide(toast.id));
      }, toast.duration - 300); // Start slide out 300ms before auto-hide

      return () => clearTimeout(timer);
    }
  }, [toast, slideAnim, opacityAnim, onHide]);

  const getToastColors = () => {
    switch (toast.type) {
      case "success":
        return {
          background: theme.colors.success,
          icon: "checkmark-circle",
          iconColor: "#FFFFFF",
        };
      case "error":
        return {
          background: theme.colors.error,
          icon: "close-circle",
          iconColor: "#FFFFFF",
        };
      case "warning":
        return {
          background: theme.colors.warning,
          icon: "warning",
          iconColor: "#FFFFFF",
        };
      case "info":
      default:
        return {
          background: theme.colors.neonGreen,
          icon: "information-circle",
          iconColor: "#FFFFFF",
        };
    }
  };

  const { background, icon, iconColor } = getToastColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={[styles.toast, { backgroundColor: background }]}>
        <Ionicons
          name={icon as any}
          size={20}
          color={iconColor}
          style={styles.icon}
        />
        <Text style={[styles.message, { color: "#FFFFFF" }]}>
          {toast.message}
        </Text>
        <TouchableOpacity
          onPress={() => onHide(toast.id)}
          style={styles.closeButton}
          accessibilityLabel="Close notification"
          accessibilityRole="button"
        >
          <Ionicons name="close" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onHideToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onHideToast,
}) => {
  return (
    <View style={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={onHideToast} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  container: {
    marginBottom: 10,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 44,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
});
