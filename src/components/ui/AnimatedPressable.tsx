/**
 * AnimatedPressable - Premium pressable with spring scale + haptic
 */
import React, { useCallback } from 'react';
import { Pressable, PressableProps, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/settingsStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  hapticStyle?: 'light' | 'medium' | 'heavy' | 'none';
}

export function PressableScale({
  children,
  style,
  scaleValue = 0.97,
  hapticStyle = 'light',
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: Props) {
  const scale = useSharedValue(1);
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(
    (e: any) => {
      scale.value = withSpring(scaleValue, { damping: 15, stiffness: 400 });
      if (hapticEnabled && hapticStyle !== 'none') {
        const impactStyle =
          hapticStyle === 'heavy'
            ? Haptics.ImpactFeedbackStyle.Heavy
            : hapticStyle === 'medium'
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light;
        Haptics.impactAsync(impactStyle);
      }
      onPressIn?.(e);
    },
    [scaleValue, hapticEnabled, hapticStyle, onPressIn, scale]
  );

  const handlePressOut = useCallback(
    (e: any) => {
      scale.value = withSpring(1, { damping: 15, stiffness: 400 });
      onPressOut?.(e);
    },
    [onPressOut, scale]
  );

  return (
    <AnimatedPressable
      style={[animStyle, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}
