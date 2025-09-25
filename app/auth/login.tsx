import { useSendOTP } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
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

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, lineHeights, typography } from '@/theme/typography';

type LoginScreenProps = {
  onNavigateToSignup?: () => void;
  onOtpRequested?: (phone: string) => void;
};

export default function LoginScreen(props: LoginScreenProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // If OTP bypass is enabled, we will skip OTP screen and navigate directly
  const isBypassEnabled = process.env.EXPO_PUBLIC_BYPASS_OTP === 'true' || process.env.EXPO_PUBLIC_BYPASS_OTP === '1';
  
  const [phone, setPhone] = useState('');
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
      if (isBypassEnabled) {
        // Skip OTP: directly navigate to tabs, LoginWall won't block due to bypass
        setTimeout(() => {
          try { router.replace('/(tabs)'); } catch {}
        }, 500);
        return;
      }
      // In normal mode, trigger OTP flow
      console.log('Sending OTP to', phone.trim());
      setTimeout(() => {
        if (props?.onOtpRequested) {
          props.onOtpRequested(phone.trim());
        } else {
          router.push({ pathname: '/auth/verify-otp', params: { phone: phone.trim(), from: 'login' } });
        }
      }, 1000);
    } catch (error) {
      Alert.alert('خطا', 'ارسال کد تایید با مشکل مواجه شد. لطفا دوباره تلاش کنید.');
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
            <Text style={styles.title}>خوش آمدید</Text>
            <Text style={styles.subtitle}>برای ورود شماره موبایل خود را وارد کنید</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>شماره موبایل</Text>
              <View style={styles.inputWrapper}>
                
                <TextInput
                  style={styles.input}
                  placeholder="09xxxxxxxxx"
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
                {isLoading ? "در حال بارگذاری..." : "ارسال کد تایید"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              با ادامه دادن، شما با {' '}
              <Text style={styles.link}>شرایط استفاده</Text>
              {' '}و{' '}
              <Text style={styles.link}>سیاست حفظ حریم خصوصی</Text>
              {' '}ما موافقت می‌کنید
            </Text>
          </View>
          
          <View style={styles.signupLink}>
            <Text style={styles.signupText}>حساب کاربری ندارید؟</Text>
            {props?.onNavigateToSignup ? (
              <TouchableOpacity style={styles.signupButton} onPress={props.onNavigateToSignup}>
                <Text style={styles.signupButtonText}>ثبت نام</Text>
              </TouchableOpacity>
            ) : (
              <Link href="/auth/signup" asChild>
                <TouchableOpacity style={styles.signupButton}>
                  <Text style={styles.signupButtonText}>ثبت نام</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
