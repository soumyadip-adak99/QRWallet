/**
 * QRPreview - Renders a QR code with provider logo overlay
 */
import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { generateUPIUri } from '@/utils/upi';
import { getProviderById } from '@/types/upi';
import { useTheme } from '@/theme';

interface Props {
  upiId: string;
  name?: string;
  merchantName?: string;
  amount?: number;
  currency?: string;
  note?: string;
  providerId?: string;
  size?: number;
  qrColor?: string;
  backgroundColor?: string;
  showLogo?: boolean;
  animated?: boolean;
}

export function QRPreview({
  upiId,
  name,
  merchantName,
  amount,
  currency = 'INR',
  note,
  providerId = 'custom',
  size = 200,
  qrColor,
  backgroundColor,
  showLogo = true,
  animated = true,
}: Props) {
  const { isDark } = useTheme();
  const provider = getProviderById(providerId);

  const upiUri = generateUPIUri({
    upiId,
    name,
    merchantName,
    amount,
    currency,
    note,
  });

  const finalQRColor = qrColor || (isDark ? '#FFFFFF' : '#0F172A');
  const finalBg = backgroundColor || (isDark ? '#2E2E2E' : '#FFFFFF');

  const Wrapper = animated ? Animated.View : View;
  const enteringProp = animated ? { entering: ZoomIn.springify().damping(14) } : {};

  return (
    <Wrapper {...enteringProp} style={[styles.container, { backgroundColor: finalBg }]}>
      <QRCode
        value={upiUri || 'upi://pay?pa=example@upi'}
        size={size}
        color={finalQRColor}
        backgroundColor={finalBg}
        logo={undefined}
        logoSize={showLogo ? size * 0.18 : 0}
        logoBackgroundColor={finalBg}
        logoBorderRadius={10}
        quietZone={10}
        ecl="M"
      />
      {showLogo && (
        <View
          style={[
            styles.logoOverlay,
            {
              backgroundColor: provider.imageSource ? finalBg : provider.color,
              width: size * 0.22,
              height: size * 0.22,
              borderRadius: size * 0.05,
              padding: provider.imageSource ? 2 : 0,
            },
          ]}
        >
          {provider.imageSource ? (
            <Image
              source={provider.imageSource}
              style={{ width: '100%', height: '100%', borderRadius: size * 0.04 }}
              resizeMode="contain"
            />
          ) : (
            <Ionicons
              name={provider.icon as any}
              size={size * 0.1}
              color="#FFFFFF"
            />
          )}
        </View>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    position: 'relative',
  },
  logoOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
