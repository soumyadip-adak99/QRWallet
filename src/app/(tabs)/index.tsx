/**
 * Home Dashboard - Premium fintech dashboard
 */
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight, FadeIn } from 'react-native-reanimated';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors, Gradients } from '@/theme/colors';
import { useQRStore } from '@/store/qrStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useShallow } from 'zustand/react/shallow';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { StatsCard } from '@/components/qr/StatsCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { getGreeting, formatAmount } from '@/utils/upi';
import { getProviderById } from '@/types/upi';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  
  const stats = useQRStore(useShallow((s) => s.getStats()));
  const recentQRs = useQRStore(useShallow((s) => s.getRecent(5)));
  const favoriteQRs = useQRStore(useShallow((s) => s.getFavorites()));
  
  const userName = useSettingsStore((s) => s.user.name);
  const userPhotoUri = useSettingsStore((s) => s.user.photoUri);
  const greeting = getGreeting();

  const quickActions = [
    {
      icon: 'add-circle' as const,
      label: 'Add QR',
      gradient: Gradients.primary,
      onPress: () => router.push('/(tabs)/add'),
    },
    {
      icon: 'scan' as const,
      label: 'Scan QR',
      gradient: Gradients.accent,
      onPress: () => router.push('/scan'),
    },
    {
      icon: 'qr-code' as const,
      label: 'Generate',
      gradient: Gradients.ocean,
      onPress: () => router.push('/(tabs)/add'),
    },
    {
      icon: 'share' as const,
      label: 'Share',
      gradient: Gradients.rose,
      onPress: () => router.push('/(tabs)/wallet'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {greeting} 👋
            </Text>
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
              {userName}
            </Text>
          </View>
          <PressableScale
            style={[
              styles.profileAvatar,
              { backgroundColor: isDark ? 'rgba(20,184,166,0.15)' : 'rgba(13,148,136,0.08)' },
            ]}
            onPress={() => router.push('/(tabs)/settings')}
          >
            {userPhotoUri ? (
              <Image
                source={{ uri: userPhotoUri }}
                style={styles.logoImage}
                resizeMode="cover"
              />
            ) : (
              <FontAwesome5 name="user" solid={false} size={22} color={colors.accentTeal} />
            )}
          </PressableScale>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsRow}
            snapToInterval={150}
            decelerationRate="fast"
          >
            <StatsCard
              icon="qr-code"
              label="Total QR Codes"
              value={stats.total}
              gradient={Gradients.primary}
              index={0}
              onPress={() => router.push('/(tabs)/wallet')}
            />
            <StatsCard
              icon="heart"
              label="Favorites"
              value={stats.favorites}
              gradient={['#EF4444', '#F97316'] as [string, string]}
              index={1}
            />
            <StatsCard
              icon="share"
              label="Shared"
              value={stats.shared}
              gradient={Gradients.accent}
              index={2}
            />
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.label}
               
                style={styles.quickActionWrapper}
              >
                <PressableScale onPress={action.onPress} scaleValue={0.93}>
                  <View
                    style={[
                      styles.quickAction,
                      {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={action.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.quickActionIcon}
                    >
                      <Ionicons name={action.icon} size={24} color="#FFF" />
                    </LinearGradient>
                    <Text style={[styles.quickActionLabel, { color: colors.text }]} numberOfLines={1}>
                      {action.label}
                    </Text>
                  </View>
                </PressableScale>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent QR Codes */}
        {recentQRs.length > 0 ? (
          <Animated.View>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text, marginHorizontal: 0 }]}>Recent QRs</Text>
              <PressableScale onPress={() => router.push('/(tabs)/wallet')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  See All
                </Text>
              </PressableScale>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentRow}
            >
              {recentQRs.map((qr, index) => {
                const provider = getProviderById(qr.providerId);
                return (
                  <Animated.View
                    key={qr.id}
                   
                  >
                    <PressableScale
                      onPress={() => router.push(`/qr/${qr.id}`)}
                      scaleValue={0.95}
                    >
                      <View
                         style={[
                          styles.recentCard,
                          {
                            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF',
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                          },
                        ]}
                      >
                        <View style={[styles.recentProviderIcon, { backgroundColor: provider.imageSource ? 'transparent' : provider.color }]}>
                          {provider.imageSource ? (
                            <Image source={provider.imageSource} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="contain" />
                          ) : (
                            <Ionicons name={provider.icon as any} size={24} color="#FFF" />
                          )}
                        </View>
                        <View style={styles.recentInfo}>
                          <Text style={[styles.recentName, { color: colors.text }]} numberOfLines={1}>
                            {qr.name}
                          </Text>
                          <Text style={[styles.recentUPI, { color: colors.textSecondary }]} numberOfLines={1}>
                            {qr.upiId}
                          </Text>
                        </View>
                      </View>
                    </PressableScale>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>
        ) : (
          <Animated.View>
            <View style={styles.emptyStateContainer}>
              <EmptyState
                icon="qr-code-outline"
                title="No QR Codes Yet"
                subtitle="Create your first QR code to get started with your digital wallet."
                actionLabel="Create QR Code"
                onAction={() => router.push('/(tabs)/add')}
              />
            </View>
          </Animated.View>
        )}

        <View style={{ height: Spacing.huge }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: Spacing.xxl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerLeft: { 
    gap: Spacing.xxs, 
    flex: 1, 
    paddingRight: Spacing.md 
  },
  greeting: { 
    ...Typography.subtitle1,
  },
  userName: { 
    ...Typography.h1, 
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
  },
  statsRow: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h4,
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  seeAll: {
    ...Typography.subtitle2,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  quickActionWrapper: {
    flex: 1,
  },
  quickAction: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xs,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    ...Typography.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentRow: {
    paddingHorizontal: Spacing.xxl,
    gap: Spacing.md,
  },
  recentCard: {
    width: 140,
    padding: Spacing.md,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    gap: Spacing.md,
  },
  recentProviderIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentInfo: {
    gap: 2,
  },
  recentName: {
    ...Typography.subtitle2,
  },
  recentUPI: {
    ...Typography.caption,
  },
  emptyStateContainer: {
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xxxl,
  },
});
