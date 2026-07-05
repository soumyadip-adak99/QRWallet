/**
 * QR Detail Screen — Premium Minimalist Design
 * Teal accent, stroke-only icons, full-screen QR animation, share card with amount
 */
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { useTheme, Spacing, BorderRadius, Layout } from '@/theme';
import { Colors } from '@/theme/colors';
import { useQRStore } from '@/store/qrStore';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { QRPreview } from '@/components/qr/QRPreview';
import { getProviderById } from '@/types/upi';
import { formatAmount, generateUPIUri } from '@/utils/upi';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const ICON_SIZE = 22;
const ICON_SIZE_HEADER = 24;
const TOUCH_TARGET = 40;

// ─── Icon Button Component ──────────────────────────────────────────────────
function IconButton({ name, size = ICON_SIZE, color, onPress, style }: {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color: string;
  onPress: () => void;
  style?: any;
}) {
  return (
    <PressableScale onPress={onPress} scaleValue={0.92} style={[styles.iconButton, style]}>
      <Ionicons name={name} size={size} color={color} />
    </PressableScale>
  );
}

// ─── Full Screen QR Modal ───────────────────────────────────────────────────
function FullScreenQR({ visible, onClose, colors, qr, effectiveAmount, provider }: any) {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const settle = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) });
      // Settle bounce: 1.03 → 1.0
      settle.value = withSequence(
        withTiming(1.03, { duration: 350, easing: Easing.out(Easing.cubic) }),
        withSpring(1, { damping: 18, stiffness: 180 })
      );
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    progress.value = withTiming(0, { duration: 320, easing: Easing.in(Easing.cubic) });
    settle.value = withTiming(0.85, { duration: 320, easing: Easing.in(Easing.cubic) }, () => {
      runOnJS(onClose)();
    });
  }, [onClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.value, [0, 1], [0.85, 1]) * settle.value },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [24, 0]),
    opacity: progress.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent statusBarTranslucent animationType="none" visible={visible}>
      <Animated.View style={[styles.fullScreenBackdrop, { backgroundColor: colors.deep }, backdropStyle]}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[styles.fullScreenCard, cardStyle]}>
          <View style={styles.fullScreenQrPlate}>
            <QRPreview
              upiId={qr.upiId}
              name={qr.name}
              merchantName={qr.merchantName}
              amount={effectiveAmount}
              currency={qr.currency}
              note={qr.note}
              providerId={qr.providerId}
              size={SCREEN_W * 0.7}
              showLogo={false}
              animated={false}
              backgroundColor="#FFFFFF"
              qrColor="#000000"
            />
          </View>
          <Text style={[styles.fullScreenName, { color: '#F5F5F5' }]}>{qr.name}</Text>
          <Text style={[styles.fullScreenUpi, { color: '#A8A8A8' }]}>{qr.upiId}</Text>
          {effectiveAmount && (
            <View style={[styles.fullScreenAmountBadge, { backgroundColor: 'rgba(20,184,166,0.15)' }]}>
              <Text style={[styles.fullScreenAmountText, { color: '#5EEAD4' }]}>
                ₹{effectiveAmount}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Close button */}
        <PressableScale
          onPress={handleClose}
          style={[styles.fullScreenClose, { top: insets.top + 16 }]}
          hapticStyle="medium"
        >
          <Ionicons name="close-outline" size={28} color="#F5F5F5" />
        </PressableScale>
      </Animated.View>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════
export default function QRDetailScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [tempAmount, setTempAmount] = useState<string>('');
  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const viewShotRef = useRef<any>(null);

  const qr = useQRStore((s) => s.getQRById(id));
  const toggleFavorite = useQRStore((s) => s.toggleFavorite);
  const deleteQR = useQRStore((s) => s.deleteQR);
  const markUsed = useQRStore((s) => s.markUsed);

  useEffect(() => {
    if (id && qr) markUsed(id);
  }, [id]);

  // ── Not Found ──
  if (!qr) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
          <Text style={[styles.notFoundText, { color: colors.text }]}>QR Not Found</Text>
          <PressableScale onPress={() => router.back()}>
            <Text style={{ color: colors.accentTeal, fontWeight: '600', fontSize: 15 }}>Go Back</Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  // ── Derived ──
  const parsedTempAmount = parseFloat(tempAmount);
  const effectiveAmount = qr.amount || (!isNaN(parsedTempAmount) && parsedTempAmount > 0 ? parsedTempAmount : undefined);
  const provider = getProviderById(qr.providerId);

  // ── Handlers ──
  const handleCopyUPI = async () => {
    await Clipboard.setStringAsync(qr.upiId);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Copied', 'UPI ID copied to clipboard');
  };

  const handleShare = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share QR Code',
          mimeType: 'image/png',
        });
      }
    } catch (e) {
      console.log('Error sharing:', e);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete QR Code', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          router.back();
          setTimeout(() => deleteQR(qr.id), 300);
        },
      },
    ]);
  };

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 80 : 0}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <Animated.View entering={FadeIn.duration(250)} style={styles.header}>
          <View style={styles.headerLeft}>
            <IconButton
              name="arrow-back-outline"
              size={ICON_SIZE_HEADER}
              color={colors.text}
              onPress={() => router.back()}
              style={{ backgroundColor: colors.surfaceElevated }}
            />
          </View>

          {/* Provider pill */}
          <View style={[styles.providerPill, { backgroundColor: provider.color }]}>
            <Ionicons name={provider.icon as any} size={14} color="#FFF" />
            <Text style={styles.providerPillText}>{provider.name}</Text>
          </View>

          {/* Right actions */}
          <View style={styles.headerRight}>
            <IconButton
              name="create-outline"
              size={ICON_SIZE}
              color={colors.textSecondary}
              onPress={() => router.push(`/qr/edit/${qr.id}`)}
              style={{ backgroundColor: colors.surfaceElevated }}
            />
            <IconButton
              name="trash-outline"
              size={ICON_SIZE}
              color={colors.error}
              onPress={handleDelete}
              style={{ backgroundColor: colors.surfaceElevated }}
            />
          </View>
        </Animated.View>

        {/* ── Hero QR Card ────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(80).duration(400).easing(Easing.out(Easing.cubic))}>
          {/* This ViewShot captures the entire shareable card image */}
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1, result: 'tmpfile' }}>
            <View style={[styles.heroCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
              {/* Validity badge */}
              <View style={[styles.validityBadge, { backgroundColor: isDark ? 'rgba(34,197,94,0.12)' : 'rgba(34,197,94,0.08)' }]}>
                <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
                <Text style={{ color: colors.success, fontSize: 11, fontWeight: '600', lineHeight: 14 }}>Valid</Text>
              </View>

              {/* QR white plate */}
              <View style={styles.qrPlate}>
                <QRPreview
                  upiId={qr.upiId}
                  name={qr.name}
                  merchantName={qr.merchantName}
                  amount={effectiveAmount}
                  currency={qr.currency}
                  note={qr.note}
                  providerId={qr.providerId}
                  size={240}
                  showLogo={false}
                  animated={false}
                  backgroundColor="#FFFFFF"
                  qrColor="#000000"
                />
              </View>

              {/* Payee info */}
              <Text style={[styles.payeeName, { color: colors.text }]}>{qr.name}</Text>
              <Text style={[styles.payeeUpi, { color: colors.textSecondary }]}>{qr.upiId}</Text>

              {/* Amount badge inside share card — only if amount is set */}
              {effectiveAmount ? (
                <View style={[styles.amountBadge, { backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(20,184,166,0.10)' }]}>
                  <Text style={[styles.amountBadgeText, { color: colors.accentTealLight }]}>
                    Requesting ₹{effectiveAmount}
                  </Text>
                </View>
              ) : null}

              {/* App branding footer for shared image */}
              <View style={styles.shareFooter}>
                <View style={[styles.shareFooterLine, { backgroundColor: colors.divider }]} />
                <Text style={[styles.shareFooterText, { color: colors.textTertiary }]}>QRWallet</Text>
                <View style={[styles.shareFooterLine, { backgroundColor: colors.divider }]} />
              </View>
            </View>
          </ViewShot>
        </Animated.View>

        {/* ── Payee Info + Copy ───────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(160).duration(350)} style={styles.payeeInfoRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.payeeInfoName, { color: colors.text }]}>{qr.name}</Text>
            <View style={styles.upiCopyRow}>
              <Text style={[styles.upiIdMono, { color: colors.textSecondary }]}>{qr.upiId}</Text>
              <PressableScale onPress={handleCopyUPI} scaleValue={0.9}>
                <View style={[styles.copyChip, { backgroundColor: colors.surfaceElevated }]}>
                  <Ionicons name="copy-outline" size={14} color={colors.textSecondary} />
                </View>
              </PressableScale>
            </View>
          </View>
          <PressableScale onPress={() => toggleFavorite(qr.id)} scaleValue={0.9}>
            <View style={[styles.iconButton, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons
                name={qr.isFavorite ? 'heart' : 'heart-outline'}
                size={ICON_SIZE}
                color={qr.isFavorite ? colors.error : colors.textSecondary}
              />
            </View>
          </PressableScale>
        </Animated.View>

        {/* ── Amount Block ────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(240).duration(350)}>
          {qr.amount ? (
            <View style={[styles.amountDisplayCard, { backgroundColor: isDark ? 'rgba(20,184,166,0.10)' : 'rgba(20,184,166,0.06)', borderColor: isDark ? 'rgba(20,184,166,0.20)' : 'rgba(20,184,166,0.12)' }]}>
              <Text style={[styles.amountDisplayLabel, { color: colors.textTertiary }]}>FIXED AMOUNT</Text>
              <Text style={[styles.amountDisplayValue, { color: colors.accentTealLight }]}>
                ₹{qr.amount}
              </Text>
            </View>
          ) : (
            <View style={[styles.amountInputCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
              <Text style={[styles.amountInputLabel, { color: colors.textTertiary }]}>SET AMOUNT</Text>
              <View style={styles.amountInputRow}>
                <Text style={[styles.currencySymbol, { color: tempAmount ? colors.accentTealLight : colors.textTertiary }]}>₹</Text>
                <TextInput
                  value={tempAmount}
                  onChangeText={setTempAmount}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  style={[styles.amountInput, { color: colors.text }]}
                  maxLength={7}
                />
              </View>
              <Text style={[styles.amountInputHint, { color: colors.textTertiary }]}>
                {tempAmount ? `Requesting ₹${tempAmount}` : 'Tap to enter amount'}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ── Primary Action Row ─────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(320).duration(350)} style={styles.primaryActions}>
          <PressableScale
            onPress={() => setFullScreenVisible(true)}
            hapticStyle="medium"
            style={[styles.primaryBtn, { backgroundColor: colors.accentTeal }]}
          >
            <Ionicons name="expand-outline" size={20} color="#FFF" />
            <Text style={styles.primaryBtnText}>Full Screen</Text>
          </PressableScale>
          <PressableScale
            onPress={handleShare}
            hapticStyle="medium"
            style={[styles.primaryBtn, styles.secondaryBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.divider }]}
          >
            <Ionicons name="share-outline" size={20} color={colors.text} />
            <Text style={[styles.primaryBtnText, { color: colors.text }]}>Share</Text>
          </PressableScale>
        </Animated.View>

        {/* ── Secondary Actions ──────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.secondaryActions}>
          <PressableScale onPress={() => router.push(`/qr/edit/${qr.id}`)} scaleValue={0.95}>
            <Text style={[styles.secondaryActionText, { color: colors.textSecondary }]}>Edit</Text>
          </PressableScale>
          <View style={[styles.secondaryDot, { backgroundColor: colors.textTertiary }]} />
          <PressableScale onPress={handleDelete} scaleValue={0.95}>
            <Text style={[styles.secondaryActionText, { color: colors.error }]}>Delete</Text>
          </PressableScale>
        </Animated.View>

        {/* ── Details Card ────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(480).duration(300)}>
          <View style={[styles.detailsCard, { backgroundColor: colors.surface, borderColor: colors.divider }]}>
            <DetailRow icon="grid-outline" label="Category" value={qr.category} colors={colors} />
            {qr.merchantName && (
              <DetailRow icon="storefront-outline" label="Merchant" value={qr.merchantName} colors={colors} />
            )}
            {qr.note && (
              <DetailRow icon="document-text-outline" label="Note" value={qr.note} colors={colors} />
            )}
            <DetailRow
              icon="calendar-outline"
              label="Created"
              value={new Date(qr.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              colors={colors}
              isLast
            />
          </View>
        </Animated.View>

        {/* ── Secure Footer ──────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(560).duration(250)} style={styles.secureFooter}>
          <Ionicons name="shield-checkmark-outline" size={14} color={colors.textTertiary} />
          <Text style={[styles.secureText, { color: colors.textTertiary }]}>
            Your UPI ID is secure. Share with trusted contacts only.
          </Text>
        </Animated.View>

      </KeyboardAwareScrollView>

      {/* ── Full Screen QR Modal ──────────────────────────── */}
      <FullScreenQR
        visible={fullScreenVisible}
        onClose={() => setFullScreenVisible(false)}
        colors={colors}
        qr={qr}
        effectiveAmount={effectiveAmount}
        provider={provider}
      />
    </SafeAreaView>
  );
}

// ─── Detail Row ─────────────────────────────────────────────────────────────
function DetailRow({ icon, label, value, colors, isLast = false }: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: any;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.detailRow, !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
      <View style={styles.detailLeft}>
        <View style={[styles.detailIcon, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name={icon} size={16} color={colors.textSecondary} />
        </View>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.huge,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  providerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 6,
  },
  providerPillText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Icon Button ──
  iconButton: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: TOUCH_TARGET / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero QR Card ──
  heroCard: {
    borderRadius: BorderRadius.xxxl,
    borderWidth: 1,
    alignItems: 'center',
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  validityBadge: {
    position: 'absolute',
    top: -12,
    right: -12,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  qrPlate: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: Spacing.lg,
  },
  payeeName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  payeeUpi: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: Spacing.md,
  },
  amountBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  amountBadgeText: {
    fontSize: 15,
    fontWeight: '700',
  },
  shareFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  shareFooterLine: {
    flex: 1,
    height: 1,
  },
  shareFooterText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },

  // ── Payee Info Row ──
  payeeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  payeeInfoName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  upiCopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  upiIdMono: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  copyChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Amount ──
  amountDisplayCard: {
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  amountDisplayLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  amountDisplayValue: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1,
  },
  amountInputCard: {
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  amountInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '500',
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1.5,
    minWidth: 50,
    textAlign: 'center',
    padding: 0,
  },
  amountInputHint: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },

  // ── Primary Actions ──
  primaryActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: Layout.buttonHeight,
    borderRadius: BorderRadius.xxl,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryBtn: {
    borderWidth: 1,
  },

  // ── Secondary Actions ──
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.xxxl,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  // ── Details Card ──
  detailsCard: {
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // ── Secure Footer ──
  secureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: Spacing.lg,
  },
  secureText: {
    fontSize: 12,
    fontWeight: '500',
  },

  // ── Not Found ──
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '600',
  },

  // ── Full Screen QR ──
  fullScreenBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenCard: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  fullScreenQrPlate: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.xxl,
  },
  fullScreenName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  fullScreenUpi: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: Spacing.lg,
  },
  fullScreenAmountBadge: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  fullScreenAmountText: {
    fontSize: 18,
    fontWeight: '700',
  },
  fullScreenClose: {
    position: 'absolute',
    right: Spacing.xl,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
