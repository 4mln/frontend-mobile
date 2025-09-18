export { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useThemeModeStore } from '@/theme/modeStore';
import { useColorScheme as useRNColorScheme } from 'react-native';

export const useColorScheme = () => {
  const device = useRNColorScheme();
  const mode = useThemeModeStore((s) => s.mode);
  if (mode === 'system') return device;
  return mode;
};
