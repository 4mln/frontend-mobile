import LoginScreen from '@/app/auth/login';
import { useAuth } from '@/features/auth/hooks';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { colors } from '@/theme/colors';
import React from 'react';
import { Modal, StatusBar, StyleSheet, View } from 'react-native';

export const LoginWall: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (isAuthenticated) {
    return null;
  }

  return (
    <Modal
      visible={!isAuthenticated}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? colors.background.dark : colors.background.light}
      />
      <View style={[
        styles.container,
        { backgroundColor: isDark ? colors.background.dark : colors.background.light }
      ]}>
        <LoginScreen />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
