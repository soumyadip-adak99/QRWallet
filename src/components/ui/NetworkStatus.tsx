import { BorderRadius, Spacing, Typography } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function NetworkStatus() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();
  
  // By default, consider it connected until we explicitly know it's disconnected
  const isDisconnected = netInfo.isConnected === false;

  if (!isDisconnected) return null;

  return (
    <Animated.View 
      entering={FadeInUp.duration(400).springify()}
      exiting={FadeOutUp.duration(300)}
      style={[
        styles.container, 
        { top: Math.max(insets.top + Spacing.xs, Spacing.xl) }
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="cloud-offline" size={20} color="#FFFFFF" />
        <Text style={styles.text}>No Internet Connection</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.xl,
    right: Spacing.xl,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xxl,
    gap: Spacing.sm,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    ...Typography.subtitle2,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
