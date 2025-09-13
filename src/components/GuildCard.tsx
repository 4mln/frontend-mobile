import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface GuildCardProps {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  onPress: () => void;
  isSelected?: boolean;
}

export const GuildCard: React.FC<GuildCardProps> = ({
  id,
  name,
  icon,
  productCount,
  onPress,
  isSelected = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.md,
      marginRight: semanticSpacing.md,
      backgroundColor: isSelected 
        ? colors.primary[100] 
        : isDark 
          ? colors.card.background 
          : colors.card.background,
      borderRadius: semanticSpacing.radius.lg,
      borderWidth: isSelected ? 2 : 1,
      borderColor: isSelected 
        ? colors.primary[500] 
        : isDark 
          ? colors.card.border 
          : colors.card.border,
      minWidth: 100,
      ...semanticSpacing.shadow.sm,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isSelected 
        ? colors.primary[500] 
        : colors.primary[100],
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: semanticSpacing.sm,
    },
    name: {
      fontSize: typography.bodySmall.fontSize,
      fontWeight: typography.fontWeights.medium,
      color: isSelected 
        ? colors.primary[700] 
        : isDark 
          ? colors.text.primary 
          : colors.text.primary,
      textAlign: 'center',
      marginBottom: semanticSpacing.xs,
    },
    productCount: {
      fontSize: typography.caption.fontSize,
      color: isSelected 
        ? colors.primary[600] 
        : isDark 
          ? colors.text.secondary 
          : colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={icon as any} 
          size={24} 
          color={isSelected ? colors.background.light : colors.primary[600]} 
        />
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {name}
      </Text>
      <Text style={styles.productCount}>
        {productCount} products
      </Text>
    </TouchableOpacity>
  );
};
