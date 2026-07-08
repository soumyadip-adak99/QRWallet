/**
 * Expo SQLite adapter for Zustand persist middleware
 */
import * as SQLite from 'expo-sqlite';
import { StateStorage } from 'zustand/middleware';

// Initialize synchronous SQLite database
const db = SQLite.openDatabaseSync('zustand.db');

// Create the key-value table if it doesn't exist
db.execSync(`
  CREATE TABLE IF NOT EXISTS store (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );
`);

export const sqliteStorage: StateStorage = {
  setItem: (name: string, value: string) => {
    try {
      db.runSync('INSERT OR REPLACE INTO store (key, value) VALUES (?, ?)', name, value);
    } catch (e) {
      console.error('Error setting item in SQLite storage', e);
    }
  },
  getItem: (name: string) => {
    try {
      const row = db.getFirstSync<{ value: string }>('SELECT value FROM store WHERE key = ?', name);
      return row ? row.value : null;
    } catch (e) {
      console.error('Error getting item from SQLite storage', e);
      return null;
    }
  },
  removeItem: (name: string) => {
    try {
      db.runSync('DELETE FROM store WHERE key = ?', name);
    } catch (e) {
      console.error('Error removing item from SQLite storage', e);
    }
  },
};
