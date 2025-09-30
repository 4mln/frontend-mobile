import { useSendOTP } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { authService } from '@/services/auth';
import { validateIranianMobileNumber } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
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

import { useMessageBoxStore } from '@/context/messageBoxStore';
import i18n from '@/i18n';
import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, lineHeights, typography } from '@/theme/typography';
import { ensureOnlineOrMessage } from '@/utils/connection';

type LoginScreenProps = {
  initialPhone?: string;
  onNavigateToSignup?: (phone?: string) => void;
  onOtpRequested?: (phone: string) => void;
};

export default function LoginScreen(props: LoginScreenProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // If OTP bypass is enabled, we will skip OTP screen and navigate directly
  const isBypassEnabled = process.env.EXPO_PUBLIC_BYPASS_OTP === 'true' || process.env.EXPO_PUBLIC_BYPASS_OTP === '1';
  
  const [phone, setPhone] = useState(props.initialPhone || '');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  
  const sendOTPMutation = useSendOTP();

  const handleSendOTP = async () => {
    // Validate phone number using the Iranian mobile number validator
    const validation = validateIranianMobileNumber(phone);
    
    if (!validation.isValid) {
      setPhoneError(validation.error);
      return;
    }
    
    setPhoneError(undefined);
    setIsLoading(true);
    
    try {
      // First: ensure connection
      const online = await ensureOnlineOrMessage();
      if (!online) return;
      // First: check whether user exists
      const existsResp = await authService.userExists(phone.trim());
      if (existsResp.success && existsResp.data && !existsResp.data.exists) {
        // Debug trace to ensure handler is hit
        console.log('[login] user not found, prompting to signup', phone.trim());
        useMessageBoxStore.getState().show({
          message: i18n.t('auth.userNotFoundProceedSignup', 'User not found, proceed to signup.'),
          actions: [
            {
              label: i18n.t('auth.signup', 'Signup'),
              onPress: () => {
                if (props?.onNavigateToSignup) {
                  props.onNavigateToSignup(phone.trim());
                } else {
                  router.replace({ pathname: '/auth/signup', params: { phone: phone.trim() } });
                }
              },
            },
          ],
        });
        return;
      }

      // Then call backend to send OTP
      const resp = await sendOTPMutation.mutateAsync({ phone: phone.trim() } as any);
      if (resp?.success) {
        if (props?.onOtpRequested) {
          props.onOtpRequested(phone.trim());
        } else {
          router.push({ pathname: '/auth/verify-otp', params: { phone: phone.trim(), from: 'login' } });
        }
      } else {
        const userNotFoundMsg = i18n.t('errors.userNotFound');
        const networkMsg = i18n.t('errors.networkErrorDetailed');
        const msg = (resp?.error || '').toLowerCase().includes('not') && (resp?.error || '').toLowerCase().includes('found')
          ? userNotFoundMsg
          : (resp?.error || networkMsg);
        useMessageBoxStore.getState().show({ message: msg, actions: [{ label: i18n.t('common.back') }] });
      }
    } catch (error) {
      Alert.alert(t('login.alerts.sendFailedTitle'), t('login.alerts.sendFailed'));
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
      maxWidth: 400,
      alignSelf: 'center',
      width: '100%',
    },
    header: {
      alignItems: 'center',
      marginBottom: semanticSpacing.xl,
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
      fontSize: 24, // Fixed from typography.h2.fontSize
      fontWeight: 'bold', // Fixed from typography.h2.fontWeight
      color: isDark ? colors.text.primary : colors.text.primary,
      textAlign: 'center',
      marginBottom: semanticSpacing.sm,
    },
    subtitle: {
      fontSize: 18, // Fixed from typography.bodyLarge.fontSize
      color: isDark ? colors.text.secondary : colors.text.secondary,
      textAlign: 'center',
      lineHeight: 18 * lineHeights.normal, // Fixed from typography.bodyLarge.fontSize
    },
    form: {
      marginBottom: semanticSpacing.xl,
    },
    inputContainer: {
      marginBottom: semanticSpacing.sm,
    },
    label: {
      fontSize: 16,
      fontWeight: fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.xs,
      textAlign: 'right',
    },
    errorText: {
      color: colors.error[500],
      fontSize: 14, // Fixed from typography.small.fontSize
      marginTop: semanticSpacing.xs,
      textAlign: 'right',
    },
    signupLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: semanticSpacing.xl,
    },
    signupText: {
      color: isDark ? colors.text.secondary : colors.text.secondary,
      fontSize: typography.body.fontSize,
    },
    signupButton: {
      marginLeft: semanticSpacing.xs,
    },
    signupButtonText: {
      color: colors.primary[500],
      fontSize: 16, // Fixed from typography.body.fontSize
      fontWeight: fontWeights.medium,
    },
    label: {
      marginBottom: semanticSpacing.sm,
      textAlign: 'right',
    },
    inputWrapper: {
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : colors.border.light,
      borderRadius: semanticSpacing.radius.lg,
      backgroundColor: isDark ? colors.gray[800] : colors.background.light,
    },
    
    input: {
      flex: 1,
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      fontSize: 16, // Fixed from typography.body.fontSize
      color: isDark ? colors.text.primary : colors.text.primary,
      textAlign: 'left',
      writingDirection: 'ltr',
    },
    button: {
      backgroundColor: colors.primary[500],
      borderRadius: semanticSpacing.radius.lg,
      paddingVertical: semanticSpacing.md,
      alignItems: 'center',
      marginTop: semanticSpacing.md,
    },
    buttonDisabled: {
      backgroundColor: colors.gray[300],
    },
    buttonText: {
      fontSize: 16, // Fixed from typography.button.fontSize
      fontWeight: 'bold', // Fixed from typography.button.fontWeight
      color: colors.background.light,
    },
    footer: {
      alignItems: 'center',
      marginTop: semanticSpacing.xl,
    },
    footerText: {
      fontSize: 14, // Fixed from typography.bodySmall.fontSize
      color: isDark ? colors.text.secondary : colors.text.secondary,
      textAlign: 'center',
      lineHeight: 14 * lineHeights.normal, // Fixed from typography.bodySmall.fontSize
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
              <Ionicons name="person" size={40} color="white" />
            </View>
            <Text style={styles.title}>{t('login.title')}</Text>
            <Text style={styles.subtitle}>{t('login.subtitle')}</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('login.phone')}</Text>
              <View style={styles.inputWrapper}>
                
                <TextInput
                  style={styles.input}
                  placeholder={t('login.phonePlaceholder')}
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (phoneError) setPhoneError(undefined);
                  }}
                  keyboardType="phone-pad"
                  autoFocus
                  textAlign="left"
                  writingDirection="ltr"
                />
              </View>
              {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
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
                {isLoading ? t('common.loading') : t('login.sendCode')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {t('login.terms')}
              <Text style={styles.link}>{t('login.termsLink')}</Text>
              {t('login.and')}
              <Text style={styles.link}>{t('login.privacyLink')}</Text>
              {t('login.agree')}
            </Text>
          </View>
          
          {/* Signup UI removed by request */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
