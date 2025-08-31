import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { useI18n } from '@hooks/useI18n';
import { useUserData } from '@hooks/useUserData';

// Responsive boyutlar için yardımcı fonksiyonlar
const wp = (percentage: number, width: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number, height: number) => {
  return height * (percentage / 100);
};

type GenderScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Gender'
>;

const GenderScreen = () => {
  const navigation = useNavigation<GenderScreenNavigationProp>();
  const { t, changeLanguage } = useI18n();
  const { updateUser } = useUserData();
  const { width, height } = useWindowDimensions();
  
  // Ekran boyutuna göre responsive değerler
  const isTablet = width >= 768;
  const buttonSize = isTablet ? Math.min(width * 0.18, 200) : 180;
  const buttonGap = isTablet ? 40 : 32;
  const titleFontSize = isTablet ? 48 : (width < 380 ? 32 : 40);
  const subtitleFontSize = isTablet ? 20 : (width < 380 ? 15 : 17);
  const topPadding = height < 700 ? 10 : 20;

  // Tema renkleri (proje yapısına uygun)
  const colors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    buttonText: '#FFFFFF',
    genderMale: '#4A90E2',
    genderFemale: '#E24A90'
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    backButton: {
      fontSize: 24,
      fontFamily: 'System',
      fontWeight: '400',
    },
    content: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      paddingHorizontal: width < 380 ? 12 : 16,
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      marginBottom: height < 700 ? 20 : 40,
    },
    title: {
      fontFamily: 'System',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -1,
    },
    subtitle: {
      fontFamily: 'System',
      textAlign: 'center',
      lineHeight: 24,
    },
    buttonsContainer: {
      alignItems: 'center',
      gap: buttonGap,
    },
    genderButton: {
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    genderIcon: {
      fontSize: 40,
      marginBottom: 8,
    },
    genderText: {
      fontSize: 20,
      fontFamily: 'System',
      fontWeight: '600',
    }
  });

  useEffect(() => {
    // Component mount olduğunda yapılacak işlemler
  }, []);

  const handleGenderSelect = async (gender: string) => {
    try {
      const genderValue = gender === 'male' ? 0 : 1;

      // Cinsiyet seçimini user data'ya kaydet
      const success = await updateUser({
        gender: genderValue,
        onboardingStep: 'gender_completed'
      });

      if (success) {
        console.log('Gender saved to user data:', genderValue);
        navigation.navigate('Age');
      } else {
        throw new Error('User data güncellenemedi');
      }
      
    } catch (error: any) {
      console.error('GenderScreen: Error in handleGenderSelect:', error);
      Alert.alert(
        t('common.error'),
        'Bir hata oluştu',
        [{ text: t('common.ok'), onPress: () => {} }]
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backButton, { color: colors.text }]}>{'←'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.titleContainer, { paddingTop: topPadding }]}>
          <Text style={[styles.title, { 
            color: colors.text,
            fontSize: titleFontSize
          }]}>
            {t('gender.gender_screen_title')}
          </Text>
          <Text style={[styles.subtitle, { 
            color: colors.textSecondary,
            fontSize: subtitleFontSize
          }]}>
            {t('gender.gender_screen_subtitle')}
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton, 
              { 
                backgroundColor: colors.genderMale,
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2
              }
            ]}
            onPress={() => handleGenderSelect('male')}
          >
            <Text style={[styles.genderIcon, { color: colors.buttonText }]}>♂</Text>
            <Text style={[styles.genderText, { color: colors.buttonText }]}>{t('common.male')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton, 
              { 
                backgroundColor: colors.genderFemale,
                width: buttonSize,
                height: buttonSize,
                borderRadius: buttonSize / 2
              }
            ]}
            onPress={() => handleGenderSelect('female')}
          >
            <Text style={[styles.genderIcon, { color: colors.buttonText }]}>♀</Text>
            <Text style={[styles.genderText, { color: colors.buttonText }]}>{t('common.female')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default GenderScreen;
