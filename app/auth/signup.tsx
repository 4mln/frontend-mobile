import { useColorScheme } from '@/hooks/use-color-scheme';
import { validateIranianMobileNumber, validateIranianNationalId } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, I18nManager, Platform } from 'react-native';
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { authService } from '@/services/auth';
import { semanticSpacing } from '@/theme/spacing';
import { fontWeights, lineHeights, typography } from '@/theme/typography';
import { ensureOnlineOrMessage } from '@/utils/connection';
import { useMessageBoxStore } from '@/context/messageBoxStore';
import i18n from '@/i18n';

type Guild = {
  id: string;
  name: string;
};

type SignupScreenProps = {
  initialPhone?: string;
  onNavigateToLogin?: () => void;
  onOtpRequested?: (phone: string) => void;
};

export default function SignupScreen(props: SignupScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState(props.initialPhone || '');
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
    if (val.length < 2) return t('signup.errors.firstNameTooShort');
    // Allow Persian letters, Arabic letters, English letters, spaces, and hyphen
    const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z\s\-]+$/;
    if (!nameRegex.test(val)) return t('signup.errors.firstNameInvalid');
    // Disallow multiple consecutive spaces or hyphens
    if (/\s{2,}/.test(val)) return t('signup.errors.noMultipleSpaces');
    if (/--+/.test(val)) return t('signup.errors.noMultipleHyphens');
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
      setNationalIdError(t('signup.errors.invalidNationalId'));
      isValid = false;
    } else {
      setNationalIdError(undefined);
    }
    
    // Validate phone number
    const phoneValidation = validateIranianMobileNumber(phone);
    if (!phoneValidation.isValid) {
      setPhoneError(t('signup.errors.invalidPhone'));
      isValid = false;
    } else {
      setPhoneError(undefined);
    }
    
    // Validate guild selection
    if (!selectedGuild) {
      setGuildError(t('signup.errors.guildRequired'));
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
      // Pre-check phone and national ID existence
      const existsResp = await authService.phoneOrNationalIdExists(phone.trim(), nationalId.trim());
      if (existsResp.success && existsResp.data?.exists) {
        useMessageBoxStore.getState().show({
          message: i18n.t('auth.idOrPhoneExists', 'This ID or phone number exists.'),
          actions: [{ label: i18n.t('common.back') }],
        });
        return;
      }

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
        Alert.alert(t('signup.alerts.signupFailedTitle'), resp.error || t('signup.alerts.signupFailed'));
      }
    } catch (error) {
      Alert.alert(t('signup.alerts.signupFailedTitle'), t('signup.alerts.signupFailedRetry'));
    } finally {
      setIsLoading(false);
    }
  };

  // If opened from LoginWall with pre-filled phone, keep it
  // (LoginWall passes pendingPhone via state; we can accept it through props/hooks later if needed)

  return (
    <Box flex={1} safeArea>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <VStack px={semanticSpacing.lg} py={semanticSpacing.lg} maxW={400} alignSelf="center" w="100%" space={semanticSpacing.sm}>
            <VStack alignItems="center" mb={semanticSpacing.md}>
              <Animated.View entering={FadeInDown.duration(300)}>
                <Box w={20} h={20} rounded="full" bg="primary.600" alignItems="center" justifyContent="center" mb={semanticSpacing.lg} shadow="3">
                  <Icon as={Ionicons} name="person-add" color="white" size="xl" />
                </Box>
              </Animated.View>
              <Heading size="lg" textAlign="center" mb={semanticSpacing.xs}>
                {t('signup.title')}
              </Heading>
              <Text textAlign="center" color="text.secondary">
                {t('signup.subtitle')}
              </Text>
            </VStack>

            <VStack space={semanticSpacing.sm}>
              <HStack space={3}>
                <VStack flex={1}>
                  <Text fontSize={16} fontWeight={fontWeights.medium as any} mb={semanticSpacing.xs} textAlign="right">
                    {t('signup.firstName')}
                  </Text>
                  <Input
                    placeholder={t('signup.firstName')}
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (firstNameError) setFirstNameError(undefined);
                    }}
                    isDisabled={isLoading}
                    textAlign={isRTL ? 'right' : 'left'}
                    height={44}
                    variant="outline"
                    isInvalid={!!firstNameError}
                  />
                  {firstNameError ? (
                    <Text color="error.500" fontSize={14} mt={semanticSpacing.xs} textAlign="right">
                      {firstNameError}
                    </Text>
                  ) : null}
                </VStack>
                <VStack flex={1}>
                  <Text fontSize={16} fontWeight={fontWeights.medium as any} mb={semanticSpacing.xs} textAlign="right">
                    {t('signup.lastName')}
                  </Text>
                  <Input
                    placeholder={t('signup.lastName')}
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (lastNameError) setLastNameError(undefined);
                    }}
                    isDisabled={isLoading}
                    textAlign={isRTL ? 'right' : 'left'}
                    height={44}
                    variant="outline"
                    isInvalid={!!lastNameError}
                  />
                  {lastNameError ? (
                    <Text color="error.500" fontSize={14} mt={semanticSpacing.xs} textAlign="right">
                      {lastNameError}
                    </Text>
                  ) : null}
                </VStack>
              </HStack>

              <VStack>
                <Text fontSize={16} fontWeight={fontWeights.medium as any} mb={semanticSpacing.xs} textAlign="right">
                  {t('signup.nationalId')}
                </Text>
                <Input
                  placeholder={t('signup.nationalIdPlaceholder')}
                  keyboardType="number-pad"
                  value={nationalId}
                  onChangeText={(text) => {
                    setNationalId(text);
                    if (nationalIdError) setNationalIdError(undefined);
                  }}
                  isDisabled={isLoading}
                  maxLength={10}
                  textAlign="left"
                  height={44}
                  variant="outline"
                  isInvalid={!!nationalIdError}
                />
                {nationalIdError ? (
                  <Text color="error.500" fontSize={14} mt={semanticSpacing.xs} textAlign="right">
                    {nationalIdError}
                  </Text>
                ) : null}
              </VStack>

              <VStack>
                <Text fontSize={16} fontWeight={fontWeights.medium as any} mb={semanticSpacing.xs} textAlign="right">
                  {t('signup.phone')}
                </Text>
                <Input
                  placeholder={t('signup.phonePlaceholder')}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text);
                    if (phoneError) setPhoneError(undefined);
                  }}
                  isDisabled={isLoading}
                  textAlign="left"
                  height={44}
                  variant="outline"
                  isInvalid={!!phoneError}
                />
                {phoneError ? (
                  <Text color="error.500" fontSize={14} mt={semanticSpacing.xs} textAlign="right">
                    {phoneError}
                  </Text>
                ) : null}
              </VStack>

              <VStack>
                <Text fontSize={16} fontWeight={fontWeights.medium as any} mb={semanticSpacing.xs} textAlign="right">
                  {t('signup.guild')}
                </Text>
                {isLoadingGuilds ? (
                  <HStack height={44} px={semanticSpacing.md} borderWidth={1} borderColor="gray.300" rounded="md" alignItems="center" justifyContent="center" bg="background.light">
                    <Spinner size="sm" color="primary.500" />
                    <Text ml={semanticSpacing.sm} color="text.secondary" fontSize={16}>
                      {t('signup.loadingGuilds')}
                    </Text>
                  </HStack>
                ) : (
                  <Pressable onPress={() => setIsGuildModalOpen(true)} isDisabled={isLoading}>
                    {({ isPressed }) => (
                      <HStack
                        height={44}
                        px={semanticSpacing.md}
                        borderWidth={1}
                        borderColor={guildError ? 'error.500' : 'gray.300'}
                        rounded="md"
                        alignItems="center"
                        justifyContent="space-between"
                        bg="background.light"
                        opacity={isPressed ? 0.9 : 1}
                      >
                        <Text color={selectedGuild ? 'text.primary' : 'text.secondary'} fontSize={16}>
                          {selectedGuild ? (guilds.find(g => g.id === selectedGuild)?.name || '') : t('signup.selectGuild')}
                        </Text>
                        <Icon as={Ionicons} name={isRTL ? 'chevron-back' : 'chevron-forward'} color="gray.400" size="sm" />
                      </HStack>
                    )}
                  </Pressable>
                )}
                {guildError ? (
                  <Text color="error.500" fontSize={14} mt={semanticSpacing.xs} textAlign="right">
                    {guildError}
                  </Text>
                ) : null}

                <Modal isOpen={isGuildModalOpen} onClose={() => setIsGuildModalOpen(false)} size="lg">
                  <Modal.Content maxH="70%">
                    <Modal.CloseButton />
                    <Modal.Header alignItems="center">
                      <VStack alignItems="center" w="100%">
                        <Heading size="md">{t('signup.selectGuild')}</Heading>
                        <Text mt={1} color="text.secondary" fontSize={12} textAlign="center">
                          {t('signup.guildNote')}
                        </Text>
                      </VStack>
                    </Modal.Header>
                    <Modal.Body>
                      <VStack>
                        {guilds.map((guild) => (
                          <Pressable
                            key={guild.id}
                            onPress={() => {
                              setSelectedGuild(guild.id);
                              if (guildError) setGuildError(undefined);
                              setIsGuildModalOpen(false);
                            }}
                          >
                            {({ isPressed }) => (
                              <Box px={semanticSpacing.md} py={3} bg={selectedGuild === guild.id ? 'gray.100' : 'transparent'} opacity={isPressed ? 0.9 : 1} rounded="md">
                                <Text fontSize={16}>{guild.name}</Text>
                              </Box>
                            )}
                          </Pressable>
                        ))}
                      </VStack>
                    </Modal.Body>
                  </Modal.Content>
                </Modal>
              </VStack>

              <Button
                mt={semanticSpacing.sm}
                isDisabled={isLoading || isLoadingGuilds}
                onPress={handleSignup}
                height={44}
                leftIcon={isLoading ? undefined : <Icon as={Ionicons} name="checkmark" color="white" />}
              >
                {isLoading ? <Spinner color="white" /> : t('signup.submit')}
              </Button>
            </VStack>

            <HStack mt={semanticSpacing.xl} justifyContent="center" alignItems="center" space={2}>
              <Text color="text.secondary" fontSize={16}>
                {t('signup.haveAccount')}
              </Text>
              {props?.onNavigateToLogin ? (
                <Pressable onPress={props.onNavigateToLogin}>
                  {({ isPressed }) => (
                    <Text color="primary.600" fontSize={16} fontWeight={fontWeights.medium as any} opacity={isPressed ? 0.8 : 1}>
                      {t('signup.login')}
                    </Text>
                  )}
                </Pressable>
              ) : (
                <Link href="/auth/login" asChild>
                  <Pressable>
                    {({ isPressed }) => (
                      <Text color="primary.600" fontSize={16} fontWeight={fontWeights.medium as any} opacity={isPressed ? 0.8 : 1}>
                        {t('signup.login')}
                      </Text>
                    )}
                  </Pressable>
                </Link>
              )}
            </HStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}
