/**
 * GlassCard - Premium frosted glass card with blur effect
 */
import React from 'react';
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  index?: number;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function GlassCard({ children, style, index = 0, variant = 'default' }: Props) {
  const { isDark, colors } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: isDark
      ? variant === 'elevated'
        ? 'rgba(255,255,255,0.08)'
        : 'rgba(255,255,255,0.05)'
      : variant === 'elevated'
      ? '#FFFFFF'
      : '#FFFFFF',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
    borderRadius: 20,
    overflow: 'hidden',
    ...(isDark
      ? {}
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }),
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).duration(400).springify()}
      style={[cardStyle, styles.card, style]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
});
