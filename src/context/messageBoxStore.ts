import { create } from 'zustand';

export type MessageBoxAction = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export type MessageBoxState = {
  isVisible: boolean;
  title?: string;
  message?: string;
  actions: MessageBoxAction[];
  show: (payload: { title?: string; message?: string; actions?: MessageBoxAction[] }) => void;
  hide: () => void;
};

export const useMessageBoxStore = create<MessageBoxState>((set) => ({
  isVisible: false,
  title: undefined,
  message: undefined,
  actions: [],
  show: ({ title, message, actions }) =>
    set({ isVisible: true, title, message, actions: actions && actions.length ? actions : [] }),
  hide: () => set({ isVisible: false, title: undefined, message: undefined, actions: [] }),
}));



