/**
 * Add/Generate QR Screen - Create new QR codes from UPI ID
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeIn, FadeOut, FadeInDown, FadeInUp, FadeOutUp, ZoomIn, LinearTransition } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors } from '@/theme/colors';
import { useQRStore } from '@/store/qrStore';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { QRPreview } from '@/components/qr/QRPreview';
import { ProviderSelector } from '@/components/qr/ProviderSelector';
import { CategoryPicker } from '@/components/qr/CategoryPicker';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { QRFormData, QRCategory } from '@/types/qr';
import { UPIProvider, UPI_PROVIDERS } from '@/types/upi';
import { validateUPIId } from '@/utils/upi';
import * as Haptics from 'expo-haptics';

export default function AddScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const addQR = useQRStore((s) => s.addQR);

  const params = useLocalSearchParams<{ upiId?: string; name?: string }>();
  const [upiId, setUpiId] = useState(params.upiId || '');
  const [name, setName] = useState(params.name || '');

  React.useEffect(() => {
    if (params.upiId) setUpiId(params.upiId);
    if (params.name) setName(params.name);
  }, [params.upiId, params.name]);
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<UPIProvider>(UPI_PROVIDERS[0]);
  const [selectedCategory, setSelectedCategory] = useState<QRCategory>('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = useMemo(() => {
    return upiId.trim().length > 0 && name.trim().length > 0;
  }, [upiId, name]);

  const upiValidation = useMemo(() => {
    if (upiId.trim().length === 0) return null;
    return validateUPIId(upiId);
  }, [upiId]);

  const handleGenerate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!upiId.trim()) newErrors.upiId = 'UPI ID is required';
    else if (!upiValidation?.isValid) newErrors.upiId = upiValidation?.error || 'Invalid UPI ID';

    if (!name.trim()) newErrors.name = 'Name is required';

    if (amount.trim() && (isNaN(parseFloat(amount)) || parseFloat(amount) < 0)) {
      newErrors.amount = 'Invalid amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const formData: QRFormData = {
      upiId: upiId.trim(),
      name: name.trim(),
      merchantName: merchantName.trim() || undefined,
      amount: amount.trim() || undefined,
      currency: 'INR',
      note: note.trim() || undefined,
      category: selectedCategory,
      providerId: selectedProvider.id,
    };

    const newQR = addQR(formData);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Alert.alert(
      '🎉 QR Code Created!',
      `Your QR code for ${name} has been generated successfully.`,
      [
        { text: 'View', onPress: () => router.push(`/qr/${newQR.id}`) },
        { text: 'Done', style: 'cancel', onPress: () => resetForm() },
      ]
    );
  }, [upiId, name, merchantName, amount, note, selectedCategory, selectedProvider, addQR, router, upiValidation]);

  const resetForm = () => {
    setUpiId('');
    setName('');
    setMerchantName('');
    setAmount('');
    setNote('');
    setErrors({});
    setShowPreview(false);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
        enableAutomaticScroll={true}
      >
          {/* Header */}
          <Animated.View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Generate QR</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Create a new UPI payment QR code
            </Text>
          </Animated.View>

          {isFormValid && (
            <Animated.View layout={LinearTransition.duration(300)} style={styles.previewSection}>
              <PressableScale
                onPress={() => setShowPreview(!showPreview)}
                style={[
                  styles.previewToggle,
                  {
                    backgroundColor: colors.primaryLight,
                    borderColor: isDark ? 'rgba(20,184,166,0.2)' : 'rgba(20,184,166,0.12)',
                  },
                ]}
              >
                <Ionicons
                  name={showPreview ? 'eye-off' : 'eye'}
                  size={20}
                  color={colors.accentTeal}
                />
                <Text style={{ color: colors.accentTeal, fontWeight: '600', fontSize: 14 }}>
                  {showPreview ? 'Hide Preview' : 'Show Live Preview'}
                </Text>
              </PressableScale>

              {showPreview && (
                <Animated.View
                  style={[
                    styles.previewCard,
                    {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    },
                  ]}
                >
                  <QRPreview
                    upiId={upiId}
                    name={name}
                    merchantName={merchantName}
                    amount={amount ? parseFloat(amount) : undefined}
                    note={note}
                    providerId={selectedProvider.id}
                    size={200}
                    showLogo={false}
                    animated={false}
                  />
                  <Text style={[styles.previewName, { color: colors.text }]}>{name || 'Name'}</Text>
                  <Text style={[styles.previewUPI, { color: colors.textSecondary }]}>
                    {upiId || 'user@upi'}
                  </Text>
                </Animated.View>
              )}
            </Animated.View>
          )}

          {/* Form Fields */}
          <Animated.View layout={LinearTransition.duration(300)} style={styles.formSection}>
            <TextInput
              label="UPI ID"
              value={upiId}
              onChangeText={(v) => {
                setUpiId(v);
                setErrors((e) => ({ ...e, upiId: '' }));
              }}
              error={errors.upiId}
              placeholder="e.g., yourname@okicici"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              leftIcon={<Ionicons name="at" size={20} color={colors.textTertiary} />}
              helperText={upiValidation?.isValid ? 'Valid UPI ID' : undefined}
            />

            <TextInput
              label="Name"
              value={name}
              onChangeText={(v) => {
                setName(v);
                setErrors((e) => ({ ...e, name: '' }));
              }}
              error={errors.name}
              placeholder="Account holder name"
              leftIcon={<Ionicons name="person-outline" size={20} color={colors.textTertiary} />}
            />

            <TextInput
              label="Merchant Name (Optional)"
              value={merchantName}
              onChangeText={setMerchantName}
              placeholder="Business or shop name"
              leftIcon={<Ionicons name="business-outline" size={20} color={colors.textTertiary} />}
            />

            <TextInput
              label="Amount (Optional)"
              value={amount}
              onChangeText={(v) => {
                setAmount(v);
                setErrors((e) => ({ ...e, amount: '' }));
              }}
              error={errors.amount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              leftIcon={<Text style={{ color: colors.textTertiary, fontSize: 18 }}>₹</Text>}
              helperText="Leave empty for dynamic payment QR"
            />

            <TextInput
              label="Transaction Note (Optional)"
              value={note}
              onChangeText={setNote}
              placeholder="e.g. For dinner"
              leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.textTertiary} />}
            />
          </Animated.View>

          {/* Provider Selector */}
          <Animated.View layout={LinearTransition.duration(300)} style={styles.providerSection}>
            <ProviderSelector
              selectedId={selectedProvider.id}
              onSelect={setSelectedProvider}
            />
          </Animated.View>

          {/* Category */}
          <Animated.View layout={LinearTransition.duration(300)} style={styles.categorySection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
            <CategoryPicker
              selected={selectedCategory}
              onSelect={(v) => setSelectedCategory(v as QRCategory)}
            />
          </Animated.View>

          {/* Generate Button */}
          <Animated.View layout={LinearTransition.duration(300)} style={styles.buttonSection}>
            <Button
              label="Generate QR Code"
              onPress={handleGenerate}
              disabled={!isFormValid}
              leftIcon={<Ionicons name="qr-code" size={20} color="#FFF" />}
            />
          </Animated.View>

          <View style={{ height: Spacing.massive }} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.body1,
    marginTop: Spacing.xs,
  },
  previewSection: {
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xxl,
    alignItems: 'center',
  },
  previewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  previewCard: {
    alignItems: 'center',
    padding: Spacing.xxl,
    borderRadius: BorderRadius.xxxl,
    borderWidth: 1,
    width: '100%',
    gap: Spacing.sm,
  },
  previewName: {
    ...Typography.h3,
    marginTop: Spacing.md,
  },
  previewUPI: {
    ...Typography.body2,
  },
  formSection: {
    paddingHorizontal: Spacing.xxl,
  },
  providerSection: {
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.md,
  },
  categorySection: {
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle1,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.xxl,
  },
  buttonSection: {
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxxl,
  },
});
