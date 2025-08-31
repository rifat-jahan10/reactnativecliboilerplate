import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  useWindowDimensions,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useI18n } from '@hooks/useI18n';
import { useUserData } from '@hooks/useUserData';

type NameScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NameScreen'
>;

const NameScreen = () => {
  const navigation = useNavigation<NameScreenNavigationProp>();
  const { t } = useI18n();
  const { updateUser } = useUserData();
  const { width, height } = useWindowDimensions();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    surface: '#F8F9FA',
    border: '#E0E0E0',
    error: '#FF3B30',
    buttonText: '#FFFFFF',
  };

  // Responsive değerler
  const isTablet = width >= 768;
  const titleFontSize = isTablet ? 48 : (width < 380 ? 32 : 40);
  const subtitleFontSize = isTablet ? 20 : (width < 380 ? 15 : 17);
  const topPadding = height < 700 ? 10 : 20;

  // Screen'e gelindiğinde klavyeyi otomatik aç
  useFocusEffect(
    React.useCallback(() => {
      // Kısa bir gecikme ile focus yap (animasyon tamamlansın diye)
      const timer = setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  const validateName = (inputName: string): string => {
    const trimmedName = inputName.trim();
    
    if (!trimmedName) {
      return t('name.validation_required');
    }
    
    if (trimmedName.length < 2) {
      return t('name.validation_min_length');
    }
    
    if (trimmedName.length > 30) {
      return t('name.validation_max_length');
    }
    
    // Sadece harf, boşluk ve bazı özel karakterlere izin ver
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s'-]+$/;
    if (!nameRegex.test(trimmedName)) {
      return t('name.validation_invalid');
    }
    
    return '';
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (error) {
      setError('');
    }
  };

  const handleContinue = async () => {
    const trimmedName = name.trim();
    const validationError = validateName(trimmedName);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    try {
      // Display name'i user data'ya kaydet
      const success = await updateUser({
        displayName: trimmedName,
        onboardingStep: 'name_completed'
      });

      if (success) {
        console.log('Display name saved to user data:', trimmedName);
        // Gender ekranına yönlendir
        navigation.navigate('Gender');
      } else {
        throw new Error('User data güncellenemedi');
      }
      
    } catch (error: any) {
      console.error('NameScreen: Error saving display name:', error);
      Alert.alert(
        t('common.error'),
        t('name.error_saving'),
        [{ text: t('common.ok'), onPress: () => {} }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const isButtonDisabled = !name.trim() || isLoading;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    backButton: {
      fontSize: 24,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      fontWeight: '400',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      paddingHorizontal: width < 380 ? 12 : 16,
      justifyContent: 'space-between',
    },
    topSection: {
      width: '100%',
      alignItems: 'center',
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: height < 700 ? 20 : 40,
    },
    title: {
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -1,
    },
    subtitle: {
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      textAlign: 'center',
      lineHeight: 24,
    },
    inputContainer: {
      width: '100%',
      marginBottom: height < 700 ? 20 : 40,
    },
    textInput: {
      width: '100%',
      height: height < 700 ? 48 : 56,
      borderWidth: 2,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: width < 380 ? 16 : 18,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      fontWeight: '500',
      textAlign: 'center',
    },
    errorText: {
      color: ourColors.error,
      fontSize: 14,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 8,
    },
    continueButton: {
      width: '100%',
      height: height < 700 ? 48 : 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    continueButtonText: {
      fontSize: width < 380 ? 16 : 18,
      fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
      fontWeight: '600',
    },
    disabledButton: {
      opacity: 0.5,
    },
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backButton, { color: ourColors.text }]}>{'←'}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.topSection}>
                <View style={[styles.titleContainer, { paddingTop: topPadding }]}>
                  <Text style={[styles.subtitle, {
                    color: ourColors.textSecondary,
                    fontSize: subtitleFontSize
                  }]}>
                    {t('name.screen_subtitle')}
                  </Text>
                  <Text style={[styles.title, {
                    color: ourColors.text,
                    fontSize: titleFontSize
                  }]}>
                    {t('name.screen_title')}
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    ref={textInputRef}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: ourColors.background,
                        borderColor: error ? ourColors.error : ourColors.border,
                        color: ourColors.text,
                      }
                    ]}
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder={t('name.placeholder')}
                    placeholderTextColor={ourColors.textSecondary}
                    maxLength={30}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoFocus={true}
                    returnKeyType="done"
                    onSubmitEditing={handleContinue}
                    editable={!isLoading}
                    keyboardType="default"
                    textContentType="name"
                  />
                  {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                  ) : null}
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  {
                    backgroundColor: ourColors.primary,
                  },
                  isButtonDisabled && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={isButtonDisabled}
              >
                <Text style={[styles.continueButtonText, { color: ourColors.buttonText }]}>
                  {isLoading ? '...' : t('name.continue')}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NameScreen;
