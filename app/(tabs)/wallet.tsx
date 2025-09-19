import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';

export default function WalletScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <Stack.Screen
        options={{
          title: t('screens.wallet.title'),
          headerStyle: {
            backgroundColor: isDark ? colors.background.dark : colors.background.light,
          },
          headerTintColor: isDark ? colors.text.dark : colors.text.light,
        }}
      />
      {/* Redirect to the main wallet screen */}
      <WalletRedirect />
    </>
  );
}

// This component redirects to the main wallet screen
import { Redirect } from 'expo-router';

function WalletRedirect() {
  // Fix the redirect to avoid infinite loop - use the non-tab version
  return <Redirect href="/(app)/wallet" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});