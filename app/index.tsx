import { useAuth } from '@/features/auth/hooks';
import { Redirect } from 'expo-router';

export default function Index() {
  const { approved } = useAuth();
  if (approved) {
    return <Redirect href="/(tabs)" />;
  }
  // Render the main app content even when LoginWall is visible
  return <Redirect href="/(tabs)" />;
}


