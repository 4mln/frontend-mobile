import { useColorScheme } from '@/hooks/use-color-scheme';
import { validateIranianMobileNumber, validateIranianNationalId } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { authService } from '@/services/auth';
import { colors } from '@/theme/colors';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, lineHeights, typography } from '@/theme/typography';
import { ensureOnlineOrMessage } from '@/utils/connection';

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
  const { t } = useTranslation();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGuild, setSelectedGuild] = useState('');
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuilds, setIsLoadingGuilds] = useState(true);
  const [isGuildModalOpen, setIsGuildModalOpen] = useState(false);
  
  // Form validation errors
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [lastNameError, setLastNameError] = useState<string | undefined>(undefined);
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

  const validateName = (value: string): string | undefined => {
    const val = String(value || '').trim();
    if (val.length < 2) return 'طول نام باید حداقل 2 کاراکتر باشد';
    // Allow Persian letters, Arabic letters, English letters, spaces, and hyphen
    const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z\s\-]+$/;
    if (!nameRegex.test(val)) return 'نام فقط می‌تواند شامل حروف باشد';
    // Disallow multiple consecutive spaces or hyphens
    if (/\s{2,}/.test(val)) return 'از فاصله‌های متعدد استفاده نکنید';
    if (/--+/.test(val)) return 'از خط تیره‌ی متعدد استفاده نکنید';
    return undefined;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validate first name
    const fnError = validateName(firstName);
    if (fnError) { setFirstNameError(fnError); isValid = false; } else { setFirstNameError(undefined); }

    // Validate last name
    const lnError = validateName(lastName);
    if (lnError) { setLastNameError(lnError); isValid = false; } else { setLastNameError(undefined); }
    
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
      const online = await ensureOnlineOrMessage();
      if (!online) return;
      // Call backend signup
      const resp = await authService.signup({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nationalId: nationalId.trim(),
        phone: phone.trim(),
        guildId: selectedGuild,
      });

      if (resp.success) {
        // Ensure OTP is requested after successful signup
        try {
          await authService.sendOTP({ phone: phone.trim() });
        } catch {}
        if (props?.onOtpRequested) {
          props.onOtpRequested(phone.trim());
        } else {
          router.push({ pathname: '/auth/verify-otp', params: { phone: phone.trim(), from: 'signup' } });
        }
      } else {
        Alert.alert('خطا', resp.error || 'ثبت نام با مشکل مواجه شد.');
      }
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
            {/* First/Last Name Inputs (side-by-side) */}
            <View style={styles.inputContainer}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>نام</Text>
                  <TextInput
                    style={[styles.input, firstNameError && styles.inputError, { backgroundColor: isDark ? colors.gray[800] : colors.background.light, color: isDark ? colors.text.primary : colors.text.primary, borderColor: isDark ? colors.border.light : colors.border.light }]}
                    placeholder="نام"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (firstNameError) setFirstNameError(undefined);
                    }}
                    editable={!isLoading}
                    textAlign="right"
                  />
                  {firstNameError && <Text style={styles.errorText}>{firstNameError}</Text>}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>نام خانوادگی</Text>
                  <TextInput
                    style={[styles.input, lastNameError && styles.inputError, { backgroundColor: isDark ? colors.gray[800] : colors.background.light, color: isDark ? colors.text.primary : colors.text.primary, borderColor: isDark ? colors.border.light : colors.border.light }]}
                    placeholder="نام خانوادگی"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (lastNameError) setLastNameError(undefined);
                    }}
                    editable={!isLoading}
                    textAlign="right"
                  />
                  {lastNameError && <Text style={styles.errorText}>{lastNameError}</Text>}
                </View>
              </View>
            </View>
            
            {/* National ID Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>کد ملی</Text>
              <TextInput
                style={[styles.input, nationalIdError && styles.inputError, { backgroundColor: isDark ? colors.gray[800] : colors.background.light, color: isDark ? colors.text.primary : colors.text.primary, borderColor: isDark ? colors.border.light : colors.border.light }]}
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
                style={[styles.input, phoneError && styles.inputError, { backgroundColor: isDark ? colors.gray[800] : colors.background.light, color: isDark ? colors.text.primary : colors.text.primary, borderColor: isDark ? colors.border.light : colors.border.light }]}
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
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsGuildModalOpen(true)}
                    disabled={isLoading}
                    style={[
                      styles.pickerContainer,
                      guildError && styles.inputError,
                      { backgroundColor: isDark ? colors.gray[800] : colors.background.light, borderColor: isDark ? colors.border.light : colors.border.light, height: 44, justifyContent: 'center', paddingHorizontal: semanticSpacing.md }
                    ]}
                  >
                    <Text style={{ color: selectedGuild ? (isDark ? colors.text.primary : colors.text.primary) : (isDark ? colors.text.secondary : colors.text.secondary), fontSize: 16 }}>
                      {selectedGuild ? (guilds.find(g => g.id === selectedGuild)?.name || '') : 'انتخاب صنف'}
                    </Text>
                  </TouchableOpacity>

                  <Modal transparent visible={isGuildModalOpen} animationType="fade" onRequestClose={() => setIsGuildModalOpen(false)}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: semanticSpacing.lg }}>
                      <View style={{ backgroundColor: isDark ? colors.background.dark : colors.background.light, borderRadius: 12, maxHeight: '70%', overflow: 'hidden', width: '30%', alignSelf: 'center' }}>
                        <View style={{ padding: semanticSpacing.md, borderBottomWidth: 1, borderColor: isDark ? colors.border.light : colors.border.light }}>
                          <Text style={{ color: isDark ? colors.text.primary : colors.text.primary, fontWeight: '700', fontSize: 16, textAlign: 'center' }}>انتخاب صنف</Text>
                          <Text style={{ marginTop: 6, color: isDark ? colors.text.secondary : colors.text.secondary, fontSize: 12, textAlign: 'center' }}>{t('signup.guildNote')}</Text>
                        </View>
                        <ScrollView>
                          {guilds.map((guild) => (
                            <TouchableOpacity
                              key={guild.id}
                              onPress={() => {
                                setSelectedGuild(guild.id);
                                if (guildError) setGuildError(undefined);
                                setIsGuildModalOpen(false);
                              }}
                              style={{ paddingVertical: 12, paddingHorizontal: semanticSpacing.md, backgroundColor: selectedGuild === guild.id ? (isDark ? colors.gray[800] : colors.gray[100]) : 'transparent' }}
                            >
                              <Text style={{ color: isDark ? colors.text.primary : colors.text.primary, fontSize: 16 }}>{guild.name}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                        <TouchableOpacity onPress={() => setIsGuildModalOpen(false)} style={{ padding: semanticSpacing.md, borderTopWidth: 1, borderColor: isDark ? colors.border.light : colors.border.light, alignItems: 'center' }}>
                          <Text style={{ color: isDark ? colors.text.primary : colors.text.primary, fontWeight: '700' }}>بستن</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </>
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
  helperText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: semanticSpacing.xs,
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

