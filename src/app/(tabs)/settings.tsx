/**
 * Settings Screen - App preferences and profile
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, ThemeMode, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors } from '@/theme/colors';
import { useSettingsStore } from '@/store/settingsStore';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  index?: number;
}

function SettingsItem({
  icon,
  iconColor,
  label,
  subtitle,
  onPress,
  rightElement,
  index = 0,
}: SettingsItemProps) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View>
      <PressableScale onPress={onPress} scaleValue={0.98}>
        <View style={styles.settingsItem}>
          <View
            style={[
              styles.settingsIcon,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : `${iconColor || colors.accentTeal}15`,
              },
            ]}
          >
            <Ionicons
              name={icon}
              size={18}
              color={iconColor || colors.accentTeal}
            />
          </View>
          <View style={styles.settingsInfo}>
            <Text style={[styles.settingsLabel, { color: colors.text }]}>{label}</Text>
            {subtitle && (
              <Text style={[styles.settingsSubtitle, { color: colors.textSecondary }]}>
                {subtitle}
              </Text>
            )}
          </View>
          {rightElement || (
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          )}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export default function SettingsScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);
  const setHapticEnabled = useSettingsStore((s) => s.setHapticEnabled);
  const user = useSettingsStore((s) => s.user);
  const setUser = useSettingsStore((s) => s.setUser);
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user.name);

  const themeModes: { key: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'light', label: 'Light', icon: 'sunny' },
    { key: 'dark', label: 'Dark', icon: 'moon' },
    { key: 'system', label: 'System', icon: 'phone-portrait' },
  ];

  const handleSaveProfile = () => {
    if (editName.trim().length >= 2) {
      setUser({ name: editName.trim() });
      setIsEditingProfile(false);
      if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Profile Updated', 'Your profile name has been updated successfully.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0].uri) {
        setUser({ photoUri: result.assets[0].uri });
        if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Profile Picture Updated', 'Your profile picture has been updated successfully.');
      }
    } catch (e) {
      console.log('Error picking image', e);
    }
  };

  const showPrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "No data will share any server. All data will be present in your app only.",
      [{ text: "OK" }]
    );
  };

  const handleSendFeedback = () => {
    Linking.openURL("mailto:work.soumyadipadak@gmail.com?subject=QRWallet Feedback");
  };

  const handleRateApp = () => {
    Linking.openURL("mailto:work.soumyadipadak@gmail.com?subject=QRWallet Rating");
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
            </Animated.View>

            {/* Profile Section */}
            <Animated.View>
              <View
                style={[
                  styles.profileCard,
                  {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  },
                ]}
              >
                {!isEditingProfile ? (
                  <>
                    <PressableScale
                      onPress={handlePickImage}
                      style={[
                        styles.profileAvatar,
                        { backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : colors.primaryLight },
                      ]}
                    >
                      {user.photoUri ? (
                        <Image
                          source={{ uri: user.photoUri }}
                          style={styles.profileImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={28} color={colors.accentTeal} />
                      )}
                      <View style={styles.cameraIconBadge}>
                        <Ionicons name="camera" size={12} color="#FFF" />
                      </View>
                    </PressableScale>
                    <View style={styles.profileInfo}>
                      <Text style={[styles.profileName, { color: colors.text }]}>{user.name}</Text>
                      <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
                        Tap to edit profile
                      </Text>
                    </View>
                    <PressableScale onPress={() => setIsEditingProfile(true)} style={styles.editButton}>
                      <Ionicons name="pencil" size={20} color={colors.accentTeal} />
                    </PressableScale>
                  </>
                ) : (
                  <View style={styles.editProfileContainer}>
                    <TextInput
                      label="Your Name"
                      value={editName}
                      onChangeText={setEditName}
                      autoCapitalize="words"
                      leftIcon={<Ionicons name="person-outline" size={20} color={colors.textTertiary} />}
                      style={{ height: 48 }}
                    />
                    <View style={styles.editActions}>
                      <Button
                        label="Cancel"
                        variant="text"
                        onPress={() => {
                          setEditName(user.name);
                          setIsEditingProfile(false);
                        }}
                        style={{ flex: 1 }}
                      />
                      <Button
                        label="Save"
                        variant="primary"
                        onPress={handleSaveProfile}
                        disabled={editName.trim().length < 2}
                        style={{ flex: 1 }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </Animated.View>

            {/* Appearance */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
            <Animated.View
             
              style={[
                styles.themeSelector,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              {themeModes.map((mode) => (
                <PressableScale
                  key={mode.key}
                  onPress={() => {
                    setThemeMode(mode.key);
                  }}
                  style={[
                    styles.themeModeButton,
                    themeMode === mode.key && {
                      backgroundColor: isDark
                        ? 'rgba(99,102,241,0.15)'
                        : colors.primaryLight,
                    },
                  ]}
                >
                  <Ionicons
                    name={mode.icon}
                    size={18}
                    color={
                      themeMode === mode.key
                        ? colors.accentTeal
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={{
                      color:
                        themeMode === mode.key
                          ? colors.accentTeal
                          : colors.textSecondary,
                      fontSize: 13,
                      fontWeight: themeMode === mode.key ? '600' : '400',
                    }}
                  >
                    {mode.label}
                  </Text>
                </PressableScale>
              ))}
            </Animated.View>

            {/* General */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>GENERAL</Text>
            <View
              style={[
                styles.settingsGroup,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <SettingsItem
                icon="hand-left"
                label="Haptic Feedback"
                index={1}
                rightElement={
                  <Switch
                    value={hapticEnabled}
                    onValueChange={setHapticEnabled}
                    trackColor={{
                      false: isDark ? '#333' : '#D4D4D4',
                      true: colors.accentTeal,
                    }}
                    thumbColor="#FFF"
                  />
                }
              />
            </View>

            {/* About */}
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
            <View
              style={[
                styles.settingsGroup,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <SettingsItem
                icon="information-circle"
                label="About QRWallet"
                subtitle="Version 1.0.0"
                index={2}
              />
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <SettingsItem
                icon="document-text"
                label="Privacy Policy"
                index={3}
                onPress={showPrivacyPolicy}
              />
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <SettingsItem
                icon="star"
                iconColor="#F59E0B"
                label="Rate App"
                index={4}
                onPress={handleRateApp}
              />
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <SettingsItem
                icon="chatbubble"
                iconColor="#10B981"
                label="Send Feedback"
                index={5}
                onPress={handleSendFeedback}
              />
              <View style={[styles.divider, { backgroundColor: colors.divider }]} />
              <SettingsItem
                icon="code-working"
                iconColor={colors.error}
                label="Developer: Reset App"
                subtitle="View the onboarding name flow again"
                index={6}
                onPress={() => {
                  Alert.alert('Reset App?', 'This will take you back to the onboarding screen.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Reset', style: 'destructive', onPress: () => {
                        setOnboarded(false);
                        router.replace('/');
                    }}
                  ]);
                }}
              />
            </View>

            <View style={{ height: Spacing.massive }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  title: {
    ...Typography.h1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.xxl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 4,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    ...Typography.h4,
  },
  profileEmail: {
    ...Typography.caption,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  editProfileContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  editActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  sectionTitle: {
    ...Typography.caption,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  themeSelector: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xxl,
    padding: Spacing.xs,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  themeModeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.xs,
  },
  settingsGroup: {
    marginHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsInfo: {
    flex: 1,
    gap: 2,
  },
  settingsLabel: {
    ...Typography.subtitle1,
  },
  settingsSubtitle: {
    ...Typography.caption,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
});
