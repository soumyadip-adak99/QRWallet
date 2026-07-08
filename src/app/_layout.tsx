/**
 * Root Layout - App entry with providers
 */
import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '@/theme';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useSettingsStore } from '@/store/settingsStore';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const { isOnboarded } = useSettingsStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isOnboarded && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    }
    SplashScreen.hideAsync();
  }, [isOnboarded, segments]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="qr/[id]"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="qr/edit/[id]"
          options={{
            animation: 'slide_from_right',
            presentation: 'card',
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
