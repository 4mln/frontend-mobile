import { useAuth, useVerifyOTP } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useMessageBoxStore } from '@/context/messageBoxStore';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Animated, Easing, ScrollView, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { Box, Modal, Text, VStack, HStack, Pressable, Spinner } from '@gluestack-ui/themed';
import LoginScreen from '../../app/auth/login';
import SignupScreen from '../../app/auth/signup';

export const LoginWall: React.FC = () => {
  const { approved } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const { t } = useTranslation();
  const messageBox = useMessageBoxStore();
  const isAuthRoute = pathname?.startsWith('/auth/');
  const [mode, setMode] = React.useState<'login' | 'signup' | 'otp'>('login');
  const [prevMode, setPrevMode] = React.useState<'login' | 'signup'>('login');
  const [pendingPhone, setPendingPhone] = React.useState<string | undefined>(undefined);
  const fade = React.useRef(new Animated.Value(1)).current;

  // Debug logging
  console.log('LoginWall - Auth State:', { approved, pathname, isAuthRoute });

  const switchMode = (next: 'login' | 'signup' | 'otp') => {
    Animated.timing(fade, { toValue: 0, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(() => {
      setMode(next);
      Animated.timing(fade, { toValue: 1, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    });
  };

  // Only dismiss when explicitly approved after OTP
  if (approved) {
    console.log('LoginWall - User approved, hiding LoginWall');
    return null;
  }

  console.log('LoginWall - User not approved, showing LoginWall modal');
  
  // Force show LoginWall for testing
  console.log('LoginWall - FORCING LoginWall to show for testing');

  return (
    <Modal visible={true} animationType="fade" transparent>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />
      <Box 
        flex={1} 
        backgroundColor="rgba(0,0,0,0.5)" 
        justifyContent="center" 
        alignItems="center"
        paddingHorizontal={16}
      >
        <Box
          backgroundColor={isDark ? '$backgroundDark0' : '$backgroundLight0'}
          borderRadius="$xl"
          overflow="hidden"
          maxHeight="90%"
          width="100%"
          maxWidth={560}
          softShadow="4"
        >
          <ScrollView 
            style={{ maxHeight: '100%' }} 
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }} 
            keyboardShouldPersistTaps="handled" 
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={{ opacity: fade }}>
              {mode === 'login' && (
                <LoginScreen
                  initialPhone={pendingPhone}
                  onNavigateToSignup={(phone) => {
                    if (phone) setPendingPhone(phone);
                    switchMode('signup');
                  }}
                  onOtpRequested={async (phone) => {
                    setPrevMode('login');
                    setPendingPhone(phone);
                    switchMode('otp');
                  }}
                />
              )}
              {mode === 'signup' && (
                <SignupScreen
                  initialPhone={pendingPhone}
                  onNavigateToLogin={() => switchMode('login')}
                  onOtpRequested={async (phone) => {
                    setPrevMode('signup'); setPendingPhone(phone); switchMode('otp');
                  }}
                />
              )}
              {mode === 'otp' && (
                <InlineOtp
                  phone={pendingPhone}
                  onBack={() => switchMode(prevMode)}
                  onSuccess={() => {
                    if (prevMode === 'signup') {
                      // Show congrats message, then go to login
                      messageBox.show({
                        message: t('auth.signupCongratsLogin', 'Congrats! you signed up successfully, login now.'),
                        actions: [
                          {
                            label: t('auth.login', 'Login'),
                            onPress: () => switchMode('login'),
                          },
                        ],
                      });
                    } else {
                      // After login verification, proceed into the app
                      try { router.replace('/(tabs)'); } catch {}
                    }
                  }}
                />
              )}
            </Animated.View>
          </ScrollView>
        </Box>
      </Box>
    </Modal>
  );
};

type InlineOtpProps = {
  phone?: string;
  onBack: () => void;
  onSuccess: () => void;
};

const InlineOtp: React.FC<InlineOtpProps> = ({ phone, onBack, onSuccess }) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
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

  // Focus first input on mount
  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

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
    <Box paddingHorizontal={16} paddingVertical={20} direction="ltr">
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        position="absolute"
        top={16}
        left={16}
        flexDirection="row"
        alignItems="center"
        zIndex={10}
        elevation={1}
      >
        <Text color="$primary500" fontWeight="$medium">{t('common.back','Back')}</Text>
      </Pressable>
      
      <VStack alignItems="center" marginBottom={24} space={16}>
        <Box 
          width={80} 
          height={80} 
          borderRadius="$full" 
          backgroundColor="$primary100" 
          justifyContent="center" 
          alignItems="center"
          softShadow="2"
        >
          <Ionicons name="shield-checkmark" size={40} color="#3b82f6" />
        </Box>
        <VStack alignItems="center" space={8}>
          <Text 
            fontSize="$xl" 
            fontWeight="$bold" 
            color="$textLight900" 
            textAlign="center"
          >
            {t('otp.title','Enter Authentication Code')}
          </Text>
          <Text 
            fontSize="$sm" 
            color="$textLight600" 
            textAlign="center"
          >
            {t('otp.sentTo','Sent to:')}
          </Text>
          {!!phone && (
            <Text fontSize="$sm" color="$primary500" fontWeight="$semibold">
              +98 {phone}
            </Text>
          )}
        </VStack>
      </VStack>
      
      <HStack justifyContent="space-between" marginBottom={20} direction="ltr" space={12}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
            style={{
              width: 50,
              height: 60,
              borderWidth: 2,
              borderColor: digit ? '#3b82f6' : '#e5e7eb',
              borderRadius: 16,
              textAlign: 'center',
              writingDirection: 'ltr',
              fontSize: 24,
              fontWeight: '700',
              color: isDark ? '#f9fafb' : '#111827',
              backgroundColor: isDark ? '#374151' : '#ffffff',
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
      </HStack>
      
      <Pressable
        onPress={() => handleVerify()}
        disabled={otp.join('').length !== 6 || isLoading}
        backgroundColor="$primary500"
        borderRadius="$xl"
        paddingVertical={16}
        alignItems="center"
        opacity={otp.join('').length !== 6 || isLoading ? 0.6 : 1}
        softShadow="2"
        _pressed={{
          backgroundColor: '$primary600',
          transform: [{ scale: 0.98 }],
        }}
      >
        <HStack alignItems="center" space={8}>
          {isLoading && <Spinner color="$white" size="sm" />}
          <Text color="$white" fontWeight="$bold" fontSize="$md">
            {isLoading ? t('common.loading','Loading...') : t('auth.verifyOTP','Verify')}
          </Text>
        </HStack>
      </Pressable>
      
      <VStack alignItems="center" marginTop={20} space={8}>
        {canResend ? (
          <Pressable onPress={() => { setTimeLeft(60); setCanResend(false); setOtp(['', '', '', '', '', '']); }}>
            <Text color="$primary500" fontWeight="$medium" fontSize="$sm">
              {t('otp.resend','Resend Code')}
            </Text>
          </Pressable>
        ) : (
          <VStack alignItems="center" space={4}>
            <Text color="$textLight600" fontSize="$sm">
              {t('auth.otpNotReceived', "Didn't receive the code?")}
            </Text>
            <Text color="$primary500" fontWeight="$semibold" fontSize="$md">
              {formatTime(timeLeft)}
            </Text>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};
