/**
 * EmptyState - Beautiful empty state with icon and CTA
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Colors } from '@/theme/colors';
import { PressableScale } from './AnimatedPressable';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: Props) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(100).springify()}
        style={[
          styles.iconContainer,
          { backgroundColor: isDark ? 'rgba(99,102,241,0.12)' : Colors.primary[50] },
        ]}
      >
        <Ionicons name={icon} size={48} color={Colors.primary[400]} />
      </Animated.View>

      <Animated.Text
        entering={FadeInUp.delay(200).springify()}
        style={[styles.title, { color: colors.text }]}
      >
        {title}
      </Animated.Text>

      <Animated.Text
        entering={FadeInUp.delay(300).springify()}
        style={[styles.subtitle, { color: colors.textSecondary }]}
      >
        {subtitle}
      </Animated.Text>

      {actionLabel && onAction && (
        <Animated.View entering={FadeInUp.delay(400).springify()}>
          <PressableScale
            onPress={onAction}
            style={[styles.button, { backgroundColor: Colors.primary[600] }]}
          >
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.buttonText}>{actionLabel}</Text>
          </PressableScale>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
