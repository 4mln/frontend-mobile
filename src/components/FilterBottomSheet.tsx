import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface FilterSection {
  id: string;
  title: string;
  options: FilterOption[];
  type: 'single' | 'multiple' | 'range';
}

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  visible,
  onClose,
  onApplyFilters,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const filterSections: FilterSection[] = [
    {
      id: 'category',
      title: 'Category',
      type: 'single',
      options: [
        { id: '1', label: 'Construction', value: 'construction' },
        { id: '2', label: 'Electronics', value: 'electronics' },
        { id: '3', label: 'Textiles', value: 'textiles' },
        { id: '4', label: 'Food & Beverage', value: 'food' },
        { id: '5', label: 'Automotive', value: 'automotive' },
        { id: '6', label: 'Chemicals', value: 'chemicals' },
      ],
    },
    {
      id: 'brand',
      title: 'Brand',
      type: 'multiple',
      options: [
        { id: '1', label: 'Brand A', value: 'brand-a' },
        { id: '2', label: 'Brand B', value: 'brand-b' },
        { id: '3', label: 'Brand C', value: 'brand-c' },
        { id: '4', label: 'Brand D', value: 'brand-d' },
      ],
    },
    {
      id: 'location',
      title: 'Location',
      type: 'single',
      options: [
        { id: '1', label: 'Tehran', value: 'tehran' },
        { id: '2', label: 'Isfahan', value: 'isfahan' },
        { id: '3', label: 'Shiraz', value: 'shiraz' },
        { id: '4', label: 'Tabriz', value: 'tabriz' },
        { id: '5', label: 'Mashhad', value: 'mashhad' },
      ],
    },
  ];

  const handleFilterSelect = (sectionId: string, optionId: string, type: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (type === 'single') {
        newFilters[sectionId] = optionId;
      } else if (type === 'multiple') {
        if (!newFilters[sectionId]) {
          newFilters[sectionId] = [];
        }
        const currentSelection = newFilters[sectionId] || [];
        if (currentSelection.includes(optionId)) {
          newFilters[sectionId] = currentSelection.filter((id: string) => id !== optionId);
        } else {
          newFilters[sectionId] = [...currentSelection, optionId];
        }
      }
      
      return newFilters;
    });
  };

  const handleApplyFilters = () => {
    const filters = {
      ...selectedFilters,
      priceRange: {
        min: priceRange.min ? parseInt(priceRange.min) : undefined,
        max: priceRange.max ? parseInt(priceRange.max) : undefined,
      },
    };
    onApplyFilters(filters);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    setPriceRange({ min: '', max: '' });
  };

  const isFilterSelected = (sectionId: string, optionId: string, type: string) => {
    if (type === 'single') {
      return selectedFilters[sectionId] === optionId;
    } else if (type === 'multiple') {
      return selectedFilters[sectionId]?.includes(optionId) || false;
    }
    return false;
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    container: {
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
      borderTopLeftRadius: semanticSpacing.radius['2xl'],
      borderTopRightRadius: semanticSpacing.radius['2xl'],
      maxHeight: '80%',
      paddingBottom: semanticSpacing.xl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.lg,
      paddingVertical: semanticSpacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.border.light : colors.border.light,
    },
    headerTitle: {
      fontSize: typography.h4.fontSize,
      fontWeight: typography.h4.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    closeButton: {
      padding: semanticSpacing.sm,
    },
    content: {
      flex: 1,
      paddingHorizontal: semanticSpacing.lg,
    },
    section: {
      marginBottom: semanticSpacing.xl,
    },
    sectionTitle: {
      fontSize: typography.bodyLarge.fontSize,
      fontWeight: typography.fontWeights.semibold,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.md,
    },
    priceRangeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: semanticSpacing.lg,
    },
    priceInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : colors.border.light,
      borderRadius: semanticSpacing.radius.md,
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
      backgroundColor: isDark ? colors.gray[800] : colors.background.light,
    },
    priceSeparator: {
      marginHorizontal: semanticSpacing.md,
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
    },
    optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    optionButton: {
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      borderRadius: semanticSpacing.radius.lg,
      borderWidth: 1,
      marginRight: semanticSpacing.sm,
      marginBottom: semanticSpacing.sm,
    },
    optionButtonSelected: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    optionButtonUnselected: {
      backgroundColor: 'transparent',
      borderColor: isDark ? colors.border.light : colors.border.light,
    },
    optionText: {
      fontSize: typography.body.fontSize,
      fontWeight: typography.fontWeights.medium,
    },
    optionTextSelected: {
      color: colors.background.light,
    },
    optionTextUnselected: {
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    actions: {
      flexDirection: 'row',
      paddingHorizontal: semanticSpacing.lg,
      paddingTop: semanticSpacing.lg,
      borderTopWidth: 1,
      borderTopColor: isDark ? colors.border.light : colors.border.light,
    },
    clearButton: {
      flex: 1,
      paddingVertical: semanticSpacing.md,
      marginRight: semanticSpacing.sm,
      borderRadius: semanticSpacing.radius.lg,
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : colors.border.light,
      alignItems: 'center',
    },
    clearButtonText: {
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    applyButton: {
      flex: 1,
      paddingVertical: semanticSpacing.md,
      marginLeft: semanticSpacing.sm,
      borderRadius: semanticSpacing.radius.lg,
      backgroundColor: colors.primary[500],
      alignItems: 'center',
    },
    applyButtonText: {
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
      color: colors.background.light,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons 
                name="close" 
                size={24} 
                color={isDark ? colors.gray[400] : colors.gray[600]} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Price Range */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={priceRange.min}
                  onChangeText={(text) => setPriceRange(prev => ({ ...prev, min: text }))}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>to</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={priceRange.max}
                  onChangeText={(text) => setPriceRange(prev => ({ ...prev, max: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Filter Sections */}
            {filterSections.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.optionsContainer}>
                  {section.options.map((option) => {
                    const isSelected = isFilterSelected(section.id, option.id, section.type);
                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionButton,
                          isSelected ? styles.optionButtonSelected : styles.optionButtonUnselected,
                        ]}
                        onPress={() => handleFilterSelect(section.id, option.id, section.type)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected ? styles.optionTextSelected : styles.optionTextUnselected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilters}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
