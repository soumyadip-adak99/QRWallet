/**
 * Settings store with theme and user preferences
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';
import { ThemeMode } from '@/theme';

interface UserProfile {
  name: string;
  photoUri?: string;
}

interface SettingsState {
  themeMode: ThemeMode;
  user: UserProfile;
  isOnboarded: boolean;
  securityEnabled: boolean;
  screenshotProtection: boolean;
  hapticEnabled: boolean;

  setThemeMode: (mode: ThemeMode) => void;
  setUser: (user: Partial<UserProfile>) => void;
  setOnboarded: (v: boolean) => void;
  setSecurityEnabled: (v: boolean) => void;
  setScreenshotProtection: (v: boolean) => void;
  setHapticEnabled: (v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      themeMode: 'dark',
      user: { name: 'User' },
      isOnboarded: false,
      securityEnabled: false,
      screenshotProtection: false,
      hapticEnabled: true,

      setThemeMode: (mode) => set({ themeMode: mode }),
      setUser: (user) =>
        set((state) => ({ user: { ...state.user, ...user } })),
      setOnboarded: (v) => set({ isOnboarded: v }),
      setSecurityEnabled: (v) => set({ securityEnabled: v }),
      setScreenshotProtection: (v) => set({ screenshotProtection: v }),
      setHapticEnabled: (v) => set({ hapticEnabled: v }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
