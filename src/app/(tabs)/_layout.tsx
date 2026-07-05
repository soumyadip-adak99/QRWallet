/**
 * Tab Layout - Premium bottom tab navigation
 */
import { useTheme } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

function TabIcon({
  name,
  focused,
  color,
  label,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
  label: string;
}) {
  return (
    <View style={styles.tabIconContainer}>
      <Ionicons
        name={focused ? name : (`${String(name)}-outline` as keyof typeof Ionicons.glyphMap)}
        size={22}
        color={color}
      />
      <Text
        style={[
          styles.tabLabel,
          {
            color,
            fontWeight: focused ? '600' : '400',
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { colors, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: 'none',
        tabBarActiveTintColor: isDark ? '#5EEAD4' : '#0D9488',
        tabBarInactiveTintColor: isDark ? '#757575' : '#94A3B8',
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="home" focused={focused} color={color} label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="wallet" focused={focused} color={color} label="Wallet" />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="add-circle" focused={focused} color={color} label="Add" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused, color }) => (
            <TabIcon name="settings" focused={focused} color={color} label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    width: 64,
    height: 48,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
