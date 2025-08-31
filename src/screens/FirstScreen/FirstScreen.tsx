import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import Svg, { Path, Circle } from 'react-native-svg';
import { useI18n } from '@hooks/useI18n';
import LottieView from 'lottie-react-native';

// Responsive boyutlar için yardımcı fonksiyonlar
const { width, height } = Dimensions.get('window');
const wp = (percentage: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number) => {
  return height * (percentage / 100);
};

type FirstScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'First'
>;

// İleri ok ikonu
const ArrowRightIcon = () => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path d="M12 4L20 12L12 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
};

const FirstScreen: React.FC = () => {
  const navigation = useNavigation<FirstScreenNavigationProp>();
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  
  // Onboarding adımları
  const steps = [
    {
      id: 0,
      title: t('onboarding.many_recipes'),
      description: t('onboarding.recipes_description'),
      lottie: require('@assets/lottie/1.json'),
    },
    {
      id: 1,
      title: t('onboarding.personal_recommendations'),
      description: t('onboarding.recommendations_description'),
      lottie: require('@assets/lottie/2.json'),
    },
    {
      id: 2,
      title: t('onboarding.be_chef'),
      description: t('onboarding.app_description'),
      lottie: require('@assets/lottie/3.json'),
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Sonraki sayfaya kaydır
      flatListRef.current?.scrollToIndex({
        index: currentStep + 1,
        animated: true
      });
      setCurrentStep(currentStep + 1);
    } else {
      // Onboarding tamamlandı, SecondScreen'e git
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    navigation.navigate('NameScreen');
  };

  const renderStep = ({ item, index }: { item: any, index: number }) => {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.iconContainer}>
          <LottieView
            source={item.lottie}
            autoPlay
            loop
            style={styles.lottieStyle}
          />
        </View>
        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepDescription}>{item.description}</Text>
      </View>
    );
  };

  const onScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    
    if (newIndex !== currentStep) {
      setCurrentStep(newIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.contentContainer}>
        <FlatList
          ref={flatListRef}
          data={steps}
          renderItem={renderStep}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          scrollEventThrottle={16}
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
        
        <View style={styles.paginationContainer}>
          {steps.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.paginationDot, 
                currentStep === index && styles.activeDot
              ]} 
            />
          ))}
        </View>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: hp(8),
    paddingBottom: hp(2),
  },
  stepContainer: {
    width: width,
    alignItems: 'center',
    paddingVertical: hp(4),
    paddingHorizontal: wp(5),
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: 'rgba(30, 183, 167, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(6),
  },
  lottieStyle: {
    width: wp(50),
    height: wp(50),
  },
  stepTitle: {
    fontSize: Math.min(28, wp(7)),
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
  stepDescription: {
    fontSize: Math.min(17, wp(4.2)),
    color: '#666666',
    textAlign: 'center',
    marginHorizontal: wp(5),
    lineHeight: Math.min(24, hp(3)),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingVertical: hp(3),
  },
  skipButton: {
    padding: wp(2),
  },
  skipButtonText: {
    color: '#666666',
    fontSize: wp(4),
  },
  paginationContainer: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#1EB7A7',
    width: 24,
  },
  nextButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1EB7A7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FirstScreen;


