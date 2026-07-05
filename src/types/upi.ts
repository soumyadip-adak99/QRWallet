/**
 * UPI Provider definitions with brand colors and metadata
 */

export interface UPIProvider {
  id: string;
  name: string;
  shortName: string;
  color: string;
  gradientColors: [string, string];
  icon: string; // Ionicon name
  imageSource?: any; // require() image path
  upiHandle?: string;
}

export const UPI_PROVIDERS: UPIProvider[] = [
  {
    id: 'googlepay',
    name: 'Google Pay',
    shortName: 'GPay',
    color: '#4285F4',
    gradientColors: ['#4285F4', '#34A853'],
    icon: 'logo-google',
    imageSource: require('@/assets/images/googlepay.png'),
    upiHandle: '@okicici',
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    shortName: 'PhonePe',
    color: '#5F259F',
    gradientColors: ['#5F259F', '#8B5CF6'],
    icon: 'phone-portrait',
    imageSource: require('@/assets/images/phone-pe.png'),
    upiHandle: '@ybl',
  },
  {
    id: 'paytm',
    name: 'Paytm',
    shortName: 'Paytm',
    color: '#00BAF2',
    gradientColors: ['#00BAF2', '#003087'],
    icon: 'wallet',
    imageSource: require('@/assets/images/paytm.png'),
    upiHandle: '@paytm',
  },
  {
    id: 'amazonpay',
    name: 'Amazon Pay',
    shortName: 'Amazon Pay',
    color: '#FF9900',
    gradientColors: ['#FF9900', '#FF6600'],
    icon: 'cart',
    imageSource: require('@/assets/images/amazon-pay.png'),
    upiHandle: '@apl',
  },
  {
    id: 'supermoney',
    name: 'Super.money',
    shortName: 'Super.money',
    color: '#6C5CE7',
    gradientColors: ['#6C5CE7', '#A29BFE'],
    icon: 'flash',
     imageSource: require('@/assets/images/supermoney.png'),
    upiHandle: '@super',
  },
  {
    id: 'bhim',
    name: 'BHIM',
    shortName: 'BHIM',
    color: '#00BCD4',
    gradientColors: ['#00BCD4', '#0097A7'],
    icon: 'shield-checkmark',
    imageSource: require('@/assets/images/bhim.png'),
    upiHandle: '@upi',
  },
  {
    id: 'cred',
    name: 'CRED',
    shortName: 'CRED',
    color: '#1A1A2E',
    gradientColors: ['#1A1A2E', '#4A4A6A'],
    icon: 'diamond',
    imageSource: require('@/assets/images/cred.png'),
    upiHandle: '@cred',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Pay',
    shortName: 'WhatsApp',
    color: '#25D366',
    gradientColors: ['#25D366', '#128C7E'],
    icon: 'logo-whatsapp',
    upiHandle: '@wa',
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    shortName: 'Axis',
    color: '#97144D',
    gradientColors: ['#97144D', '#C4185A'],
    icon: 'business',
    imageSource: require('@/assets/images/axis.png'),
    upiHandle: '@axisbank',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    shortName: 'ICICI',
    color: '#F58220',
    gradientColors: ['#F58220', '#B0631B'],
    icon: 'business',
    imageSource: require('@/assets/images/icici.png'),
    upiHandle: '@icici',
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    shortName: 'HDFC',
    color: '#004C8F',
    gradientColors: ['#004C8F', '#002D5C'],
    icon: 'business',
    imageSource: require('@/assets/images/hdfc.png'),
    upiHandle: '@hdfcbank',
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    shortName: 'SBI',
    color: '#1A73E8',
    gradientColors: ['#1A73E8', '#0D47A1'],
    icon: 'business',
    imageSource: require('@/assets/images/sbi.png'),
    upiHandle: '@sbi',
  },
  {
    id: 'kotak',
    name: 'Kotak Bank',
    shortName: 'Kotak',
    color: '#ED1C24',
    gradientColors: ['#ED1C24', '#B71C1C'],
    icon: 'business',
    imageSource: require('@/assets/images/kotak.png'),
    upiHandle: '@kotak',
  },
  {
    id: 'idfc',
    name: 'IDFC First Bank',
    shortName: 'IDFC',
    color: '#9C1D26',
    gradientColors: ['#9C1D26', '#6D141A'],
    icon: 'business',
    imageSource: require('@/assets/images/idfc.png'),
    upiHandle: '@idfcbank',
  },
  {
    id: 'custom',
    name: 'Custom / Other',
    shortName: 'Custom',
    color: '#6366F1',
    gradientColors: ['#6366F1', '#8B5CF6'],
    icon: 'apps',
  },
];

export function getProviderById(id: string): UPIProvider {
  return UPI_PROVIDERS.find((p) => p.id === id) ?? UPI_PROVIDERS[UPI_PROVIDERS.length - 1];
}
