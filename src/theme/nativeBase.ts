import { extendTheme, StorageManager } from 'native-base';
import { lightTheme, darkTheme } from './index';

export const colorModeManager: StorageManager = {
  get: async () => {
    try {
      const prefersDark = darkTheme.isDark;
      return prefersDark ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  },
  set: async (_value: 'light' | 'dark') => {
    // Theme is controlled elsewhere; no-op here
  },
};

export const nativeBaseTheme = extendTheme({
  config: {
    useSystemColorMode: false,
    initialColorMode: darkTheme.isDark ? 'dark' : 'light',
  },
  colors: {
    primary: lightTheme.colors.primary,
    secondary: lightTheme.colors.secondary,
    error: lightTheme.colors.error,
    success: lightTheme.colors.success,
    warning: lightTheme.colors.warning,
    info: lightTheme.colors.info,
    background: lightTheme.colors.background,
    text: lightTheme.colors.text,
    gray: lightTheme.colors.gray,
  },
  fontConfig: {
    IRANSans: {
      100: { normal: 'IRANSans-Light' },
      400: { normal: 'IRANSans' },
      500: { normal: 'IRANSans-Medium' },
      700: { normal: 'IRANSans-Bold' },
    },
  },
  fonts: {
    heading: 'IRANSans',
    body: 'IRANSans',
    mono: 'IRANSans',
  },
  components: {
    Button: {
      baseStyle: {
        rounded: 'md',
      },
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Input: {
      defaultProps: {
        variant: 'outline',
        size: 'md',
      },
    },
    Heading: {
      defaultProps: {
        size: 'lg',
      },
    },
  },
});



