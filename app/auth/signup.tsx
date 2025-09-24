import { useColorScheme } from '@/hooks/use-color-scheme';
import { validateIranianMobileNumber, validateIranianNationalId } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, lineHeights, typography } from '@/theme/typography';

type Guild = {
  id: string;
  name: string;
};

type SignupScreenProps = {
  onNavigateToLogin?: () => void;
  onOtpRequested?: (phone: string) => void;
};

export default function SignupScreen(props: SignupScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGuild, setSelectedGuild] = useState('');
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuilds, setIsLoadingGuilds] = useState(true);
  
  // Form validation errors
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [nationalIdError, setNationalIdError] = useState<string | undefined>(undefined);
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);
  const [guildError, setGuildError] = useState<string | undefined>(undefined);

  // Fetch guilds from API
  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        // In development, we'll use mock data
        // const response = await apiClient.get('/guilds');
        // setGuilds(response.data);
        
        // Mock data for development
        setTimeout(() => {
          setGuilds([
            { id: '1', name: 'پزشکی' },
            { id: '2', name: 'مهندسی' },
            { id: '3', name: 'آموزش' },
            { id: '4', name: 'فروشندگی' },
            { id: '5', name: 'خدمات' },
          ]);
          setIsLoadingGuilds(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching guilds:', error);
        setIsLoadingGuilds(false);
        Alert.alert('خطا', 'دریافت لیست صنف‌ها با مشکل مواجه شد.');
      }
    };

    fetchGuilds();
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate name
    if (!fullName.trim()) {
      setNameError('نام و نام خانوادگی الزامی است');
      isValid = false;
    } else {
      setNameError(undefined);
    }
    
    // Validate national ID
    const isValidNational = validateIranianNationalId(nationalId);
    if (!isValidNational) {
      setNationalIdError('کد ملی نامعتبر است');
      isValid = false;
    } else {
      setNationalIdError(undefined);
    }
    
    // Validate phone number
    const phoneValidation = validateIranianMobileNumber(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error);
      isValid = false;
    } else {
      setPhoneError(undefined);
    }
    
    // Validate guild selection
    if (!selectedGuild) {
      setGuildError('انتخاب صنف الزامی است');
      isValid = false;
    } else {
      setGuildError(undefined);
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In development, we'll mock the API call
      // const response = await apiClient.post('/auth/signup', {
      //   fullName,
      //   nationalId,
      //   phone,
      //   guildId: selectedGuild,
      // });
      
      console.log('Signing up with:', {
        fullName,
        nationalId,
        phone,
        guildId: selectedGuild,
      });
      
      // For development, we'll just show a success message and navigate to the OTP verification
      setTimeout(() => {
        if (props?.onOtpRequested) {
          props.onOtpRequested(phone.trim());
        } else {
          Alert.alert(
            'ثبت نام موفق',
            'کد تایید به شماره موبایل شما ارسال شد.',
            [
              {
                text: 'تایید',
                onPress: () => router.push({ pathname: '/auth/verify-otp', params: { phone: phone.trim(), from: 'signup' } }),
              },
            ]
          );
        }
      }, 1500);
    } catch (error) {
      Alert.alert('خطا', 'ثبت نام با مشکل مواجه شد. لطفا دوباره تلاش کنید.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="person-add" size={40} color="white" />
            </View>
            <Text style={styles.title}>ثبت نام</Text>
            <Text style={styles.subtitle}>لطفا اطلاعات خود را وارد کنید</Text>
          </View>
          
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>نام و نام خانوادگی</Text>
              <TextInput
                style={[styles.input, nameError && styles.inputError]}
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (nameError) setNameError(undefined);
                }}
                editable={!isLoading}
                textAlign="right"
              />
              {nameError && <Text style={styles.errorText}>{nameError}</Text>}
            </View>
            
            {/* National ID Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>کد ملی</Text>
              <TextInput
                style={[styles.input, nationalIdError && styles.inputError]}
                placeholder="کد ملی 10 رقمی"
                keyboardType="number-pad"
                value={nationalId}
                onChangeText={(text) => {
                  setNationalId(text);
                  if (nationalIdError) setNationalIdError(undefined);
                }}
                editable={!isLoading}
                maxLength={10}
                textAlign="left"
                writingDirection="ltr"
              />
              {nationalIdError && <Text style={styles.errorText}>{nationalIdError}</Text>}
            </View>
            
            {/* Phone Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>شماره موبایل</Text>
              <TextInput
                style={[styles.input, phoneError && styles.inputError]}
                placeholder="09xxxxxxxxx"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) setPhoneError(undefined);
                }}
                editable={!isLoading}
                textAlign="left"
                writingDirection="ltr"
              />
              {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
            </View>
            
            {/* Guild Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>صنف</Text>
              {isLoadingGuilds ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary[500]} />
                  <Text style={styles.loadingText}>در حال بارگذاری صنف‌ها...</Text>
                </View>
              ) : (
                <View style={[styles.pickerContainer, guildError && styles.inputError]}>
                  <Picker
                    selectedValue={selectedGuild}
                    onValueChange={(itemValue) => {
                      setSelectedGuild(itemValue);
                      if (guildError) setGuildError(undefined);
                    }}
                    enabled={!isLoading}
                    style={styles.picker}
                    dropdownIconColor={isDark ? colors.text.primary : colors.text.primary}
                  >
                    <Picker.Item label="انتخاب صنف" value="" />
                    {guilds.map((guild) => (
                      <Picker.Item key={guild.id} label={guild.name} value={guild.id} />
                    ))}
                  </Picker>
                </View>
              )}
              {guildError && <Text style={styles.errorText}>{guildError}</Text>}
            </View>
            
            {/* Signup Button */}
            <TouchableOpacity
              style={[
                styles.button,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleSignup}
              disabled={isLoading || isLoadingGuilds}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>ثبت نام</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>قبلا ثبت نام کرده‌اید؟</Text>
            {props?.onNavigateToLogin ? (
              <TouchableOpacity style={styles.loginButton} onPress={props.onNavigateToLogin}>
                <Text style={styles.loginButtonText}>ورود</Text>
              </TouchableOpacity>
            ) : (
              <Link href="/auth/login" asChild>
                <TouchableOpacity style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>ورود</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: semanticSpacing.lg,
    paddingVertical: semanticSpacing.lg,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: semanticSpacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: semanticSpacing.lg,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: semanticSpacing.sm,
  },
  subtitle: {
    fontSize: typography.bodyLarge.fontSize,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.bodyLarge.fontSize * lineHeights.normal,
  },
  form: {
    marginBottom: semanticSpacing.md,
  },
  inputContainer: {
    marginBottom: semanticSpacing.sm,
  },
  label: {
    fontSize: 16, // Fixed from typography.body.fontSize
    fontWeight: fontWeights.medium,
    color: colors.text.primary,
    marginBottom: semanticSpacing.xs,
    textAlign: 'right',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: semanticSpacing.md,
    fontSize: 16, // Fixed from typography.body.fontSize
    color: colors.text.primary,
    backgroundColor: colors.background.light,
  },
  inputError: {
    borderColor: colors.error[500],
  },
  errorText: {
    color: colors.error[500],
    fontSize: 14, // Fixed from typography.small.fontSize
    marginTop: semanticSpacing.xs,
    textAlign: 'right',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background.light,
  },
  picker: {
    height: 44,
    width: '100%',
  },
  loadingContainer: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: semanticSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.light,
  },
  loadingText: {
    marginLeft: semanticSpacing.sm,
    color: colors.text.secondary,
    fontSize: 16, // Fixed from typography.body.fontSize
  },
  button: {
    height: 44,
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: semanticSpacing.sm,
  },
  buttonDisabled: {
    backgroundColor: colors.primary[300],
  },
  buttonText: {
    color: 'white',
    fontSize: 16, // Fixed from typography.body.fontSize
    fontWeight: fontWeights.medium,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: semanticSpacing.xl,
  },
  loginText: {
    color: colors.text.secondary,
    fontSize: 16, // Fixed from typography.body.fontSize
  },
  loginButton: {
    marginLeft: semanticSpacing.xs,
  },
  loginButtonText: {
    color: colors.primary[500],
    fontSize: 16, // Fixed from typography.body.fontSize
    fontWeight: fontWeights.medium,
  },
});

