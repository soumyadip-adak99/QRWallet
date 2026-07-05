/**
 * CategoryPicker - Horizontal scrollable category chips
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Colors } from '@/theme/colors';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { QRCategory, CATEGORIES } from '@/types/qr';

interface Props {
  selected: QRCategory | 'all';
  onSelect: (category: QRCategory | 'all') => void;
  showAll?: boolean;
}

export function CategoryPicker({ selected, onSelect, showAll = false }: Props) {
  const { colors, isDark } = useTheme();

  const allCategories = showAll
    ? [{ id: 'all' as const, label: 'All', icon: 'apps' }, ...CATEGORIES]
    : CATEGORIES;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {allCategories.map((cat) => {
        const isSelected = selected === cat.id;
        return (
          <PressableScale
            key={cat.id}
            onPress={() => onSelect(cat.id as QRCategory | 'all')}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected
                  ? Colors.primary[isDark ? 600 : 600]
                  : isDark
                  ? 'rgba(255,255,255,0.06)'
                  : '#F1F5F9',
                borderColor: isSelected
                  ? Colors.primary[600]
                  : 'transparent',
              },
            ]}
          >
            <Ionicons
              name={cat.icon as any}
              size={14}
              color={isSelected ? '#FFF' : colors.textSecondary}
            />
            <Text
              style={[
                styles.chipText,
                {
                  color: isSelected ? '#FFF' : colors.textSecondary,
                  fontWeight: isSelected ? '600' : '400',
                },
              ]}
            >
              {cat.label}
            </Text>
          </PressableScale>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
});
