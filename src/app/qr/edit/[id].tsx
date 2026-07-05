/**
 * Edit QR Screen - Edit existing QR code data
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors } from '@/theme/colors';
import { useQRStore } from '@/store/qrStore';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { ProviderSelector } from '@/components/qr/ProviderSelector';
import { CategoryPicker } from '@/components/qr/CategoryPicker';
import { TextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { QRCategory } from '@/types/qr';
import { UPIProvider, getProviderById } from '@/types/upi';
import { validateUPIId } from '@/utils/upi';

export default function EditQRScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const qr = useQRStore((s) => s.getQRById(id));
  const updateQR = useQRStore((s) => s.updateQR);

  if (!qr) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[{ color: colors.text }, Typography.h4]}>QR Code Not Found</Text>
          <PressableScale onPress={() => router.back()}>
            <Text style={{ color: colors.accentTeal, ...Typography.button }}>Go Back</Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  const [upiId, setUpiId] = useState(qr.upiId);
  const [name, setName] = useState(qr.name);
  const [merchantName, setMerchantName] = useState(qr.merchantName || '');
  const [amount, setAmount] = useState(qr.amount?.toString() || '');
  const [note, setNote] = useState(qr.note || '');
  const [notes, setNotes] = useState(qr.notes || '');
  const [selectedProvider, setSelectedProvider] = useState<UPIProvider>(
    getProviderById(qr.providerId)
  );
  const [selectedCategory, setSelectedCategory] = useState<QRCategory>(qr.category);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isImported = qr.source === 'imported';

  const handleSave = useCallback(() => {
    const newErrors: Record<string, string> = {};
    const validation = validateUPIId(upiId);

    if (!upiId.trim()) newErrors.upiId = 'UPI ID is required';
    else if (!validation.isValid) newErrors.upiId = validation.error || 'Invalid UPI ID';

    if (!name.trim()) newErrors.name = 'Name is required';

    if (amount.trim() && isNaN(parseFloat(amount))) newErrors.amount = 'Invalid amount';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const parsedAmount = amount.trim() ? parseFloat(amount) : undefined;

    updateQR(qr.id, {
      upiId: upiId.trim(),
      name: name.trim(),
      merchantName: merchantName.trim() || undefined,
      amount: isImported ? qr.amount : parsedAmount,
      note: note.trim() || undefined,
      notes: notes.trim() || undefined,
      category: selectedCategory,
      providerId: selectedProvider.id,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Saved!', 'QR code updated successfully.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }, [upiId, name, merchantName, amount, note, notes, selectedCategory, selectedProvider, qr, updateQR, router, isImported]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAwareScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={Platform.OS === 'ios' ? 20 : 40}
        enableAutomaticScroll={true}
        contentContainerStyle={styles.scrollContent}
      >
          {/* Header */}
          <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
            <PressableScale onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </PressableScale>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Edit QR Code</Text>
            <View style={{ width: 44 }} />
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.form}>
            <TextInput
              label="UPI ID"
              value={upiId}
              onChangeText={(v) => { setUpiId(v); setErrors((e) => ({ ...e, upiId: '' })); }}
              placeholder="user@provider"
              error={errors.upiId}
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon={<Ionicons name="at" size={20} color={colors.textTertiary} />}
            />

            <TextInput
              label="Name"
              value={name}
              onChangeText={(v) => { setName(v); setErrors((e) => ({ ...e, name: '' })); }}
              placeholder="Account holder name"
              error={errors.name}
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
              label={isImported ? "Amount (Locked)" : "Amount (Optional)"}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              error={errors.amount}
              keyboardType="decimal-pad"
              editable={!isImported}
              helperText={isImported ? "Amount cannot be modified for imported QR codes" : undefined}
              leftIcon={<Text style={{ color: colors.textTertiary, fontSize: 18 }}>₹</Text>}
            />

            <TextInput
              label="Transaction Note (Optional)"
              value={note}
              onChangeText={setNote}
              placeholder="e.g. For dinner"
              leftIcon={<Ionicons name="document-text-outline" size={20} color={colors.textTertiary} />}
            />

            <TextInput
              label="Personal Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="Your private notes about this QR"
              multiline
              style={{ height: 100, paddingTop: 16 }}
            />
          </Animated.View>

          {/* Provider */}
          <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.providerSection}>
            <ProviderSelector
              selectedId={selectedProvider.id}
              onSelect={setSelectedProvider}
            />
          </Animated.View>

          {/* Category */}
          <Animated.View entering={FadeInDown.delay(250).duration(300)} style={styles.categorySection}>
            <Text style={[styles.sectionLabel, { color: colors.text }]}>Category</Text>
            <CategoryPicker
              selected={selectedCategory}
              onSelect={(v) => setSelectedCategory(v as QRCategory)}
            />
          </Animated.View>

          {/* Save Button */}
          <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.buttonSection}>
            <Button
              label="Save Changes"
              onPress={handleSave}
              leftIcon={<Ionicons name="checkmark-circle" size={20} color="#FFF" />}
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
  scrollContent: { paddingBottom: Spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...Typography.subtitle1,
  },
  form: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.sm,
  },
  providerSection: {
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.lg,
  },
  categorySection: {
    marginTop: Spacing.xl,
  },
  sectionLabel: {
    ...Typography.subtitle1,
    marginBottom: Spacing.md,
    marginHorizontal: Spacing.xxl,
  },
  buttonSection: {
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxxl,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
});
