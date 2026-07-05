/**
 * Core QR Code types for VaultQR / QRWallet
 */

export type QRCategory =
  | 'personal'
  | 'business'
  | 'shop'
  | 'restaurant'
  | 'medical'
  | 'education'
  | 'travel'
  | 'family'
  | 'friends'
  | 'others';

export type QRSource = 'generated' | 'imported';

export type ValidationStatus = 'verified' | 'warning' | 'invalid' | 'unknown';

export interface QRCustomization {
  qrColor: string;
  backgroundColor: string;
  frameStyle: 'default' | 'rounded' | 'dotted' | 'elegant';
  gradientColors?: [string, string];
  showLogo: boolean;
  showProfilePhoto: boolean;
}

export interface QRCode {
  id: string;
  upiId: string;
  name: string;
  merchantName?: string;
  amount?: number;
  currency: string;
  note?: string;
  category: QRCategory;
  providerId: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt?: number;
  lastUsed?: number;
  lastShared?: number;
  viewCount: number;
  shareCount: number;
  notes?: string;
  tags?: string[];
  collectionId?: string;
  source: QRSource;
  customization: QRCustomization;
  validationStatus: ValidationStatus;
}

export interface QRFormData {
  upiId: string;
  name: string;
  merchantName?: string;
  amount?: string;
  currency: string;
  note?: string;
  category: QRCategory;
  providerId: string;
  notes?: string;
  tags?: string[];
}

export interface QRStats {
  totalQRCodes: number;
  totalFavorites: number;
  totalShared: number;
  totalCollections: number;
}

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  qrColor: '#FFFFFF',
  backgroundColor: 'transparent',
  frameStyle: 'default',
  showLogo: true,
  showProfilePhoto: false,
};

export const CATEGORIES: { id: QRCategory; label: string; icon: string }[] = [
  { id: 'personal', label: 'Personal', icon: 'person' },
  { id: 'business', label: 'Business', icon: 'briefcase' },
  { id: 'shop', label: 'Shop', icon: 'storefront' },
  { id: 'restaurant', label: 'Restaurant', icon: 'restaurant' },
  { id: 'medical', label: 'Medical', icon: 'medical' },
  { id: 'education', label: 'Education', icon: 'school' },
  { id: 'travel', label: 'Travel', icon: 'airplane' },
  { id: 'family', label: 'Family', icon: 'people' },
  { id: 'friends', label: 'Friends', icon: 'heart' },
  { id: 'others', label: 'Others', icon: 'grid' },
];
