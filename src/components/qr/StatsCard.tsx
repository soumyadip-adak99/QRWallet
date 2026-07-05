/**
 * StatsCard - Animated counter card for dashboard
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors, Gradients } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableScale } from '@/components/ui/AnimatedPressable';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: number;
  gradient?: [string, string];
  index?: number;
  onPress?: () => void;
}

export function StatsCard({
  icon,
  label,
  value,
  gradient = Gradients.primary,
  index = 0,
  onPress,
}: Props) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.delay(index * 80).duration(400).springify()}>
      <PressableScale onPress={onPress} scaleValue={0.95} disabled={!onPress}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Ionicons name={icon} size={18} color="#FFF" />
          </LinearGradient>

          <View style={styles.textContainer}>
            <Text style={[styles.value, { color: colors.text }]} numberOfLines={1}>
              {value}
            </Text>
            <Text style={[styles.label, { color: colors.textSecondary }]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </View>
      </PressableScale>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140, // Slightly reduced to fit more
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    height: 140, // Fixed height for alignment
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    gap: 4,
  },
  value: {
    ...Typography.h2,
  },
  label: {
    ...Typography.caption,
    fontWeight: '500',
  },
});
