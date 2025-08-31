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
  Switch,
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

type WeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Weight'
>;

interface WeightOption {
  lbs: number;
  kg: number;
  display: string;
}

const WeightScreen = () => {
  const navigation = useNavigation<WeightScreenNavigationProp>();
  const { t } = useI18n();
  const { updateUser } = useUserData();
  const { width, height: screenHeight } = useWindowDimensions();
  
  // Responsive değerler
  const isTablet = width >= 768;
  const titleFontSize = isTablet ? 48 : (width < 380 ? 28 : 36);
  const subtitleFontSize = isTablet ? 20 : (width < 380 ? 15 : 17);
  const topPadding = screenHeight < 700 ? 10 : 20;
  
  // State management
  const [isMetric, setIsMetric] = useState(false); // false = Imperial, true = Metric
  const [selectedWeight, setSelectedWeight] = useState(0);
  
  const weightFlatListRef = useRef<FlatList>(null);
  const itemHeight = 50;

  // Weight options (Imperial: lbs, Metric: kg)
  const imperialWeights: WeightOption[] = [];
  for (let lbs = 80; lbs <= 500; lbs++) {
    const kg = Math.round(lbs * 0.453592);
    imperialWeights.push({
      lbs,
      kg,
      display: `${lbs} lbs`
    });
  }

  const metricWeights: WeightOption[] = [];
  for (let kg = 35; kg <= 200; kg++) {
    const lbs = Math.round(kg / 0.453592);
    metricWeights.push({
      lbs,
      kg,
      display: `${kg} kg`
    });
  }

  const currentWeights = isMetric ? metricWeights : imperialWeights;

  // Tema renkleri (mevcut proje yapısına uygun)
  const colors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    buttonText: '#FFFFFF',
    switchTrack: '#E5E5E5',
    switchThumb: '#FFFFFF'
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
      paddingHorizontal: width < 380 ? 12 : 16,
      paddingBottom: screenHeight < 700 ? 80 : 100, // Buton için alan bırak
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: topPadding,
      marginBottom: screenHeight < 700 ? 20 : 30,
    },
    title: {
      fontSize: titleFontSize,
      fontFamily: 'System',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: screenHeight < 700 ? 4 : 8,
      letterSpacing: -1,
      color: colors.text,
    },
    subtitle: {
      fontSize: subtitleFontSize,
      fontFamily: 'System',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: width < 380 ? 20 : 24,
    },
    unitSwitcher: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: screenHeight < 700 ? 20 : 30,
      backgroundColor: '#F8F8F8',
      borderRadius: 25,
      paddingHorizontal: 20,
      paddingVertical: 8,
    },
    unitText: {
      fontSize: 16,
      fontFamily: 'System',
      fontWeight: '600',
      marginHorizontal: 12,
    },
    unitTextActive: {
      color: colors.primary,
    },
    unitTextInactive: {
      color: colors.textSecondary,
    },
    pickerContainer: {
      height: screenHeight < 700 ? 280 : 360,
      width: '100%',
      overflow: 'visible',
      marginBottom: screenHeight < 700 ? 20 : 40,
    },
    selectionOverlay: {
      position: 'absolute',
      top: '50%',
      width: '100%',
      height: itemHeight,
      marginTop: -itemHeight / 2,
      borderTopWidth: 2,
      borderBottomWidth: 2,
      borderColor: colors.primary,
      backgroundColor: 'rgba(30, 183, 167, 0.1)',
      zIndex: 1,
      pointerEvents: 'none',
      borderRadius: 8,
    },
    scrollContent: {
      paddingVertical: screenHeight < 700 ? 117.5 : 157.5,
    },
    optionItem: {
      width: '100%',
      height: itemHeight,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 2,
    },
    optionText: {
      fontSize: width < 380 ? 16 : 18,
      fontFamily: 'System',
    },
    selectedOptionText: {
      fontSize: width < 380 ? 20 : 24,
      fontFamily: 'System',
      color: colors.primary,
      fontWeight: '700',
    },
    unselectedOptionText: {
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
      fontSize: width < 380 ? 16 : 18,
      fontFamily: 'System',
      fontWeight: '600',
    },
  });

  // Initial index
  const initialWeightIndex = Math.floor(currentWeights.length * 0.35); // ~150lbs / 70kg

  useEffect(() => {
    setSelectedWeight(initialWeightIndex);
  }, [isMetric]);

  const handleWeightScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (currentWeights[index]) {
      setSelectedWeight(index);
    }
  };

  const handleContinue = async () => {
    try {
      const weightData = currentWeights[selectedWeight];
      
      // Kilo seçimini user data'ya kaydet ve onboarding'i tamamla
      const success = await updateUser({
        weight: {
          kg: weightData.kg,
          lbs: weightData.lbs,
          isMetric: isMetric
        },
        onboardingStep: 'weight_completed',
        onboardingCompleted: true // Temel onboarding verileri tamamlandı
      });

      if (success) {
        console.log('Weight saved to user data and onboarding completed:', {
          weight: weightData,
          isMetric
        });
        // Sonraki ekrana yönlendirme
        navigation.navigate('Insights');
      } else {
        throw new Error('User data güncellenemedi');
      }
      
    } catch (error: any) {
      console.error('WeightScreen: Error in handleContinue:', error);
      Alert.alert(
        t('common.error'),
        'Bir hata oluştu',
        [{ text: t('common.ok'), onPress: () => {} }]
      );
    }
  };

  const renderWeightItem = ({ item, index }: { item: WeightOption; index: number }) => (
    <View style={styles.optionItem}>
      <Text
        style={[
          styles.optionText,
          selectedWeight === index ? styles.selectedOptionText : styles.unselectedOptionText,
        ]}
      >
        {item.display}
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
            {t('weight.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('weight.subtitle')}
          </Text>
        </View>

        <View style={styles.unitSwitcher}>
          <Text style={[styles.unitText, !isMetric ? styles.unitTextActive : styles.unitTextInactive]}>
            IMPERIAL
          </Text>
          <Switch
            value={isMetric}
            onValueChange={setIsMetric}
            trackColor={{ false: colors.switchTrack, true: colors.primary }}
            thumbColor={colors.switchThumb}
            ios_backgroundColor={colors.switchTrack}
          />
          <Text style={[styles.unitText, isMetric ? styles.unitTextActive : styles.unitTextInactive]}>
            METRIC
          </Text>
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.selectionOverlay} />
          <FlatList
            ref={weightFlatListRef}
            data={currentWeights}
            renderItem={renderWeightItem}
            keyExtractor={(item, index) => `weight-${index}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            onScroll={handleWeightScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleWeightScroll}
            initialScrollIndex={initialWeightIndex}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
            contentContainerStyle={styles.scrollContent}
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('weight.continue_button')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WeightScreen;
