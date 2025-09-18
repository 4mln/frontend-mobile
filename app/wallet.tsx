import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useTopUp, useTransactions, useWalletBalance, useWithdraw } from '@/features/wallet/hooks';
import { useWalletStore } from '@/features/wallet/store';
import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function WalletScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data: balanceData } = useWalletBalance();
  const { transactions } = useWalletStore();
  useTransactions();
  const topUp = useTopUp();
  const withdraw = useWithdraw();

  // Using transactions from wallet store populated by useTransactions()

  const handleTopUp = async () => {
    try {
      await topUp.mutateAsync({ amount: 100000, method: 'wallet' } as any);
    } catch (e) {
      Alert.alert('Error', 'Failed to top up');
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw.mutateAsync({ amount: 50000, bankAccount: { accountNumber: '****', bankName: 'Bank', accountHolderName: 'You' } } as any);
    } catch (e) {
      Alert.alert('Error', 'Failed to withdraw');
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Ionicons
          name={item.type === 'credit' ? 'arrow-down-circle' : 'arrow-up-circle'}
          size={24}
          color={item.type === 'credit' ? colors.success[500] : colors.error[500]}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: item.type === 'credit' ? colors.success[500] : colors.error[500] }
        ]}>
          {item.type === 'credit' ? '+' : '-'}{item.amount.toLocaleString()} Toman
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'completed' ? colors.success[100] : colors.warning[100] }
        ]}>
          <Text style={[
            styles.statusText,
            { color: item.status === 'completed' ? colors.success[600] : colors.warning[600] }
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
    },
    header: {
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.lg,
      backgroundColor: colors.primary[500],
    },
    headerTitle: {
      fontSize: typography.h3.fontSize,
      fontWeight: typography.h3.fontWeight,
      color: colors.background.light,
      textAlign: 'center',
      marginBottom: semanticSpacing.lg,
    },
    balanceCard: {
      backgroundColor: colors.background.light,
      borderRadius: semanticSpacing.radius.lg,
      padding: semanticSpacing.lg,
      alignItems: 'center',
      ...semanticSpacing.shadow.md,
    },
    balanceLabel: {
      fontSize: typography.body.fontSize,
      color: colors.gray[600],
      marginBottom: semanticSpacing.sm,
    },
    balanceAmount: {
      fontSize: typography.h1.fontSize,
      fontWeight: typography.h1.fontWeight,
      color: colors.primary[600],
      marginBottom: semanticSpacing.lg,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    actionButton: {
      flex: 1,
      paddingVertical: semanticSpacing.md,
      borderRadius: semanticSpacing.radius.lg,
      alignItems: 'center',
      marginHorizontal: semanticSpacing.xs,
    },
    primaryButton: {
      backgroundColor: colors.primary[500],
    },
    secondaryButton: {
      backgroundColor: colors.gray[100],
    },
    actionButtonText: {
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
    },
    primaryButtonText: {
      color: colors.background.light,
    },
    secondaryButtonText: {
      color: colors.gray[700],
    },
    content: {
      flex: 1,
      paddingHorizontal: semanticSpacing.md,
    },
    sectionTitle: {
      fontSize: typography.h4.fontSize,
      fontWeight: typography.h4.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginVertical: semanticSpacing.lg,
    },
    transactionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: semanticSpacing.md,
      paddingHorizontal: semanticSpacing.sm,
      backgroundColor: isDark ? colors.card.background : colors.card.background,
      borderRadius: semanticSpacing.radius.lg,
      marginBottom: semanticSpacing.sm,
      borderWidth: 1,
      borderColor: isDark ? colors.card.border : colors.card.border,
    },
    transactionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: semanticSpacing.md,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.xs,
    },
    transactionDate: {
      fontSize: typography.caption.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
    },
    transactionAmount: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: typography.bodyLarge.fontSize,
      fontWeight: fontWeights.semibold,
      marginBottom: semanticSpacing.xs,
    },
    statusBadge: {
      paddingHorizontal: semanticSpacing.sm,
      paddingVertical: semanticSpacing.xs,
      borderRadius: semanticSpacing.radius.sm,
    },
    statusText: {
      fontSize: typography.caption.fontSize,
      fontWeight: fontWeights.medium,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.xl,
    },
    emptyStateText: {
      fontSize: typography.bodyLarge.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      textAlign: 'center',
      marginTop: semanticSpacing.md,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
        
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            {(balanceData?.balance ?? 0).toLocaleString()} {balanceData?.currency || 'Toman'}
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleTopUp}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Top Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleWithdraw}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        
        {transactions.length > 0 ? (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="wallet-outline"
              size={64}
              color={isDark ? colors.gray[400] : colors.gray[500]}
            />
            <Text style={styles.emptyStateText}>No transactions yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
