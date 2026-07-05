/**
 * ProviderSelector - Grid of UPI provider icons with animated selection
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';
import { Colors } from '@/theme/colors';
import { PressableScale } from '@/components/ui/AnimatedPressable';
import { UPI_PROVIDERS, UPIProvider } from '@/types/upi';

interface Props {
  selectedId: string;
  onSelect: (provider: UPIProvider) => void;
}

export function ProviderSelector({ selectedId, onSelect }: Props) {
  const { colors, isDark } = useTheme();

  return (
    <Animated.View entering={FadeInUp.duration(400).springify()}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>UPI Application</Text>
      <View style={styles.grid}>
        {UPI_PROVIDERS.map((provider, index) => {
          const isSelected = selectedId === provider.id;
          return (
            <PressableScale
              key={provider.id}
              onPress={() => onSelect(provider)}
              style={[
                styles.providerItem,
                {
                  backgroundColor: isSelected
                    ? isDark
                      ? 'rgba(99,102,241,0.15)'
                      : Colors.primary[50]
                    : isDark
                    ? 'rgba(255,255,255,0.04)'
                    : '#F8FAFC',
                  borderColor: isSelected
                    ? Colors.primary[500]
                    : isDark
                    ? 'rgba(255,255,255,0.06)'
                    : 'rgba(0,0,0,0.04)',
                },
              ]}
            >
              <View style={[styles.providerIcon, { backgroundColor: provider.imageSource ? 'transparent' : provider.color }]}>
                {provider.imageSource ? (
                  <Image source={provider.imageSource} style={{ width: '100%', height: '100%', borderRadius: 12 }} resizeMode="contain" />
                ) : (
                  <Ionicons name={provider.icon as any} size={24} color="#FFF" />
                )}
              </View>
              <Text
                style={[
                  styles.providerName,
                  {
                    color: isSelected ? Colors.primary[isDark ? 400 : 600] : colors.textSecondary,
                    fontWeight: isSelected ? '600' : '400',
                  },
                ]}
                numberOfLines={1}
              >
                {provider.shortName}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary[500]} />
                </View>
              )}
            </PressableScale>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginHorizontal: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  providerItem: {
    width: '30%',
    flexGrow: 1,
    maxWidth: '32%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    position: 'relative',
    gap: 6,
  },
  providerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerName: {
    fontSize: 11,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 6,
    right: 6,
  },
});
