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
        // In dev, if email confirmation is disabled, user will be ready immediately.
        onLinked(data.user.id);
        setMessage("Account created and linked to your progress.");
      } else {
        // If confirmation is required, user will need to verify email.
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
          style={[styles.button, disabled && styles.buttonDisabled]}
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

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F9FAFB",
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  form: {
    marginTop: 8,
  },
  input: {
    backgroundColor: "#1F2937",
    color: "#F9FAFB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  message: {
    color: "#FBBF24",
    marginBottom: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: "#3B82F6",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  secondaryButton: {
    backgroundColor: "#4B5563",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
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
