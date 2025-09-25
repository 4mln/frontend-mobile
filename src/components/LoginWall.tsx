import { useAuth, useVerifyOTP } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React from 'react';
import { Animated, Easing, Modal, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import LoginScreen from '../../app/auth/login';
import SignupScreen from '../../app/auth/signup';

export const LoginWall: React.FC = () => {
  const { isAuthenticated } = useAuth();
  // If OTP bypass is enabled, don't render the login wall at all
  if (process.env.EXPO_PUBLIC_BYPASS_OTP === 'true' || process.env.EXPO_PUBLIC_BYPASS_OTP === '1') {
    return null;
  }
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth/');
  const [mode, setMode] = React.useState<'login' | 'signup' | 'otp'>('login');
  const [prevMode, setPrevMode] = React.useState<'login' | 'signup'>('login');
  const [pendingPhone, setPendingPhone] = React.useState<string | undefined>(undefined);
  const fade = React.useRef(new Animated.Value(1)).current;

  const switchMode = (next: 'login' | 'signup' | 'otp') => {
    Animated.timing(fade, { toValue: 0, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      setMode(next);
      Animated.timing(fade, { toValue: 1, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <Modal
      visible={!isAuthenticated}
      animationType="slide"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={'rgba(0,0,0,0.5)'}
      />
      <View style={[
        styles.container,
        { backgroundColor: 'rgba(0,0,0,0.5)' }
      ]}>
        <View style={[
          styles.sheet,
          { backgroundColor: isDark ? colors.background.dark : colors.background.light }
        ]}>
          <ScrollView style={{ maxHeight: '100%' }} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <Animated.View style={{ opacity: fade }}>
            {mode === 'login' && (
              <LoginScreen
                onNavigateToSignup={() => switchMode('signup')}
                onOtpRequested={(phone) => { setPrevMode('login'); setPendingPhone(phone); switchMode('otp'); }}
              />
            )}
            {mode === 'signup' && (
              <SignupScreen
                onNavigateToLogin={() => switchMode('login')}
                onOtpRequested={(phone) => { setPrevMode('signup'); setPendingPhone(phone); switchMode('otp'); }}
              />
            )}
            {mode === 'otp' && (
              <InlineOtp
                phone={pendingPhone}
                onBack={() => switchMode(prevMode)}
                onSuccess={() => {}}
              />
            )}
          </Animated.View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  sheet: {
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '90%',
    width: '95%',
    maxWidth: 560,
    alignSelf: 'center',
  },
});

type InlineOtpProps = {
  phone?: string;
  onBack: () => void;
  onSuccess: () => void;
};

const InlineOtp: React.FC<InlineOtpProps> = ({ phone, onBack, onSuccess }) => {
  const { t } = require('react-i18next').useTranslation();
  const colorScheme = require('@/hooks/use-color-scheme').useColorScheme();
  const isDark = colorScheme === 'dark';
  const [otp, setOtp] = React.useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);
  const inputRefs = React.useRef<TextInput[]>([]);
  const verifyOTPMutation = useVerifyOTP();

  React.useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (value: string, index: number) => {
    // keep only one numeric digit
    const digitOnly = value.replace(/\D/g, '').slice(0, 1);
    const next = [...otp];
    next[index] = digitOnly;
    setOtp(next);
    if (digitOnly && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every(d => d !== '') && next.join('').length === 6) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleVerify = async (code?: string) => {
    const codeStr = code || otp.join('');
    if (codeStr.length !== 6 || !phone) return;
    setIsLoading(true);
    try {
      await verifyOTPMutation.mutateAsync({ phone: String(phone).trim(), otp: codeStr.trim() });
      onSuccess();
      // Navigate to the main app
      try { router.replace('/(tabs)'); } catch {}
    } catch {
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 20, direction: 'ltr' }}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ position: 'absolute', top: 16, left: 16, flexDirection: 'row', alignItems: 'center', zIndex: 10, elevation: 1 }}
      >
        <Text style={{ color: colors.primary[600], fontWeight: '500' }}>بازگشت</Text>
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary[100], justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primary[600]} />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '700', color: isDark ? colors.text.primary : colors.text.primary, textAlign: 'center', marginBottom: 6 }}>کد تأیید را وارد کنید</Text>
        <Text style={{ fontSize: 14, color: isDark ? colors.text.secondary : colors.text.secondary, textAlign: 'center' }}>ارسال به:</Text>
        {!!phone && (
          <Text style={{ fontSize: 14, color: colors.primary[600] }}>+98 {phone}</Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, direction: 'ltr' }}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
            style={{
              width: 45,
              height: 55,
              borderWidth: 1,
              borderColor: isDark ? colors.border.light : colors.border.light,
              borderRadius: 12,
              textAlign: 'center',
              writingDirection: 'ltr',
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? colors.text.primary : colors.text.primary,
              backgroundColor: isDark ? colors.gray[800] : colors.background.light,
            }}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            inputMode="numeric"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>
      <TouchableOpacity
        onPress={() => handleVerify()}
        disabled={otp.join('').length !== 6 || isLoading}
        style={{ backgroundColor: colors.primary[500], borderRadius: 12, paddingVertical: 12, alignItems: 'center', opacity: (otp.join('').length !== 6 || isLoading) ? 0.6 : 1 }}
      >
        <Text style={{ color: colors.background.light, fontWeight: '700' }}>{isLoading ? 'در حال بارگذاری...' : 'تأیید کد'}</Text>
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        {canResend ? (
          <TouchableOpacity onPress={() => { setTimeLeft(60); setCanResend(false); setOtp(['', '', '', '', '', '']); }}>
            <Text style={{ color: colors.primary[600], fontWeight: '500' }}>ارسال مجدد کد</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={{ color: isDark ? colors.text.secondary : colors.text.secondary, marginBottom: 6 }}>{t('auth.otpNotReceived', 'کد را دریافت نکردید؟')}</Text>
            <Text style={{ color: colors.primary[600], fontWeight: '600' }}>{formatTime(timeLeft)}</Text>
          </>
        )}
      </View>
    </View>
  );
};
