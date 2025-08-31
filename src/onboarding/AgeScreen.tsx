import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { useI18n } from '@hooks/useI18n';
import { useUserData } from '@hooks/useUserData';

type AgeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Age'
>;

const AgeScreen = () => {
  const navigation = useNavigation<AgeScreenNavigationProp>();
  const { t } = useI18n();
  const { updateUser } = useUserData();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [selectedAge, setSelectedAge] = useState(25);
  const flatListRef = useRef<FlatList>(null);
  const itemHeight = 45;
  const ages = Array.from({ length: 82 }, (_, i) => i + 18); // 18-99 yaş arası

  // Tema renkleri (proje yapısına uygun)
  const colors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    buttonText: '#FFFFFF'
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    backButton: {
      fontSize: 24,
      fontFamily: 'System',
      color: colors.text,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      paddingHorizontal: screenWidth < 380 ? 12 : 16,
      paddingBottom: screenHeight < 700 ? 80 : 100, // Buton için alan bırak
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: screenHeight < 700 ? 10 : 20,
    },
    title: {
      fontSize: screenWidth < 380 ? 32 : 40,
      fontFamily: 'System',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: screenHeight < 700 ? 4 : 8,
      letterSpacing: -1,
      color: colors.text,
    },
    subtitle: {
      fontSize: screenWidth < 380 ? 15 : 17,
      fontFamily: 'System',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: screenWidth < 380 ? 20 : 24,
      marginBottom: screenHeight < 700 ? 20 : 40,
    },
    pickerContainer: {
      height: screenHeight < 700 ? 280 : 360,
      width: '100%',
      marginBottom: screenHeight < 700 ? 20 : 40,
      overflow: 'visible',
    },
    selectionOverlay: {
      position: 'absolute',
      top: '50%',
      width: '100%',
      height: 45,
      marginTop: -22.5,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: colors.primary,
      zIndex: 1,
      pointerEvents: 'none',
    },
    scrollContent: {
      paddingVertical: screenHeight < 700 ? 117.5 : 157.5,
    },
    ageItem: {
      width: '100%',
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    selectedAge: {},
    ageText: {
      fontSize: screenWidth < 380 ? 20 : 24,
      fontFamily: 'System',
    },
    selectedAgeText: {
      fontSize: screenWidth < 380 ? 28 : 34,
      fontFamily: 'System',
      color: colors.text,
      fontWeight: '700',
    },
    unselectedAgeText: {
      fontFamily: 'System',
      color: colors.textSecondary,
      fontWeight: '400',
    },
    continueButton: {
      width: '100%',
      height: screenHeight < 700 ? 48 : 56,
      backgroundColor: colors.primary,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: screenHeight < 700 ? 20 : 30,
      left: 16,
      right: 16,
    },
    continueButtonText: {
      color: colors.buttonText,
      fontSize: screenWidth < 380 ? 16 : 18,
      fontFamily: 'System',
      fontWeight: '600',
    },
  });

  const initialIndex = ages.findIndex(age => age === 25);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (ages[index]) {
      setSelectedAge(ages[index]);
    }
  };

  const handleAgeSelection = async (selectedAge: number) => {
    try {
      setSelectedAge(selectedAge);
      
      // Yaş seçimini user data'ya kaydet
      const success = await updateUser({
        age: selectedAge,
        onboardingStep: 'age_completed'
      });

      if (success) {
        console.log('Age saved to user data:', selectedAge);
        // İleriki ekranlara yönlendirme
        navigation.navigate('Height');
      } else {
        throw new Error('User data güncellenemedi');
      }
      
    } catch (error: any) {
      console.error('AgeScreen: Error in handleAgeSelection:', error);
      Alert.alert(
        t('common.error'),
        'Bir hata oluştu',
        [{ text: t('common.ok'), onPress: () => {} }]
      );
    }
  };

  const renderItem = ({ item: age }: { item: number }) => (
    <View
      style={[
        styles.ageItem,
        selectedAge === age && styles.selectedAge,
      ]}
    >
      <Text
        style={[
          styles.ageText,
          selectedAge === age ? styles.selectedAgeText : styles.unselectedAgeText,
        ]}
      >
        {age}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'←'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            <Text>{t('age.age_screen_title_part1')}</Text>
            <Text style={{ color: colors.primary }}>{t('age.age_screen_title_part2')}</Text>
            <Text>{t('age.age_screen_title_part3')}</Text>
          </Text>
          <Text style={styles.subtitle}>
            {t('age.age_screen_subtitle')}
          </Text>
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.selectionOverlay} />
          <FlatList
            ref={flatListRef}
            data={ages}
            renderItem={renderItem}
            keyExtractor={(item) => item.toString()}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            scrollEnabled={true}
            onMomentumScrollEnd={handleScroll}
            initialScrollIndex={initialIndex}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
            contentContainerStyle={styles.scrollContent}
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => handleAgeSelection(selectedAge)}
        >
          <Text style={styles.continueButtonText}>{t('age.continue_button')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AgeScreen;
