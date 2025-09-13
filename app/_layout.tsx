import { HapticTab } from '@/components/haptic-tab';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, user } = useAuth();

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          {!isAuthenticated ? (
            // Auth screens
            <>
              <Stack.Screen 
                name="auth/login" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="auth/verify-otp" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
            </>
          ) : (
            // Main app screens
            <>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="product/[id]" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="product/create" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="chat/[id]" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="rfq/create" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="wallet" 
                options={{ 
                  headerShown: false,
                  presentation: 'modal',
                }} 
              />
              <Stack.Screen 
                name="modal" 
                options={{ 
                  presentation: 'modal', 
                  title: 'Modal' 
                }} 
              />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
