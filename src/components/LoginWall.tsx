import { useAuth } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import { usePathname } from 'expo-router';
import React from 'react';
import { Modal, StatusBar, StyleSheet, View } from 'react-native';
import LoginScreen from '../../app/auth/login';
import SignupScreen from '../../app/auth/signup';
import VerifyOTPScreen from '../../app/auth/verify-otp';

export const LoginWall: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith('/auth/');
  const [mode, setMode] = React.useState<'login' | 'signup' | 'otp'>('login');
  const [prevMode, setPrevMode] = React.useState<'login' | 'signup'>('login');
  const [pendingPhone, setPendingPhone] = React.useState<string | undefined>(undefined);

  if (isAuthenticated) {
    return null;
  }

  return (
    <Modal
      visible={!isAuthenticated && !isAuthRoute}
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
          {mode === 'login' && (
            <LoginScreen
              onNavigateToSignup={() => setMode('signup')}
              onOtpRequested={(phone) => { setPrevMode('login'); setPendingPhone(phone); setMode('otp'); }}
            />
          )}
          {mode === 'signup' && (
            <SignupScreen
              onNavigateToLogin={() => setMode('login')}
              onOtpRequested={(phone) => { setPrevMode('signup'); setPendingPhone(phone); setMode('otp'); }}
            />
          )}
          {mode === 'otp' && (
            <VerifyOTPScreen inline phoneProp={pendingPhone}
              onSuccess={() => { setMode('login'); }}
              onBack={() => setMode(prevMode)}
            />
          )}
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
    width: '50%',
    alignSelf: 'center',
  },
});
