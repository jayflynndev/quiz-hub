import * as React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { LoadingSpinner } from "../ui/LoadingSpinner";

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
    <StageScreen>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTag}>Account</Text>
        <Text style={styles.appTitle}>Jay&apos;s Quiz Odyssey</Text>
        <Text style={styles.appSubtitle}>
          Sign in to sync your quiz journey across devices.
        </Text>
      </View>

      {/* Card */}
      <View style={styles.cardOuter}>
        <View style={styles.cardInner}>
          <View style={styles.cardHighlightStrip} />

          <Text style={styles.headerText}>Save Your Progress</Text>
          <Text style={styles.subHeader}>
            Create an account or sign in to keep XP, coins and hearts linked to
            you.
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
            {loading && <LoadingSpinner />}

            {/* Create Account – Neon primary */}
            <NeonButton
              label="Create Account"
              onPress={handleSignUp}
              style={{ opacity: disabled ? 0.5 : 1, marginBottom: 8 }}
            />

            {/* Sign In – Neon alternate (purple) */}
            <NeonButton
              label="Sign In"
              onPress={handleSignIn}
              variant="purple"
              style={{ opacity: disabled ? 0.5 : 1 }}
            />
          </View>
        </View>
      </View>

      {/* Back */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back to Profile</Text>
        </TouchableOpacity>
      </View>
    </StageScreen>
  );
};

const TEXT_MAIN = "#F9FAFB";
const TEXT_MUTED = "#9CA3AF";

const styles = StyleSheet.create({
  // Header
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  appTag: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9CA3FF",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: TEXT_MAIN,
  },
  appSubtitle: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 4,
  },

  // Card
  cardOuter: {
    flex: 1,
    paddingHorizontal: 24,
  },
  cardInner: {
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    backgroundColor: "rgba(15,23,42,0.97)",
    borderWidth: 1,
    borderColor: "rgba(148,163,255,0.7)",
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  cardHighlightStrip: {
    position: "absolute",
    top: 0,
    left: -20,
    right: -20,
    height: 40,
    backgroundColor: "rgba(59,130,246,0.45)",
    opacity: 0.7,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "800",
    color: TEXT_MAIN,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 12,
  },

  // Form
  form: {
    marginTop: 8,
  },
  input: {
    backgroundColor: "#020617",
    color: TEXT_MAIN,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(31,41,55,0.9)",
  },
  message: {
    color: "#FBBF24",
    marginBottom: 8,
    fontSize: 13,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    paddingVertical: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: TEXT_MUTED,
    fontSize: 14,
  },
});
