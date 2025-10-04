import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { fontWeights } from '@/theme/typography'; // added to fix fontWeight
import { useStoreCapabilities } from '@/features/stores/hooks';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';
  const { canManageStores, canSell, canPurchase } = useStoreCapabilities();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: isDark ? colors.gray[400] : colors.gray[500],
        tabBarStyle: {
          backgroundColor: isDark ? colors.background.dark : colors.background.light,
          borderTopColor: isDark ? colors.border.light : colors.border.light,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 15,
          paddingTop: 12,
          shadowColor: isDark ? '#000' : '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: fontWeights.medium, // fixed
          marginTop: 4,
        },
        headerShown: false,
        tabBarButton: (props) => <HapticTab {...props} />, // fixed
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('navigation.search'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'search' : 'search-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      {(canSell || canManageStores) && (
        <Tabs.Screen
          name="add"
          options={{
            title: t('navigation.add'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'add-circle' : 'add-circle-outline'} 
                size={28} 
                color={color} 
              />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="chat"
        options={{
          title: t('navigation.chat'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      {canManageStores && (
        <Tabs.Screen
          name="stores"
          options={{
            title: t('navigation.stores'),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons 
                name={focused ? 'storefront' : 'storefront-outline'} 
                size={24} 
                color={color} 
              />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="wallet"
        options={{
          title: t('navigation.wallet'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'wallet' : 'wallet-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
