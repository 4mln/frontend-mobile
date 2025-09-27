import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializePlugins } from '@/plugins';
import { PluginNavigation } from '@/navigation/PluginNavigation';
import { useAuthStore } from '@/features/auth/store';
import { initializeConfig } from '@/services/configService';
import { initializeFeatureFlags } from '@/services/featureFlags';
import { initializeOfflineService } from '@/services/offlineService';
import { initializeThemeService } from '@/services/themeService';
import { ThemeProvider } from '@/components/ThemeProvider';

/**
 * Main App Component
 * Initializes plugin system and provides navigation
 */
const queryClient = new QueryClient();

export default function App() {
  const [pluginsInitialized, setPluginsInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      console.log('[App] Initializing application...');
      
      // Initialize configuration services
      await Promise.all([
        initializeConfig(),
        initializeFeatureFlags(),
        initializeOfflineService(),
        initializeThemeService(),
      ]);
      
      // Initialize plugin system
      await initializePlugins();
      
      setPluginsInitialized(true);
      console.log('[App] Application initialized successfully');
    } catch (error) {
      console.error('[App] Failed to initialize application:', error);
      setInitializationError('Failed to initialize application');
    }
  };

  if (!pluginsInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Initializing plugins...
        </Text>
      </View>
    );
  }

  if (initializationError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFFFFF' }}>
        <Text style={{ fontSize: 18, color: '#FF3B30', textAlign: 'center', marginBottom: 16 }}>
          Initialization Error
        </Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 }}>
          {initializationError}
        </Text>
        <Text 
          style={{ fontSize: 16, color: '#007AFF', textAlign: 'center' }}
          onPress={initializeApp}
        >
          Retry
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <PluginNavigation 
            userPermissions={user?.permissions || []}
          />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
