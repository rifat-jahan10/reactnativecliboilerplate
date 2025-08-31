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

type HeightScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Height'
>;

interface HeightOption {
  feet: number;
  inches: number;
  cm: number;
  display: string;
}

const HeightScreen = () => {
  const navigation = useNavigation<HeightScreenNavigationProp>();
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
  const [selectedHeight, setSelectedHeight] = useState(0);
  
  const heightFlatListRef = useRef<FlatList>(null);
  const itemHeight = 50;

  // Height options (Imperial: feet + inches, Metric: cm)
  const imperialHeights: HeightOption[] = [];
  for (let feet = 3; feet <= 8; feet++) {
    for (let inches = 0; inches <= 11; inches++) {
      const totalInches = feet * 12 + inches;
      const cm = Math.round(totalInches * 2.54);
      imperialHeights.push({
        feet,
        inches,
        cm,
        display: `${feet} ft ${inches} in`
      });
    }
  }

  const metricHeights: HeightOption[] = [];
  for (let cm = 100; cm <= 250; cm++) {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    metricHeights.push({
      feet,
      inches,
      cm,
      display: `${cm} cm`
    });
  }

  const currentHeights = isMetric ? metricHeights : imperialHeights;

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
    infoText: {
      fontSize: 14,
      fontFamily: 'System',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 20,
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
  const initialHeightIndex = Math.floor(currentHeights.length * 0.4); // ~5'6" / 170cm

  useEffect(() => {
    setSelectedHeight(initialHeightIndex);
  }, [isMetric]);

  const handleHeightScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    if (currentHeights[index]) {
      setSelectedHeight(index);
    }
  };



  const handleContinue = async () => {
    try {
      const heightData = currentHeights[selectedHeight];
      
      // Boy seçimini user data'ya kaydet
      const success = await updateUser({
        height: {
          cm: heightData.cm,
          feet: heightData.feet,
          inches: heightData.inches,
          isMetric: isMetric
        },
        onboardingStep: 'height_completed'
      });

      if (success) {
        console.log('Height saved to user data:', {
          height: heightData,
          isMetric
        });
        // Weight ekranına yönlendirme
        navigation.navigate('Weight');
      } else {
        throw new Error('User data güncellenemedi');
      }
      
    } catch (error: any) {
      console.error('HeightScreen: Error in handleContinue:', error);
      Alert.alert(
        t('common.error'),
        'Bir hata oluştu',
        [{ text: t('common.ok'), onPress: () => {} }]
      );
    }
  };

  const renderHeightItem = ({ item, index }: { item: HeightOption; index: number }) => (
    <View style={styles.optionItem}>
      <Text
        style={[
          styles.optionText,
          selectedHeight === index ? styles.selectedOptionText : styles.unselectedOptionText,
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
            {t('height.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('height.subtitle')}
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
            ref={heightFlatListRef}
            data={currentHeights}
            renderItem={renderHeightItem}
            keyExtractor={(item, index) => `height-${index}`}
            showsVerticalScrollIndicator={false}
            snapToInterval={itemHeight}
            decelerationRate="fast"
            onScroll={handleHeightScroll}
            scrollEventThrottle={16}
            onMomentumScrollEnd={handleHeightScroll}
            initialScrollIndex={initialHeightIndex}
            getItemLayout={(data, index) => ({
              length: itemHeight,
              offset: itemHeight * index,
              index,
            })}
            contentContainerStyle={styles.scrollContent}
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('height.continue_button')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HeightScreen;
