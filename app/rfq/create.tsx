import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useCreateRFQ } from '@/features/rfq/hooks';
import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export default function CreateRFQScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    quantity: '',
    budget: '',
    deliveryDate: '',
    location: '',
    specifications: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const createRFQ = useCreateRFQ();

  const categories = [
    'Construction Materials',
    'Electronics',
    'Textiles',
    'Food & Beverage',
    'Automotive',
    'Chemicals',
    'Machinery',
    'Other',
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title for your RFQ');
      return;
    }

    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!formData.category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setIsLoading(true);
    try {
      await createRFQ.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        quantity: formData.quantity,
        budget: formData.budget,
        deliveryDate: formData.deliveryDate,
        location: formData.location,
        specifications: formData.specifications,
      } as any);
      Alert.alert(
        'Success',
        'Your RFQ has been created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create RFQ. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      backgroundColor: isDark ? colors.background.dark : colors.background.light,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors.border.light : colors.border.light,
    },
    backButton: {
      padding: semanticSpacing.sm,
      marginRight: semanticSpacing.sm,
    },
    headerTitle: {
      fontSize: typography.h4.fontSize,
      fontWeight: typography.h4.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: semanticSpacing.md,
    },
    form: {
      paddingVertical: semanticSpacing.lg,
    },
    section: {
      marginBottom: semanticSpacing.xl,
    },
    sectionTitle: {
      fontSize: typography.h4.fontSize,
      fontWeight: typography.h4.fontWeight,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.md,
    },
    inputContainer: {
      marginBottom: semanticSpacing.lg,
    },
    label: {
      fontSize: typography.body.fontSize,
      fontWeight: fontWeights.medium,
      color: isDark ? colors.text.primary : colors.text.primary,
      marginBottom: semanticSpacing.sm,
    },
    required: {
      color: colors.error[500],
    },
    textInput: {
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : colors.border.light,
      borderRadius: semanticSpacing.radius.lg,
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.md,
      fontSize: typography.body.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
      backgroundColor: isDark ? colors.gray[800] : colors.background.light,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: semanticSpacing.sm,
    },
    categoryButton: {
      paddingHorizontal: semanticSpacing.md,
      paddingVertical: semanticSpacing.sm,
      borderRadius: semanticSpacing.radius.lg,
      borderWidth: 1,
      borderColor: isDark ? colors.border.light : colors.border.light,
      backgroundColor: isDark ? colors.gray[800] : colors.background.light,
    },
    categoryButtonSelected: {
      backgroundColor: colors.primary[500],
      borderColor: colors.primary[500],
    },
    categoryButtonText: {
      fontSize: typography.bodySmall.fontSize,
      color: isDark ? colors.text.primary : colors.text.primary,
    },
    categoryButtonTextSelected: {
      color: colors.background.light,
    },
    submitButton: {
      backgroundColor: colors.primary[500],
      borderRadius: semanticSpacing.radius.lg,
      paddingVertical: semanticSpacing.md,
      alignItems: 'center',
      marginTop: semanticSpacing.lg,
    },
    submitButtonDisabled: {
      backgroundColor: colors.gray[300],
    },
    submitButtonText: {
      fontSize: typography.button.fontSize,
      fontWeight: typography.button.fontWeight,
      color: colors.background.light,
    },
    helpText: {
      fontSize: typography.caption.fontSize,
      color: isDark ? colors.text.secondary : colors.text.secondary,
      marginTop: semanticSpacing.xs,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isDark ? colors.gray[400] : colors.gray[600]} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create RFQ</Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.form}>
            {/* Basic Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Title <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter RFQ title"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.title}
                  onChangeText={(value) => handleInputChange('title', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Description <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Describe what you're looking for"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.description}
                  onChangeText={(value) => handleInputChange('description', value)}
                  multiline
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>
                  Category <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.categoryContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryButton,
                        formData.category === category && styles.categoryButtonSelected,
                      ]}
                      onPress={() => handleInputChange('category', category)}
                    >
                      <Text style={[
                        styles.categoryButtonText,
                        formData.category === category && styles.categoryButtonTextSelected,
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Requirements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 100 units, 50 kg"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.quantity}
                  onChangeText={(value) => handleInputChange('quantity', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Budget Range</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 1,000,000 - 2,000,000 Toman"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.budget}
                  onChangeText={(value) => handleInputChange('budget', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Delivery Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Within 2 weeks"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.deliveryDate}
                  onChangeText={(value) => handleInputChange('deliveryDate', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Tehran, Iran"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.location}
                  onChangeText={(value) => handleInputChange('location', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Technical Specifications</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Any specific technical requirements or specifications"
                  placeholderTextColor={isDark ? colors.gray[400] : colors.gray[500]}
                  value={formData.specifications}
                  onChangeText={(value) => handleInputChange('specifications', value)}
                  multiline
                />
                <Text style={styles.helpText}>
                  Include any technical details, certifications, or quality standards required
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Creating RFQ...' : 'Create RFQ'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
