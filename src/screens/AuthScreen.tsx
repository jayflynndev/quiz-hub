import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabaseClient";

interface AuthScreenProps {
  onLinked: (userId: string) => void;
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLinked, onBack }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleSignUp = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.warn("Supabase signUp error", error);
        setMessage(error.message);
        return;
      }

      if (data.user) {
        onLinked(data.user.id);
        setMessage("Account created and linked to your progress.");
      } else {
        setMessage("Check your email to confirm your account.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.warn("handleSignUp error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      if (data.user) {
        onLinked(data.user.id);
        setMessage("Signed in and linked to your progress.");
      } else {
        setMessage("Signed in, but no user returned.");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      console.warn("handleSignIn error", err);
    } finally {
      setLoading(false);
    }
  };

  const disabled = !email || !password || loading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Global header to match other screens */}
      <Text style={styles.appTitle}>Jay&apos;s Quiz Odyssey</Text>
      <Text style={styles.appSubtitle}>Sign in · Save your progress</Text>

      <View style={styles.card}>
        <Text style={styles.header}>Save Your Progress</Text>
        <Text style={styles.subHeader}>
          Create an account or sign in to sync your quiz journey across devices.
        </Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {message && <Text style={styles.message}>{message}</Text>}
          {loading && <ActivityIndicator style={{ marginBottom: 8 }} />}

          <TouchableOpacity
            style={[styles.primaryButton, disabled && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, disabled && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={disabled}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back to Profile</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 24,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  form: {
    marginTop: 8,
  },
  input: {
    backgroundColor: "#111827",
    color: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  message: {
    color: "#FBBF24",
    marginBottom: 8,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#F9FAFB",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },
});
