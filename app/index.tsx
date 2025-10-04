import { useAuth } from '@/features/auth/hooks';
import { Redirect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { Box, VStack, Spinner } from '@gluestack-ui/themed';

export default function Index() {
  const { approved, isLoading, isAuthenticated, error } = useAuth();
  
  // Debug logging
  console.log('Index - Auth State:', { approved, isLoading, isAuthenticated, error });
  
  // Show loading screen while checking authentication
  if (isLoading) {
    console.log('Index - Still loading auth state, showing loading screen');
    return (
      <Box flex={1} backgroundColor="$backgroundLight0" justifyContent="center" alignItems="center">
        <VStack alignItems="center" space={16}>
          <Spinner size="large" color="$primary500" />
          <Text fontSize="$lg" color="$textLight600">Loading...</Text>
        </VStack>
      </Box>
    );
  }
  
  // Show error if authentication failed
  if (error) {
    console.log('Index - Auth error:', error);
    return (
      <Box flex={1} backgroundColor="$backgroundLight0" justifyContent="center" alignItems="center">
        <VStack alignItems="center" space={16}>
          <Text fontSize="$lg" color="$error500">Authentication Error</Text>
          <Text fontSize="$md" color="$textLight600" textAlign="center">{error}</Text>
        </VStack>
      </Box>
    );
  }
  
  // Only redirect to main app if user is authenticated and approved
  if (approved) {
    console.log('Index - User approved, redirecting to tabs');
    return <Redirect href="/(tabs)" />;
  }
  
  // If not authenticated, don't redirect - let LoginWall show
  console.log('Index - User not approved, showing LoginWall');
  return null;
}


