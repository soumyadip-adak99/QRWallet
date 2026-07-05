/**
 * UPI URI generation, parsing, and validation utilities
 * Follows official UPI Deep Link Specification
 * Format: upi://pay?pa=<UPI_ID>&pn=<NAME>&am=<AMOUNT>&cu=<CURRENCY>&tn=<NOTE>
 */

export interface UPIParams {
  pa: string;       // Payee VPA (UPI ID)
  pn?: string;      // Payee Name
  mc?: string;      // Merchant Category Code
  tid?: string;     // Transaction ID
  tr?: string;      // Transaction Reference
  tn?: string;      // Transaction Note
  am?: string;      // Amount
  cu?: string;      // Currency (default INR)
  url?: string;     // URL
  mn?: string;      // Merchant Name
}

/**
 * Generate a valid UPI payment URI
 */
export function generateUPIUri(params: {
  upiId: string;
  name?: string;
  merchantName?: string;
  amount?: number;
  currency?: string;
  note?: string;
}): string {
  const { upiId, name, merchantName, amount, currency = 'INR', note } = params;

  const queryParams: string[] = [`pa=${encodeURIComponent(upiId)}`];

  if (name) queryParams.push(`pn=${encodeURIComponent(name)}`);
  if (merchantName) queryParams.push(`mn=${encodeURIComponent(merchantName)}`);
  if (amount && amount > 0) queryParams.push(`am=${amount.toFixed(2)}`);
  queryParams.push(`cu=${currency}`);
  if (note) queryParams.push(`tn=${encodeURIComponent(note)}`);

  return `upi://pay?${queryParams.join('&')}`;
}

/**
 * Parse a UPI URI into its component parts
 */
export function parseUPIUri(uri: string): UPIParams | null {
  try {
    if (!uri.startsWith('upi://pay?')) return null;

    const queryString = uri.replace('upi://pay?', '');
    const params: Record<string, string> = {};

    queryString.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && value !== undefined) {
        params[key] = decodeURIComponent(value);
      }
    });

    if (!params.pa) return null;

    return {
      pa: params.pa,
      pn: params.pn,
      mc: params.mc,
      tid: params.tid,
      tr: params.tr,
      tn: params.tn,
      am: params.am,
      cu: params.cu || 'INR',
      url: params.url,
      mn: params.mn,
    };
  } catch {
    return null;
  }
}

/**
 * Validate a UPI ID format
 * Valid formats: username@provider (e.g., user@okicici, user@ybl)
 */
export function validateUPIId(upiId: string): {
  isValid: boolean;
  error?: string;
} {
  if (!upiId || upiId.trim().length === 0) {
    return { isValid: false, error: 'UPI ID is required' };
  }

  const trimmed = upiId.trim();

  // Basic format: alphanumeric._ @ alphanumeric
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;

  if (!upiRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid UPI ID format. Expected: name@provider' };
  }

  const [localPart, provider] = trimmed.split('@');

  if (localPart.length < 1) {
    return { isValid: false, error: 'UPI ID username is too short' };
  }

  if (provider.length < 2) {
    return { isValid: false, error: 'Invalid UPI provider handle' };
  }

  return { isValid: true };
}

/**
 * Validate a UPI URI string
 */
export function validateUPIUri(uri: string): {
  isValid: boolean;
  status: 'verified' | 'warning' | 'invalid' | 'unknown';
  message: string;
  params?: UPIParams;
} {
  if (!uri || uri.trim().length === 0) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Empty QR content',
    };
  }

  if (!uri.startsWith('upi://')) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Not a valid UPI QR code. Expected UPI payment link.',
    };
  }

  if (!uri.startsWith('upi://pay?')) {
    return {
      isValid: false,
      status: 'warning',
      message: 'UPI URI found but missing payment parameters.',
    };
  }

  const params = parseUPIUri(uri);

  if (!params) {
    return {
      isValid: false,
      status: 'invalid',
      message: 'Unable to parse UPI payment parameters.',
    };
  }

  const upiValidation = validateUPIId(params.pa);

  if (!upiValidation.isValid) {
    return {
      isValid: false,
      status: 'invalid',
      message: `Invalid UPI ID: ${upiValidation.error}`,
      params,
    };
  }

  if (params.am) {
    const amount = parseFloat(params.am);
    if (isNaN(amount) || amount < 0) {
      return {
        isValid: false,
        status: 'warning',
        message: 'Invalid payment amount in QR code.',
        params,
      };
    }
  }

  return {
    isValid: true,
    status: 'verified',
    message: 'Valid UPI payment QR code',
    params,
  };
}

/**
 * Format currency amount for display
 */
export function formatAmount(amount: number, currency: string = 'INR'): string {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${currency} ${amount.toFixed(2)}`;
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return new Date(timestamp).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}
