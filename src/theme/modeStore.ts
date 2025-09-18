import '@/polyfills/web';
// @ts-expect-error - ensure process.env exists in web/SSR
if (typeof globalThis.process === 'undefined') {
  // @ts-expect-error
  globalThis.process = { env: {} };
} else if (typeof (globalThis as any).process.env === 'undefined') {
  (globalThis as any).process.env = {};
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { create } = require('zustand');

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeModeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeModeStore = create<ThemeModeState>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));


