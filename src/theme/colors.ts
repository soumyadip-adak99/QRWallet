/**
 * QRWallet Premium Color System
 * Teal and Grayscale minimalist palette
 */

export const Colors = {
  // Primary brand palette (Teal)
  primary: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E',
    800: '#115E59',
    900: '#134E4A',
  },
  // Accent (Cyan)
  accent: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  // Violet gradient
  violet: {
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
  },
  // Cyan accent
  cyan: {
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
  },
  // Status
  success: {
    light: '#10B981',
    dark: '#34D399',
  },
  warning: {
    light: '#F59E0B',
    dark: '#FBBF24',
  },
  error: {
    light: '#EF4444',
    dark: '#F87171',
  },
  // Neutrals
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
} as const;

export const ThemeColors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    deep: '#F1F5F9',
    card: '#FFFFFF',
    cardBorder: 'rgba(0,0,0,0.06)',
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    primary: '#0D9488',
    primaryLight: 'rgba(20,184,166,0.10)',
    accent: '#0F766E',
    accentTeal: '#14B8A6',
    accentTealLight: '#0D9488',
    divider: '#E2E8F0',
    borderStrong: '#CBD5E1',
    tabBar: 'rgba(255,255,255,0.95)',
    tabBarBorder: 'rgba(0,0,0,0.05)',
    statusBar: 'dark-content' as const,
    shadow: 'rgba(0,0,0,0.08)',
    overlay: 'rgba(0,0,0,0.4)',
    inputBackground: '#F1F5F9',
    inputBorder: '#E2E8F0',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
  },
  dark: {
    background: '#262626',
    surface: '#2E2E2E',
    surfaceElevated: '#383838',
    deep: '#1B1B1B',
    card: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.06)',
    text: '#F5F5F5',
    textSecondary: '#A8A8A8',
    textTertiary: '#757575',
    primary: '#14B8A6',
    primaryLight: 'rgba(20,184,166,0.15)',
    accent: '#5EEAD4',
    accentTeal: '#14B8A6',
    accentTealLight: '#5EEAD4',
    divider: '#3A3A3A',
    borderStrong: '#4A4A4A',
    tabBar: '#1B1B1B',
    tabBarBorder: '#2E2E2E',
    statusBar: 'light-content' as const,
    shadow: 'rgba(0,0,0,0.4)',
    overlay: 'rgba(0,0,0,0.6)',
    inputBackground: 'rgba(255,255,255,0.05)',
    inputBorder: '#3A3A3A',
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
  },
} as const;

export const Gradients = {
  primary: ['#14B8A6', '#0D9488'] as [string, string],
  accent: ['#5EEAD4', '#14B8A6'] as [string, string],
  brand: ['#1B1B1B', '#262626'] as [string, string],
  card: ['rgba(20,184,166,0.08)', 'rgba(20,184,166,0.03)'] as [string, string],
  cardLight: ['rgba(20,184,166,0.05)', 'rgba(20,184,166,0.02)'] as [string, string],
  success: ['#22C55E', '#16A34A'] as [string, string],
  sunset: ['#F59E0B', '#EF4444'] as [string, string],
  ocean: ['#06B6D4', '#14B8A6'] as [string, string],
  rose: ['#F43F5E', '#EC4899'] as [string, string],
} as const;
