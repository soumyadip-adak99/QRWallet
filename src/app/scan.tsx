import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Dimensions, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '@/store/settingsStore';
import { useTheme, Typography, Spacing, BorderRadius } from '@/theme';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { Button } from '@/components/ui/Button';

const { width } = Dimensions.get('window');
const overlayPadding = Spacing.xxxl;
const maskSize = width - overlayPadding * 2;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();
  const hapticEnabled = useSettingsStore((s) => s.hapticEnabled);

  const { width } = Dimensions.get('window');
  const maskSize = width * 0.75;

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: Spacing.xxxl, justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.permissionContent}>
          <Ionicons name="camera" size={64} color={colors.primary} style={{ marginBottom: Spacing.xl }} />
          <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>Camera Access</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xxxl, paddingHorizontal: Spacing.lg }]}>
            We need access to your camera to scan QR codes securely.
          </Text>
          <View style={{ width: '100%' }}>
            <Button label="Grant Permission" onPress={requestPermission} variant="primary" />
          </View>
          <PressableScale onPress={() => router.back()} style={{ marginTop: Spacing.xl, padding: Spacing.sm }}>
            <Text style={{ color: colors.textSecondary, fontWeight: '600', fontSize: 16 }}>Cancel</Text>
          </PressableScale>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    setScanned(true);

    if (hapticEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    try {
      if (data.toLowerCase().startsWith('upi://pay')) {
        const paramsString = data.split('?')[1];
        if (paramsString) {
          const params = paramsString.split('&').reduce((acc: any, current) => {
            const [key, value] = current.split('=');
            if (key && value) {
              acc[key] = decodeURIComponent(value.replace(/\+/g, ' '));
            }
            return acc;
          }, {});

          const pa = params.pa || '';
          const pn = params.pn || '';

          if (pa) {
            router.replace({ pathname: '/(tabs)/add', params: { upiId: pa, name: pn } });
            return;
          }
        }
      }
      
      Alert.alert(
        'Invalid QR Code',
        'Please scan a valid UPI payment QR code.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
      
    } catch (e) {
      Alert.alert(
        'Scan Error',
        'Failed to parse QR Code data.',
        [{ text: 'OK', onPress: () => setScanned(false) }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Overlay Mask built directly inside CameraView */}
        <View style={styles.overlayTop} />
        <View style={[styles.overlayMiddle, { height: maskSize }]}>
          <View style={styles.overlaySide} />
          <View style={[styles.scanFrame, { width: maskSize }]}>
            {/* Frame corners */}
            <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
          </View>
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom} />
      </CameraView>

      {/* Header Controls */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <PressableScale
            onPress={() => router.back()}
            style={[styles.closeBtn, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
          >
            <Ionicons name="close" size={24} color="#FFF" />
          </PressableScale>
          <Text style={styles.headerTitle}>Scan QR Code</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <SafeAreaView style={styles.footerSafeArea} edges={['bottom']}>
        <Text style={styles.instruction}>
          Point your camera at a UPI QR code to scan
        </Text>
      </SafeAreaView>
    </View>
  );
}

const overlayColor = 'rgba(0,0,0,0.6)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  permissionContent: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body1,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  overlayMiddle: {
    flexDirection: 'row',
  },
  overlaySide: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  scanFrame: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: overlayColor,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSafeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Spacing.xxxl,
  },
  instruction: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
});
