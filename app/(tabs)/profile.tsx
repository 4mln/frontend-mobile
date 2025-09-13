import { useAuth } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout } = useAuth();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark);

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      'Are you sure you want to logout?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('auth.logout'), onPress: logout, style: 'destructive' },
      ]
    );
  };

  const handleEditProfile = () => {
    console.log('Edit profile');
  };

  const handleWallet = () => {
    router.push('/wallet');
  };

  const handleSettings = () => {
    console.log('Open settings');
  };

  const handleHelp = () => {
    console.log('Open help');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
    },
    header: {
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.lg,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.border.light : colors.border.light,
    },
    profileSection: {
      alignItems: 'center',
      marginBottom: semanticSpacing.lg,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary[100],
      marginBottom: semanticSpacing.md,
    },
    userName: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.xs,
    },
    userRole: {
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: semanticSpacing.md,
    },
    section: {
      marginBottom: semanticSpacing.xl,
    },
    sectionTitle: {
      fontSize: typography.h4.fontSize,
      fontWeight: typography.h4.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.md,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: semanticSpacing.md,
      paddingHorizontal: semanticSpacing.sm,
      backgroundColor: isDark ? colors.card.background : colors.card.background,
      borderRadius: semanticSpacing.radius.lg,
      marginBottom: semanticSpacing.sm,
      borderWidth: 1,
      borderColor: isDark ? colors.card.border : colors.card.border,
    },
    menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: semanticSpacing.md,
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: typography.bodyLarge.fontSize,
      fontWeight: typography.fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.xs,
    },
    menuSubtitle: {
      fontSize: typography.bodySmall.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
    },
    menuArrow: {
      marginLeft: semanticSpacing.sm,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: semanticSpacing.md,
      paddingHorizontal: semanticSpacing.sm,
      backgroundColor: isDark ? colors.card.background : colors.card.background,
      borderRadius: semanticSpacing.radius.lg,
      marginBottom: semanticSpacing.sm,
      borderWidth: 1,
      borderColor: isDark ? colors.card.border : colors.card.border,
    },
    switchContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    switchIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: semanticSpacing.md,
    },
    switchText: {
      fontSize: typography.bodyLarge.fontSize,
      fontWeight: typography.fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    logoutButton: {
      backgroundColor: colors.error[500],
      borderRadius: semanticSpacing.radius.lg,
      paddingVertical: semanticSpacing.md,
      alignItems: 'center',
      marginTop: semanticSpacing.xl,
      marginBottom: semanticSpacing.xl,
    },
    logoutText: {
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
      color: colors.background.light,
    },
    versionText: {
      fontSize: typography.caption.fontSize,
      color: isDark ? colors.text.tertiary : colors.text.tertiary,
      textAlign: 'center',
      marginBottom: semanticSpacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/80' }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>
            {user?.name || 'User Name'}
          </Text>
          <Text style={styles.userRole}>
            {user?.role || 'Buyer/Seller'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
            <View style={styles.menuIcon}>
              <Ionicons name="person-outline" size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('profile.editProfile')}</Text>
              <Text style={styles.menuSubtitle}>Update your personal information</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDark ? colors.gray[400] : colors.gray[500]} 
              style={styles.menuArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleWallet}>
            <View style={styles.menuIcon}>
              <Ionicons name="wallet-outline" size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('profile.wallet')}</Text>
              <Text style={styles.menuSubtitle}>Manage your wallet and transactions</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDark ? colors.gray[400] : colors.gray[500]} 
              style={styles.menuArrow}
            />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchContent}>
              <View style={styles.switchIcon}>
                <Ionicons name="notifications-outline" size={20} color={colors.primary[600]} />
              </View>
              <Text style={styles.switchText}>{t('profile.notifications')}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primary[200] }}
              thumbColor={notificationsEnabled ? colors.primary[500] : colors.gray[400]}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchContent}>
              <View style={styles.switchIcon}>
                <Ionicons name="moon-outline" size={20} color={colors.primary[600]} />
              </View>
              <Text style={styles.switchText}>{t('profile.theme')}</Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primary[200] }}
              thumbColor={darkModeEnabled ? colors.primary[500] : colors.gray[400]}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <View style={styles.menuIcon}>
              <Ionicons name="settings-outline" size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('profile.settings')}</Text>
              <Text style={styles.menuSubtitle}>App preferences and privacy</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDark ? colors.gray[400] : colors.gray[500]} 
              style={styles.menuArrow}
            />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleHelp}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle-outline" size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('profile.help')}</Text>
              <Text style={styles.menuSubtitle}>Get help and support</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDark ? colors.gray[400] : colors.gray[500]} 
              style={styles.menuArrow}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary[600]} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{t('profile.about')}</Text>
              <Text style={styles.menuSubtitle}>App version and information</Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDark ? colors.gray[400] : colors.gray[500]} 
              style={styles.menuArrow}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('auth.logout')}</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>
          {t('profile.version', { version: '2.1.0' })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
