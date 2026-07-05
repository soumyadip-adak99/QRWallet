/**
 * Theme context provider with dark/light mode support
 */
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors } from './colors';
import { useSettingsStore } from '@/store/settingsStore';
import { Typography } from './typography';
import { Spacing, BorderRadius, Layout } from './spacing';

export type ThemeMode = 'light' | 'dark' | 'system';

type ThemeColorSet = {
  background: string;
  surface: string;
  surfaceElevated: string;
  deep: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryLight: string;
  accent: string;
  accentTeal: string;
  accentTealLight: string;
  divider: string;
  borderStrong: string;
  tabBar: string;
  tabBarBorder: string;
  statusBar: 'light-content' | 'dark-content';
  shadow: string;
  overlay: string;
  inputBackground: string;
  inputBorder: string;
  success: string;
  error: string;
  warning: string;
};

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColorSet;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const mode = useSettingsStore((s) => s.themeMode);
  const setMode = useSettingsStore((s) => s.setThemeMode);

  const isDark = mode === 'system' ? systemScheme === 'dark' : mode === 'dark';
  const colors: ThemeColorSet = isDark ? { ...ThemeColors.dark } : { ...ThemeColors.light };

  const toggleTheme = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo(
    () => ({ mode, isDark, colors, setMode, toggleTheme }),
    [mode, isDark, colors, setMode, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
export * from './colors';
export * from './typography';
export * from './spacing';
