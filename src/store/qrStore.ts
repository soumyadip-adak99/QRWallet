/**
 * QR Code store - manages all QR codes with MMKV persistence
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { sqliteStorage } from './storage';
import { QRCode, QRFormData, DEFAULT_CUSTOMIZATION, QRCategory } from '@/types/qr';
import { generateUPIUri } from '@/utils/upi';

// Simple ID generator to avoid uuid dependency issues
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

interface QRState {
  qrCodes: QRCode[];
  searchQuery: string;
  selectedCategory: QRCategory | 'all';
  sortBy: 'recent' | 'name' | 'provider' | 'favorite';

  // Actions
  addQR: (data: QRFormData) => QRCode;
  updateQR: (id: string, data: Partial<QRCode>) => void;
  deleteQR: (id: string) => void;
  deleteMultiple: (ids: string[]) => void;
  toggleFavorite: (id: string) => void;
  markUsed: (id: string) => void;
  markShared: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: QRCategory | 'all') => void;
  setSortBy: (sort: 'recent' | 'name' | 'provider' | 'favorite') => void;

  // Computed
  getQRById: (id: string) => QRCode | undefined;
  getFavorites: () => QRCode[];
  getRecent: (limit?: number) => QRCode[];
  getRecentlyShared: (limit?: number) => QRCode[];
  getByCategory: (category: QRCategory) => QRCode[];
  getByProvider: (providerId: string) => QRCode[];
  getFiltered: () => QRCode[];
  getStats: () => { total: number; favorites: number; shared: number; collections: number };
}

export const useQRStore = create<QRState>()(
  persist(
    (set, get) => ({
      qrCodes: [],
      searchQuery: '',
      selectedCategory: 'all',
      sortBy: 'recent',

      addQR: (data: QRFormData) => {
        const amount = data.amount ? parseFloat(data.amount) : undefined;
        const newQR: QRCode = {
          id: generateId(),
          upiId: data.upiId.trim(),
          name: data.name.trim(),
          merchantName: data.merchantName?.trim(),
          amount: amount && !isNaN(amount) ? amount : undefined,
          currency: data.currency || 'INR',
          note: data.note?.trim(),
          category: data.category,
          providerId: data.providerId,
          isFavorite: false,
          createdAt: Date.now(),
          viewCount: 0,
          shareCount: 0,
          notes: data.notes?.trim(),
          tags: data.tags,
          source: 'generated',
          customization: { ...DEFAULT_CUSTOMIZATION },
          validationStatus: 'verified',
        };

        set((state) => ({ qrCodes: [newQR, ...state.qrCodes] }));
        return newQR;
      },

      updateQR: (id, data) => {
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, ...data, updatedAt: Date.now() } : qr
          ),
        }));
      },

      deleteQR: (id) => {
        set((state) => ({
          qrCodes: state.qrCodes.filter((qr) => qr.id !== id),
        }));
      },

      deleteMultiple: (ids) => {
        set((state) => ({
          qrCodes: state.qrCodes.filter((qr) => !ids.includes(qr.id)),
        }));
      },

      toggleFavorite: (id) => {
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, isFavorite: !qr.isFavorite } : qr
          ),
        }));
      },

      markUsed: (id) => {
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id ? { ...qr, lastUsed: Date.now(), viewCount: qr.viewCount + 1 } : qr
          ),
        }));
      },

      markShared: (id) => {
        set((state) => ({
          qrCodes: state.qrCodes.map((qr) =>
            qr.id === id
              ? { ...qr, lastShared: Date.now(), shareCount: qr.shareCount + 1 }
              : qr
          ),
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSortBy: (sort) => set({ sortBy: sort }),

      getQRById: (id) => get().qrCodes.find((qr) => qr.id === id),

      getFavorites: () => get().qrCodes.filter((qr) => qr.isFavorite),

      getRecent: (limit = 5) =>
        [...get().qrCodes]
          .sort((a, b) => (b.lastUsed ?? b.createdAt) - (a.lastUsed ?? a.createdAt))
          .slice(0, limit),

      getRecentlyShared: (limit = 5) =>
        get()
          .qrCodes.filter((qr) => qr.lastShared)
          .sort((a, b) => (b.lastShared ?? 0) - (a.lastShared ?? 0))
          .slice(0, limit),

      getByCategory: (category) =>
        get().qrCodes.filter((qr) => qr.category === category),

      getByProvider: (providerId) =>
        get().qrCodes.filter((qr) => qr.providerId === providerId),

      getFiltered: () => {
        const { qrCodes, searchQuery, selectedCategory, sortBy } = get();
        let filtered = [...qrCodes];

        // Filter by category
        if (selectedCategory !== 'all') {
          filtered = filtered.filter((qr) => qr.category === selectedCategory);
        }

        // Filter by search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (qr) =>
              qr.upiId.toLowerCase().includes(q) ||
              qr.name.toLowerCase().includes(q) ||
              qr.merchantName?.toLowerCase().includes(q) ||
              qr.notes?.toLowerCase().includes(q) ||
              qr.tags?.some((t) => t.toLowerCase().includes(q))
          );
        }

        // Sort
        switch (sortBy) {
          case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'provider':
            filtered.sort((a, b) => a.providerId.localeCompare(b.providerId));
            break;
          case 'favorite':
            filtered.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
            break;
          case 'recent':
          default:
            filtered.sort((a, b) => b.createdAt - a.createdAt);
            break;
        }

        return filtered;
      },

      getStats: () => {
        const codes = get().qrCodes;
        const collections = new Set(codes.map((qr) => qr.collectionId).filter(Boolean));
        return {
          total: codes.length,
          favorites: codes.filter((qr) => qr.isFavorite).length,
          shared: codes.filter((qr) => qr.lastShared).length,
          collections: codes.length === 0 ? 0 : Math.max(1, collections.size),
        };
      },
    }),
    {
      name: 'qr-store',
      storage: createJSONStorage(() => sqliteStorage),
      partialize: (state) => ({
        qrCodes: state.qrCodes,
      }),
    }
  )
);
