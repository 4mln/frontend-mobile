import { create } from 'zustand';
import { PaymentMethod, Transaction, WalletBalance, WalletState, WalletStatistics } from './types';

interface WalletStore extends WalletState {
  // Actions
  setBalance: (balance: WalletBalance) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  setStatistics: (statistics: WalletStatistics) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  clearError: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  balance: null,
  transactions: [],
  paymentMethods: [],
  statistics: null,
  isLoading: false,
  error: null,

  setBalance: (balance) => set({ balance }),
  
  setTransactions: (transactions) => set({ transactions }),
  
  addTransaction: (transaction) => set((state) => ({
    transactions: [transaction, ...state.transactions]
  })),
  
  setPaymentMethods: (methods) => set({ paymentMethods: methods }),
  
  setStatistics: (statistics) => set({ statistics }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  updateTransaction: (transactionId, updates) => set((state) => ({
    transactions: state.transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, ...updates } : transaction
    )
  })),
  
  clearError: () => set({ error: null }),
}));
