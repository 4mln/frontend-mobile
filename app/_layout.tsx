import '@/i18n';
import '@/polyfills/web';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Polyfill requestAnimationFrame for SSR/web server rendering
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  // @ts-ignore
  globalThis.requestAnimationFrame = (cb: any) => setTimeout(cb, 16);
}
if (typeof globalThis.cancelAnimationFrame === 'undefined') {
  // @ts-ignore
  globalThis.cancelAnimationFrame = (id: any) => clearTimeout(id);
}

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/features/auth/hooks';
import { useAuthStore } from '@/features/auth/store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const initializeAuth = useAuthStore((s) => s.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="auth/verify-otp" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="product/[id]" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="product/create" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="chat/[id]" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="rfq/create" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="wallet" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
