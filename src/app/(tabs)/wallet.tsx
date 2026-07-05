/**
 * QR Wallet - Browse, search, filter all saved QR codes
 */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Spacing, Typography, BorderRadius } from '@/theme';
import { Colors } from '@/theme/colors';
import { useQRStore } from '@/store/qrStore';
import { useShallow } from 'zustand/react/shallow';
import { QRCard } from '@/components/qr/QRCard';
import { CategoryPicker } from '@/components/qr/CategoryPicker';
import { EmptyState } from '@/components/ui/EmptyState';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { QRCode as QRCodeType } from '@/types/qr';

export default function WalletScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const searchQuery = useQRStore((s) => s.searchQuery);
  const setSearchQuery = useQRStore((s) => s.setSearchQuery);
  const selectedCategory = useQRStore((s) => s.selectedCategory);
  const setSelectedCategory = useQRStore((s) => s.setSelectedCategory);
  const sortBy = useQRStore((s) => s.sortBy);
  const setSortBy = useQRStore((s) => s.setSortBy);
  const toggleFavorite = useQRStore((s) => s.toggleFavorite);
  const deleteQR = useQRStore((s) => s.deleteQR);
  const filteredQRs = useQRStore(useShallow((s) => s.getFiltered()));

  const [showSortMenu, setShowSortMenu] = useState(false);

  const handlePress = useCallback(
    (item: QRCodeType) => {
      router.push(`/qr/${item.id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete QR Code', 'Are you sure you want to delete this QR code?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteQR(id),
        },
      ]);
    },
    [deleteQR]
  );

  const handleShare = useCallback((item: QRCodeType) => {
    // Sharing to be implemented later
  }, []);

  const sortOptions = [
    { key: 'recent' as const, label: 'Most Recent', icon: 'time-outline' as const },
    { key: 'name' as const, label: 'Name', icon: 'text-outline' as const },
    { key: 'provider' as const, label: 'Provider', icon: 'apps-outline' as const },
    { key: 'favorite' as const, label: 'Favorites First', icon: 'heart-outline' as const },
  ];

  const renderItem = useCallback(
    ({ item, index }: { item: QRCodeType; index: number }) => (
      <QRCard
        item={item}
        index={index}
        onPress={handlePress}
        onFavorite={toggleFavorite}
        onDelete={handleDelete}
        onShare={handleShare}
      />
    ),
    [handlePress, toggleFavorite, handleDelete, handleShare]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <Animated.View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Wallet</Text>
        <View style={styles.headerActions}>
          <PressableScale
            onPress={() => setShowSortMenu(!showSortMenu)}
            style={[
              styles.iconButton,
              { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
            ]}
          >
            <Ionicons name="filter" size={20} color={colors.textSecondary} />
          </PressableScale>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View style={styles.searchWrapper}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
            },
          ]}
        >
          <Ionicons name="search" size={20} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search UPI ID, name, category..."
            placeholderTextColor={colors.textTertiary}
            style={[styles.searchInput, { color: colors.text }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <PressableScale onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
            </PressableScale>
          )}
        </View>
      </Animated.View>

      {/* Sort Menu */}
      {showSortMenu && (
        <Animated.View
         
          style={[
            styles.sortMenu,
            {
              backgroundColor: isDark ? colors.surfaceElevated : '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            },
          ]}
        >
          {sortOptions.map((opt) => (
            <PressableScale
              key={opt.key}
              onPress={() => {
                setSortBy(opt.key);
                setShowSortMenu(false);
              }}
              style={[
                styles.sortOption,
                sortBy === opt.key && {
                  backgroundColor: colors.primaryLight,
                },
              ]}
            >
              <Ionicons
                name={opt.icon}
                size={18}
                color={sortBy === opt.key ? colors.accentTeal : colors.textSecondary}
              />
              <Text
                style={[
                  styles.sortOptionText,
                  {
                    color: sortBy === opt.key ? colors.accentTeal : colors.text,
                    fontWeight: sortBy === opt.key ? '600' : '400',
                  },
                ]}
              >
                {opt.label}
              </Text>
              {sortBy === opt.key && (
                <Ionicons name="checkmark" size={18} color={colors.accentTeal} />
              )}
            </PressableScale>
          ))}
        </Animated.View>
      )}

      {/* Category Filter */}
      <Animated.View style={styles.categoryRow}>
        <CategoryPicker
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          showAll
        />
      </Animated.View>

      {/* QR List */}
      {filteredQRs.length > 0 ? (
        <FlatList
          data={filteredQRs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <EmptyState
          icon="wallet-outline"
          title="No QR Codes Found"
          subtitle={
            searchQuery
              ? `No results for "${searchQuery}". Try a different search.`
              : 'Your wallet is empty. Create your first QR code!'
          }
          actionLabel="Create QR Code"
          onAction={() => router.push('/(tabs)/add')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 52,
    borderRadius: BorderRadius.xl,
    borderWidth: 1.5,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body1,
    height: '100%',
  },
  sortMenu: {
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: Spacing.xs,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  sortOptionText: {
    flex: 1,
    ...Typography.body2,
  },
  categoryRow: {
    marginBottom: Spacing.lg,
  },
  listContent: {
    paddingBottom: Spacing.massive,
    paddingTop: Spacing.sm,
  },
});
