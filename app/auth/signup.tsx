import { useColorScheme } from '@/hooks/use-color-scheme';
import { validateIranianMobileNumber, validateIranianNationalId } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Alert, I18nManager, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import {
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  Pressable,
  Spinner,
  Text,
  VStack,
} from '@gluestack-ui/themed';
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

type SignupFormValues = {
  firstName: string;
  lastName: string;
  nationalId: string;
  phone: string;
  guildId: string;
};

export default function SignupScreen(props: SignupScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();
  const isRTL = I18nManager.isRTL;
  
  const [selectedGuild, setSelectedGuild] = useState('');
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuilds, setIsLoadingGuilds] = useState(true);
  const [isGuildModalOpen, setIsGuildModalOpen] = useState(false);
  
  // RHF + Yup schema
  const nameRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-zA-Z\s\-]+$/;
  const schema = yup.object({
    firstName: yup
      .string()
      .required(t('signup.errors.firstNameTooShort'))
      .min(2, t('signup.errors.firstNameTooShort'))
      .matches(nameRegex, t('signup.errors.firstNameInvalid'))
      .test('no-multi-spaces', t('signup.errors.noMultipleSpaces'), (v) => !(/\s{2,}/.test(v || '')))
      .test('no-multi-hyphens', t('signup.errors.noMultipleHyphens'), (v) => !(/--+/.test(v || ''))),
    lastName: yup
      .string()
      .required(t('signup.errors.firstNameTooShort'))
      .min(2, t('signup.errors.firstNameTooShort'))
      .matches(nameRegex, t('signup.errors.firstNameInvalid'))
      .test('no-multi-spaces', t('signup.errors.noMultipleSpaces'), (v) => !(/\s{2,}/.test(v || '')))
      .test('no-multi-hyphens', t('signup.errors.noMultipleHyphens'), (v) => !(/--+/.test(v || ''))),
    nationalId: yup
      .string()
      .required(t('signup.errors.invalidNationalId'))
      .length(10, t('signup.errors.invalidNationalId'))
      .test('is-valid-nid', t('signup.errors.invalidNationalId'), (v) => validateIranianNationalId(String(v || ''))),
    phone: yup
      .string()
      .required(t('signup.errors.invalidPhone'))
      .test('iran-phone', t('signup.errors.invalidPhone'), (value) => !!validateIranianMobileNumber(value || '').isValid),
    guildId: yup
      .string()
      .required(t('signup.errors.guildRequired')),
  });

  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm<SignupFormValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      nationalId: '',
      phone: props.initialPhone || '',
      guildId: '',
    },
  });

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

  const handleSignup = async () => {
    const { firstName, lastName, nationalId, phone, guildId } = getValues();
    
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
        guildId: guildId || selectedGuild,
      });

      if (resp.success) {
        // Ensure OTP is requested after successful signup
        try {
          await authService.sendOTP({ phone: phone.trim(), is_signup: true });
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
    <Box flex={1} backgroundColor="$backgroundLight0">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <VStack 
            paddingHorizontal={24} 
            paddingTop={32} 
            paddingBottom={16} 
            maxWidth={420} 
            alignSelf="center" 
            width="100%" 
            space={24}
          >
            {/* Header Section */}
            <VStack alignItems="center" space={16}>
              <Animated.View entering={FadeInDown.duration(400)}>
                <Box 
                  width={80} 
                  height={80} 
                  borderRadius="$full" 
                  backgroundColor="$primary500" 
                  alignItems="center" 
                  justifyContent="center"
                  softShadow="4"
                  borderWidth={4}
                  borderColor="$primary100"
                >
                  <Icon as={Ionicons} name="person-add" color="$white" size="xl" />
                </Box>
              </Animated.View>
              <VStack alignItems="center" space={8}>
                <Heading size="xl" textAlign="center" color="$textLight900">
                  {t('signup.title')}
                </Heading>
                <Text 
                  textAlign="center" 
                  color="$textLight600" 
                  fontSize="$md"
                  lineHeight="$md"
                  maxWidth={280}
                >
                  {t('signup.subtitle')}
                </Text>
              </VStack>
            </VStack>

            {/* Form Section */}
            <VStack space={20} backgroundColor="$backgroundLight50" borderRadius="$xl" padding={24} softShadow="2">
              {/* Name Fields Row */}
              <HStack space={16}>
                <VStack flex={1} space={8}>
                  <Text fontSize="$sm" fontWeight="$semibold" color="$textLight700" textAlign="right">
                    {t('signup.firstName')}
                  </Text>
                  <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder={t('signup.firstName')}
                        value={value}
                        onChangeText={onChange}
                        isDisabled={isLoading}
                        textAlign={isRTL ? 'right' : 'left'}
                        height={52}
                        variant="outline"
                        isInvalid={!!errors.firstName}
                        borderColor={errors.firstName ? '$error500' : '$borderLight300'}
                        backgroundColor="$backgroundLight0"
                        borderRadius="$lg"
                        fontSize="$md"
                        _focus={{
                          borderColor: '$primary500',
                          backgroundColor: '$backgroundLight0',
                        }}
                      />
                    )}
                  />
                  {!!errors.firstName?.message && (
                    <Text color="$error500" fontSize="$sm" marginTop={4} textAlign="right">
                      {String(errors.firstName.message)}
                    </Text>
                  )}
                </VStack>
                <VStack flex={1} space={8}>
                  <Text fontSize="$sm" fontWeight="$semibold" color="$textLight700" textAlign="right">
                    {t('signup.lastName')}
                  </Text>
                  <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder={t('signup.lastName')}
                        value={value}
                        onChangeText={onChange}
                        isDisabled={isLoading}
                        textAlign={isRTL ? 'right' : 'left'}
                        height={52}
                        variant="outline"
                        isInvalid={!!errors.lastName}
                        borderColor={errors.lastName ? '$error500' : '$borderLight300'}
                        backgroundColor="$backgroundLight0"
                        borderRadius="$lg"
                        fontSize="$md"
                        _focus={{
                          borderColor: '$primary500',
                          backgroundColor: '$backgroundLight0',
                        }}
                      />
                    )}
                  />
                  {!!errors.lastName?.message && (
                    <Text color="$error500" fontSize="$sm" marginTop={4} textAlign="right">
                      {String(errors.lastName.message)}
                    </Text>
                  )}
                </VStack>
              </HStack>

              {/* National ID Field */}
              <VStack space={8}>
                <Text fontSize="$sm" fontWeight="$semibold" color="$textLight700" textAlign="right">
                  {t('signup.nationalId')}
                </Text>
                <Controller
                  control={control}
                  name="nationalId"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('signup.nationalIdPlaceholder')}
                      keyboardType="number-pad"
                      value={value}
                      onChangeText={onChange}
                      isDisabled={isLoading}
                      maxLength={10}
                      textAlign="left"
                      height={52}
                      variant="outline"
                      isInvalid={!!errors.nationalId}
                      borderColor={errors.nationalId ? '$error500' : '$borderLight300'}
                      backgroundColor="$backgroundLight0"
                      borderRadius="$lg"
                      fontSize="$md"
                      _focus={{
                        borderColor: '$primary500',
                        backgroundColor: '$backgroundLight0',
                      }}
                    />
                  )}
                />
                {!!errors.nationalId?.message && (
                  <Text color="$error500" fontSize="$sm" marginTop={4} textAlign="right">
                    {String(errors.nationalId.message)}
                  </Text>
                )}
              </VStack>

              {/* Phone Field */}
              <VStack space={8}>
                <Text fontSize="$sm" fontWeight="$semibold" color="$textLight700" textAlign="right">
                  {t('signup.phone')}
                </Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder={t('signup.phonePlaceholder')}
                      keyboardType="phone-pad"
                      value={value}
                      onChangeText={onChange}
                      isDisabled={isLoading}
                      textAlign="left"
                      height={52}
                      variant="outline"
                      isInvalid={!!errors.phone}
                      borderColor={errors.phone ? '$error500' : '$borderLight300'}
                      backgroundColor="$backgroundLight0"
                      borderRadius="$lg"
                      fontSize="$md"
                      _focus={{
                        borderColor: '$primary500',
                        backgroundColor: '$backgroundLight0',
                      }}
                    />
                  )}
                />
                {!!errors.phone?.message && (
                  <Text color="$error500" fontSize="$sm" marginTop={4} textAlign="right">
                    {String(errors.phone.message)}
                  </Text>
                )}
              </VStack>

              {/* Guild Selection Field */}
              <VStack space={8}>
                <Text fontSize="$sm" fontWeight="$semibold" color="$textLight700" textAlign="right">
                  {t('signup.guild')}
                </Text>
                {isLoadingGuilds ? (
                  <HStack 
                    height={52} 
                    paddingHorizontal={16} 
                    borderWidth={1} 
                    borderColor="$borderLight300" 
                    borderRadius="$lg" 
                    alignItems="center" 
                    justifyContent="center" 
                    backgroundColor="$backgroundLight0"
                  >
                    <Spinner size="sm" color="$primary500" />
                    <Text marginLeft={12} color="$textLight600" fontSize="$md">
                      {t('signup.loadingGuilds')}
                    </Text>
                  </HStack>
                ) : (
                  <Pressable onPress={() => setIsGuildModalOpen(true)} isDisabled={isLoading}>
                    {({ isPressed }) => (
                      <HStack
                        height={52}
                        paddingHorizontal={16}
                        borderWidth={1}
                        borderColor={errors.guildId ? '$error500' : '$borderLight300'}
                        borderRadius="$lg"
                        alignItems="center"
                        justifyContent="space-between"
                        backgroundColor="$backgroundLight0"
                        opacity={isPressed ? 0.9 : 1}
                        _focus={{
                          borderColor: '$primary500',
                        }}
                      >
                        <Text 
                          color={selectedGuild ? '$textLight900' : '$textLight500'} 
                          fontSize="$md"
                          fontWeight={selectedGuild ? '$medium' : '$normal'}
                        >
                          {selectedGuild ? (guilds.find(g => g.id === selectedGuild)?.name || '') : t('signup.selectGuild')}
                        </Text>
                        <Icon 
                          as={Ionicons} 
                          name={isRTL ? 'chevron-back' : 'chevron-forward'} 
                          color="$textLight400" 
                          size="sm" 
                        />
                      </HStack>
                    )}
                  </Pressable>
                )}
                {!!errors.guildId?.message && (
                  <Text color="$error500" fontSize="$sm" marginTop={4} textAlign="right">
                    {String(errors.guildId.message)}
                  </Text>
                )}

                {/* Guild Selection Modal */}
                <Modal isOpen={isGuildModalOpen} onClose={() => setIsGuildModalOpen(false)} size="lg">
                  <Modal.Content maxHeight="70%" borderRadius="$xl">
                    <Modal.CloseButton />
                    <Modal.Header alignItems="center" borderBottomWidth={1} borderBottomColor="$borderLight200">
                      <VStack alignItems="center" width="100%" space={4}>
                        <Heading size="lg" color="$textLight900">{t('signup.selectGuild')}</Heading>
                        <Text color="$textLight600" fontSize="$sm" textAlign="center" maxWidth={280}>
                          {t('signup.guildNote')}
                        </Text>
                      </VStack>
                    </Modal.Header>
                    <Modal.Body padding={0}>
                      <VStack space={0}>
                        {guilds.map((guild, index) => (
                          <Pressable
                            key={guild.id}
                            onPress={() => {
                              setSelectedGuild(guild.id);
                              setValue('guildId', guild.id, { shouldValidate: true });
                              setIsGuildModalOpen(false);
                            }}
                          >
                            {({ isPressed }) => (
                              <Box 
                                paddingHorizontal={20} 
                                paddingVertical={16} 
                                backgroundColor={selectedGuild === guild.id ? '$primary50' : 'transparent'} 
                                opacity={isPressed ? 0.9 : 1} 
                                borderBottomWidth={index < guilds.length - 1 ? 1 : 0}
                                borderBottomColor="$borderLight100"
                              >
                                <HStack alignItems="center" space={12}>
                                  <Box
                                    width={8}
                                    height={8}
                                    borderRadius="$full"
                                    backgroundColor={selectedGuild === guild.id ? '$primary500' : '$backgroundLight200'}
                                  />
                                  <Text 
                                    fontSize="$md" 
                                    fontWeight={selectedGuild === guild.id ? '$semibold' : '$normal'}
                                    color={selectedGuild === guild.id ? '$primary700' : '$textLight900'}
                                  >
                                    {guild.name}
                                  </Text>
                                </HStack>
                              </Box>
                            )}
                          </Pressable>
                        ))}
                      </VStack>
                    </Modal.Body>
                  </Modal.Content>
                </Modal>
              </VStack>

            </VStack>

            {/* Submit Button */}
            <Button
              marginTop={8}
              isDisabled={isLoading || isLoadingGuilds}
              onPress={handleSubmit(handleSignup)}
              height={56}
              backgroundColor="$primary500"
              borderRadius="$xl"
              softShadow="3"
              _pressed={{
                backgroundColor: '$primary600',
                transform: [{ scale: 0.98 }],
              }}
              _disabled={{
                backgroundColor: '$backgroundLight200',
                opacity: 0.6,
              }}
            >
              <HStack alignItems="center" space={8}>
                {isLoading ? (
                  <Spinner color="$white" size="sm" />
                ) : (
                  <Icon as={Ionicons} name="checkmark-circle" color="$white" size="md" />
                )}
                <Text 
                  color="$white" 
                  fontSize="$lg" 
                  fontWeight="$semibold"
                >
                  {isLoading ? t('common.loading') : t('signup.submit')}
                </Text>
              </HStack>
            </Button>

            {/* Footer */}
            <HStack 
              marginTop={32} 
              justifyContent="center" 
              alignItems="center" 
              space={8}
              paddingHorizontal={16}
            >
              <Text color="$textLight600" fontSize="$md">
                {t('signup.haveAccount')}
              </Text>
              {props?.onNavigateToLogin ? (
                <Pressable onPress={props.onNavigateToLogin}>
                  {({ isPressed }) => (
                    <Text 
                      color="$primary500" 
                      fontSize="$md" 
                      fontWeight="$semibold" 
                      opacity={isPressed ? 0.8 : 1}
                      textDecorationLine="underline"
                    >
                      {t('signup.login')}
                    </Text>
                  )}
                </Pressable>
              ) : (
                <Link href="/auth/login" asChild>
                  <Pressable>
                    {({ isPressed }) => (
                      <Text 
                        color="$primary500" 
                        fontSize="$md" 
                        fontWeight="$semibold" 
                        opacity={isPressed ? 0.8 : 1}
                        textDecorationLine="underline"
                      >
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
