import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { PressableScale } from './AnimatedPressable';
import { useTheme, Spacing, Typography, BorderRadius, Colors, Gradients } from '@/theme';
import { LinearGradient } from 'expo-linear-gradient';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const { colors, isDark } = useTheme();

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: colors.surfaceElevated,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'danger':
        return {
          backgroundColor: isDark ? 'rgba(239,68,68,0.15)' : Colors.error.light,
          borderWidth: 0,
        };
      default:
        return {};
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'primary':
        return { color: '#FFFFFF' };
      case 'secondary':
        return { color: colors.text };
      case 'outline':
      case 'text':
        return { color: colors.primary };
      case 'danger':
        return { color: isDark ? Colors.error.light : '#FFFFFF' };
      default:
        return { color: colors.text };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg };
      case 'md':
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl };
      case 'lg':
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing.xxl };
    }
  };

  const content = (
    <View style={[styles.content, getSizeStyle()]}>
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.label, getTextStyle(), textStyle]}>{label}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </View>
  );

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled || loading}
      scaleValue={0.96}
      style={[
        styles.container,
        getContainerStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {variant === 'primary' && !disabled ? (
        <LinearGradient
          colors={Gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {content}
    </PressableScale>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    ...Typography.button,
  },
  leftIcon: {
    marginRight: Spacing.sm,
  },
  rightIcon: {
    marginLeft: Spacing.sm,
  },
  disabled: {
    opacity: 0.6,
  },
});
