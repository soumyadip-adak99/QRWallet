/**
 * QRCard - Premium wallet card with swipe actions
 */
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors } from '@/theme/colors';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { QRCode as QRCodeType } from '@/types/qr';
import { getProviderById } from '@/types/upi';
import { formatRelativeTime, formatAmount } from '@/utils/upi';


interface Props {
  item: QRCodeType;
  index: number;
  onPress: (item: QRCodeType) => void;
  onFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (item: QRCodeType) => void;
}

export function QRCard({ item, index, onPress, onFavorite, onDelete, onShare }: Props) {
  const { colors, isDark } = useTheme();
  const provider = getProviderById(item.providerId);


  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).duration(350).springify()}
      style={styles.wrapper}
    >
      {/* Card */}
      <View>
          <PressableScale onPress={() => onPress(item)} scaleValue={0.98}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <View style={[styles.providerIcon, { backgroundColor: provider.imageSource ? 'transparent' : provider.color }]}>
                {provider.imageSource ? (
                  <Image source={provider.imageSource} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="contain" />
                ) : (
                  <Ionicons name={provider.icon as any} size={26} color="#FFF" />
                )}
              </View>

              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.isFavorite && (
                    <Ionicons name="heart" size={14} color={Colors.error.light} />
                  )}
                </View>
                <Text style={[styles.upiId, { color: colors.textSecondary }]} numberOfLines={1}>
                  {item.upiId}
                </Text>
                
                <View style={styles.metaRow}>
                  <View style={[styles.badge, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' }]}>
                    <Text style={[styles.badgeText, { color: colors.textTertiary }]}>
                      {provider.shortName}
                    </Text>
                  </View>
                  {item.amount && (
                    <Text style={[styles.amount, { color: Colors.accent[isDark ? 400 : 600] }]}>
                      {formatAmount(item.amount, item.currency)}
                    </Text>
                  )}
                  {item.lastUsed && (
                    <Text style={[styles.time, { color: colors.textTertiary }]}>
                      {formatRelativeTime(item.lastUsed)}
                    </Text>
                  )}
                </View>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.textTertiary}
              />
            </View>
          </PressableScale>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
    position: 'relative',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  name: {
    ...Typography.subtitle1,
    flex: 1,
  },
  upiId: {
    ...Typography.body2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xxs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '600',
  },
  amount: {
    ...Typography.subtitle2,
  },
  time: {
    ...Typography.caption,
  },
});
