import React, { forwardRef, useState } from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { Colors } from '@/theme/colors';
import { Spacing, Typography, BorderRadius } from '@/theme';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      style,
      onFocus,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    
    // Animation for floating label
    const hasValue = value ? value.length > 0 : false;
    const isFloating = isFocused || hasValue;
    
    const floatAnim = useSharedValue(isFloating ? 1 : 0);
    
    React.useEffect(() => {
      floatAnim.value = withTiming(isFloating ? 1 : 0, { duration: 150 });
    }, [isFloating, floatAnim]);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const labelStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: floatAnim.value * -12 },
          { scale: 1 - floatAnim.value * 0.15 },
        ],
        color: error
          ? Colors.error.light
          : isFocused
          ? colors.primary
          : colors.textTertiary,
      };
    });

    const borderColor = error
      ? Colors.error.light
      : isFocused
      ? colors.primary
      : colors.inputBorder;

    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.inputBackground,
              borderColor,
            },
          ]}
        >
          {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
          
          <View style={styles.contentContainer}>
            {label && (
              <Animated.Text
                style={[
                  styles.label,
                  labelStyle,
                  { color: colors.textTertiary },
                ]}
              >
                {label}
              </Animated.Text>
            )}
            <RNTextInput
              ref={ref}
              style={[
                styles.input,
                { color: colors.text },
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                style,
              ]}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={value}
              placeholderTextColor={colors.textTertiary}
              {...props}
              placeholder={isFocused ? props.placeholder : ''}
            />
          </View>

          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </Animated.View>
        
        {(error || helperText) && (
          <Text
            style={[
              styles.helperText,
              { color: error ? Colors.error.light : colors.textTertiary },
            ]}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 1.5,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    position: 'absolute',
    left: 4,
    ...Typography.body1,
  },
  input: {
    ...Typography.body1,
    paddingTop: 16,
    paddingBottom: 0,
    height: '100%',
  },
  iconContainer: {
    paddingHorizontal: Spacing.xs,
  },
  helperText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
});
