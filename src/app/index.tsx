import { Redirect } from 'expo-router';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/theme';

export default function Index() {
  const isOnboarded = useSettingsStore((s) => s.isOnboarded);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { colors } = useTheme();

  if (!isMounted) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
