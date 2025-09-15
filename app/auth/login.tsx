import { useSendOTP } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, lineHeights, typography } from '@/theme/typography';

export default function LoginScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sendOTPMutation = useSendOTP();

  const handleSendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      await sendOTPMutation.mutateAsync({ phone: phone.trim() });
      router.push({ pathname: '/auth/verify-otp', params: { phone: phone.trim() } });
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
    },
    content: {
      flex: 1,
      paddingHorizontal: semanticSpacing.lg,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: semanticSpacing['3xl'],
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary[500],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: semanticSpacing.lg,
    },
    title: {
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      textAlign: 'center',
      marginBottom: semanticSpacing.sm,
    },
    subtitle: {
      fontSize: typography.bodyLarge.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      textAlign: 'center',
      lineHeight: typography.bodyLarge.fontSize * lineHeights.normal,
    },
    form: {
      marginBottom: semanticSpacing.xl,
    },
    inputContainer: {
      marginBottom: semanticSpacing.lg,
    },
    label: {
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : colors.border.light,
      borderRadius: semanticSpacing.radius.lg,
      backgroundColor: isDark ? colors.gray[800] : colors.background.light,
    },
    countryCode: {
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.md,
      borderRightWidth: 1,
      borderRightColor: isDark ? colors.border.light : colors.border.light,
    },
    countryCodeText: {
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
      fontWeight: fontWeights.medium,
    },
    input: {
      flex: 1,
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.md,
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    button: {
      backgroundColor: colors.primary[500],
      borderRadius: semanticSpacing.radius.lg,
      paddingVertical: semanticSpacing.md,
      alignItems: 'center',
      marginTop: semanticSpacing.lg,
    },
    buttonDisabled: {
      backgroundColor: colors.gray[300],
    },
    buttonText: {
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
      color: colors.background.light,
    },
    footer: {
      alignItems: 'center',
      marginTop: semanticSpacing.xl,
    },
    footerText: {
      fontSize: typography.bodySmall.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      textAlign: 'center',
      lineHeight: typography.bodySmall.fontSize * lineHeights.normal,
    },
    link: {
      color: colors.primary[600],
      fontWeight: fontWeights.medium,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="business" size={40} color={colors.background.light} />
            </View>
            <Text style={styles.title}>{t('auth.welcome')}</Text>
            <Text style={styles.subtitle}>
              Enter your phone number to get started
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('auth.enterPhone')}</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+98</Text>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.phonePlaceholder')}
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoFocus
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!phone.trim() || isLoading) && styles.buttonDisabled,
              ]}
              onPress={handleSendOTP}
              disabled={!phone.trim() || isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? t('common.loading') : t('auth.sendOTP')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our{' '}
              <Text style={styles.link}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
