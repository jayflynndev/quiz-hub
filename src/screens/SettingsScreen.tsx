// src/screens/SettingsScreen.tsx
import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StageScreen } from "../ui/StageScreen";
import { NeonButton } from "../ui/NeonButton";
import { useTheme } from "../contexts/ThemeContext";
import { useSettings } from "../contexts/SettingsContext";

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();

  const TEXT_MAIN = "#FFFFFF";
  const TEXT_MUTED = "#CBD5E1";
  const SWITCH_THUMB_OFF = "#64748B";

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
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
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: TEXT_MAIN,
      marginBottom: 16,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingText: {
      fontSize: 16,
      color: TEXT_MAIN,
      flex: 1,
    },
    settingDescription: {
      fontSize: 12,
      color: TEXT_MUTED,
      marginTop: 2,
    },
    footer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
  });

  return (
    <StageScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTag}>Settings</Text>
          <Text style={styles.appTitle}>Jay&apos;s Quiz Hub</Text>
          <Text style={styles.appSubtitle}>Customize your quiz experience</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Audio Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Audio</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="volume-high"
                  size={24}
                  color={TEXT_MAIN}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingText}>Sound Effects</Text>
                  <Text style={styles.settingDescription}>
                    Button clicks and game sounds
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => updateSetting("soundEnabled", value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.neonGreen,
                }}
                thumbColor={
                  settings.soundEnabled
                    ? theme.colors.background
                    : SWITCH_THUMB_OFF
                }
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="musical-notes"
                  size={24}
                  color={TEXT_MAIN}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingText}>Background Music</Text>
                  <Text style={styles.settingDescription}>
                    Ambient music during gameplay
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.musicEnabled}
                onValueChange={(value) => updateSetting("musicEnabled", value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.neonGreen,
                }}
                thumbColor={
                  settings.musicEnabled
                    ? theme.colors.background
                    : SWITCH_THUMB_OFF
                }
              />
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notifications</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="notifications"
                  size={24}
                  color={TEXT_MAIN}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingText}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Daily reminders and achievements
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) =>
                  updateSetting("notificationsEnabled", value)
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.neonGreen,
                }}
                thumbColor={
                  settings.notificationsEnabled
                    ? theme.colors.background
                    : SWITCH_THUMB_OFF
                }
              />
            </View>
          </View>

          {/* Accessibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Accessibility</Text>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Ionicons
                  name="hand-left"
                  size={24}
                  color={TEXT_MAIN}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={styles.settingText}>Haptic Feedback</Text>
                  <Text style={styles.settingDescription}>
                    Vibration on button presses
                  </Text>
                </View>
              </View>
              <Switch
                value={settings.hapticFeedbackEnabled}
                onValueChange={(value) =>
                  updateSetting("hapticFeedbackEnabled", value)
                }
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.neonGreen,
                }}
                thumbColor={
                  settings.hapticFeedbackEnabled
                    ? theme.colors.background
                    : SWITCH_THUMB_OFF
                }
              />
            </View>
          </View>

          {/* Reset Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reset</Text>

            <TouchableOpacity
              style={[styles.settingItem, { justifyContent: "center" }]}
              onPress={() => {
                resetSettings();
                // Could show a toast here
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.settingText, { textAlign: "center" }]}>
                Reset All Settings
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <NeonButton
            label="Back to Menu"
            onPress={onBack}
            accessibilityLabel="Return to main menu"
            accessibilityHint="Go back to the home screen"
          />
        </View>
      </View>
    </StageScreen>
  );
};
