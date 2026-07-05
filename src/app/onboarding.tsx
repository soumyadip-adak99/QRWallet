import React, { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { Button } from '@/components/ui/Button';
import { TextInput } from '@/components/ui/TextInput';
import { useSettingsStore } from '@/store/settingsStore';
import { Spacing, Typography, useTheme, BorderRadius } from '@/theme';
import { PressableScale } from '@/components/ui/AnimatedPressable';

export default function OnboardingScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const setUser = useSettingsStore((s) => s.setUser);
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);

  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
        if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (e) {
      console.log('Error picking image', e);
    }
  };

  const finishOnboarding = async (skip: boolean) => {
    Keyboard.dismiss();
    setIsSaving(true);
    
    // Simulate a tiny delay for premium loading feel
    await new Promise(resolve => setTimeout(resolve, 600));

    if (skip) {
      setUser({ name: 'Guest', photoUri: undefined });
    } else {
      const trimmed = name.trim();
      if (trimmed.length < 2) {
        setError('Name must be at least 2 characters.');
        if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsSaving(false);
        return;
      }
      if (trimmed.length > 40) {
        setError('Name must be under 40 characters.');
        if (hapticEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setIsSaving(false);
        return;
      }
      setUser({ name: trimmed, photoUri });
    }
    
    setOnboarded(true);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      {/* Top Bar with Skip */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
        <View style={styles.flex} />
        <PressableScale onPress={() => finishOnboarding(true)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </PressableScale>
      </Animated.View>

      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 40 : 60}
      >
        <Animated.View entering={ZoomIn.delay(200).duration(400).springify()} style={styles.avatarContainer}>
          <PressableScale
            onPress={handlePickImage}
            style={[
              styles.avatarPicker,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              },
            ]}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="camera" size={32} color={colors.textTertiary} />
                <Text style={[styles.avatarText, { color: colors.textTertiary }]}>Add Photo</Text>
              </View>
            )}
            
            {/* Plus badge */}
            <View style={[styles.badge, { backgroundColor: colors.primary, borderColor: colors.background }]}>
              <Ionicons name={photoUri ? "pencil" : "add"} size={16} color="#FFF" />
            </View>
          </PressableScale>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Let's get to know you</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Personalize your experience. You can always change this later in settings.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.inputContainer}>
          <TextInput
            label="Your Name"
            value={name}
            onChangeText={(val) => {
              setName(val);
              setError('');
            }}
            error={error}
            placeholder="e.g. Alex"
            autoCapitalize="words"
            autoCorrect={false}
            leftIcon={<Ionicons name="person-outline" size={20} color={colors.textTertiary} />}
            onSubmitEditing={() => finishOnboarding(false)}
            returnKeyType="done"
          />
        </Animated.View>
      </KeyboardAwareScrollView>

      <Animated.View entering={FadeInUp.delay(500).duration(400)} style={[styles.footer, { backgroundColor: colors.background }]}>
        <Button
          label={isSaving ? "Saving..." : "Continue"}
          onPress={() => finishOnboarding(false)}
          variant="primary"
          loading={isSaving}
          disabled={name.trim().length < 2}
          rightIcon={!isSaving ? <Ionicons name="arrow-forward" size={20} color="#FFF" /> : undefined}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  skipText: {
    ...Typography.subtitle2,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'center',
    paddingBottom: Spacing.xxxl * 2, // Space for keyboard
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    marginTop: Spacing.xl,
  },
  avatarPicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body1,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  inputContainer: {
    width: '100%',
  },
  footer: {
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.xl,
  },
});
