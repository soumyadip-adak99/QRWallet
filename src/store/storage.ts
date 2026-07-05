/**
 * AsyncStorage adapter for Zustand persist middleware
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

export const mmkvStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    return AsyncStorage.setItem(name, value);
  },
  getItem: (name: string) => {
    return AsyncStorage.getItem(name);
  },
  removeItem: (name: string) => {
    return AsyncStorage.removeItem(name);
  },
};
