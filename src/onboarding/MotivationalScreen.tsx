import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';
import LottieView from 'lottie-react-native';

const MotivationalLoadingScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();
  
  const [currentText, setCurrentText] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const circularProgressAnimation = useRef(new Animated.Value(0)).current;
  
  // Step animations
  const step1Animation = useRef(new Animated.Value(0)).current;
  const step2Animation = useRef(new Animated.Value(0)).current;
  const step3Animation = useRef(new Animated.Value(0)).current;
  const step4Animation = useRef(new Animated.Value(0)).current;

  // Responsive değerler
  const isTablet = width >= 768;
  const titleFontSize = isTablet ? 32 : (width < 380 ? 24 : 28);
  const subtitleFontSize = isTablet ? 18 : (width < 380 ? 14 : 16);

  const motivationalTexts = [
    t('motivational.analyzing_your_profile'),
    t('motivational.creating_perfect_plan'),
    t('motivational.selecting_best_exercises'),
    t('motivational.calculating_nutrition'),
    t('motivational.almost_ready'),
  ];

  // Bizim tasarım dili colors override
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    card: '#F8F9FA',
    cardBorder: '#E0E0E0',
    button: '#1EB7A7',
    buttonText: '#FFFFFF',
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ourColors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circularProgressContainer: {
      marginBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circularProgressBackground: {
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 8,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    circularProgressFill: {
      position: 'absolute',
      width: 160,
      height: 160,
      borderRadius: 80,
      borderWidth: 8,
      borderColor: 'transparent',
      borderTopColor: 'transparent',
      transform: [{ rotate: '-90deg' }],
    },
    circularProgressInner: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 5,
    },
    circularProgressText: {
      fontSize: 32,
      fontWeight: '900',
      fontFamily: 'System',
    },
    motivationalContainer: {
      alignItems: 'center',
      marginBottom: height * 0.08,
    },
    title: {
      fontSize: titleFontSize,
      fontFamily: 'System',
      fontWeight: '800',
      textAlign: 'center',
      color: ourColors.text,
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: subtitleFontSize,
      fontFamily: 'System',
      textAlign: 'center',
      color: ourColors.primary,
      lineHeight: subtitleFontSize * 1.4,
      fontWeight: '600',
    },

    mainTitle: {
      fontSize: 28,
      fontWeight: '700',
      fontFamily: 'System',
      textAlign: 'center',
      marginBottom: 32,
      letterSpacing: -0.5,
    },
    analysisContainer: {
      width: '100%',
      marginBottom: 32,
    },
    analysisStep: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      paddingHorizontal: 4,
    },
    stepIcon: {
      width: 28,
      height: 28,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 2,
    },
    checkMark: {
      fontSize: 16,
      fontWeight: '900',
      fontFamily: 'System',
    },
    emptyCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
    },
    stepText: {
      fontSize: 16,
      fontFamily: 'System',
      flex: 1,
      lineHeight: 22,
    },

    // AI Planning Styles
    aiPlanningSection: {
      width: '100%',
      alignItems: 'center',
      marginTop: 32,
      paddingHorizontal: 16,
    },
    aiIconContainer: {
      width: 110,
      height: 110,
      borderRadius: 55,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    aiIcon: {
      fontSize: 28,
    },
    aiPlanningTitle: {
      fontSize: 18,
      fontWeight: '600',
      fontFamily: 'System',
      textAlign: 'center',
      opacity: 0.8,
    },
  });



  const navigateToComparison = () => {
    // ComparisonScreen'e git
    (navigation as any).navigate('ComparisonScreen');
  };

  useEffect(() => {

    let textIndex = 0;
    setCurrentText(motivationalTexts[0]);

    // Circular progress animasyonu - native driver ile
    Animated.timing(circularProgressAnimation, {
      toValue: 1,
      duration: 5500,
      useNativeDriver: true, // Native driver kullan
    }).start();

    // Progress animasyonu - native driver kullan
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: 5500,
      useNativeDriver: false, // Progress bar için false gerekli
    }).start(() => {
      navigateToComparison();
    });

    // Progress percentage güncelleme - throttle ile optimize et
    let lastUpdate = 0;
    const progressListener = progressAnimation.addListener(({ value }) => {
      const now = Date.now();
      if (now - lastUpdate > 50) { // 50ms throttle - daha az güncelleme
        setProgressPercentage(Math.round(value * 100));
        lastUpdate = now;
      }
    });

    // Text değişimi - daha az sıklıkta
    const textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % motivationalTexts.length;
      setCurrentText(motivationalTexts[textIndex]);
    }, 1200); // 800ms'den 1200ms'ye çıkardık

    return () => {
      progressAnimation.removeListener(progressListener);
      clearInterval(textInterval);
    };
  }, []);

  // Step animations based on progress
  useEffect(() => {
    const animateStep = (animation: Animated.Value, threshold: number) => {
      if (progressPercentage >= threshold) {
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    };

    animateStep(step1Animation, 25);
    animateStep(step2Animation, 50);
    animateStep(step3Animation, 75);
    animateStep(step4Animation, 100);
  }, [progressPercentage]);

  // Circular progress rotation
  const circularRotation = circularProgressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '180deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Circular Progress */}
        <View style={styles.circularProgressContainer}>
          <View style={[styles.circularProgressBackground, { borderColor: ourColors.cardBorder }]}>
            <Animated.View 
              style={[
                styles.circularProgressFill, 
                { 
                  borderTopColor: ourColors.primary,
                  transform: [{ rotate: circularRotation }] 
                }
              ]} 
            />
            <View style={[styles.circularProgressInner, { backgroundColor: ourColors.background }]}>
              <Text style={[styles.circularProgressText, { color: ourColors.primary }]}>
                {progressPercentage}%
              </Text>
            </View>
          </View>
        </View>

        {/* Main Title */}
        <Text style={[styles.mainTitle, { color: ourColors.text }]}>
          {t('motivational.personalizing_plan')}
        </Text>

        {/* Analysis Steps */}
        <View style={styles.analysisContainer}>
          {/* Step 1 - Analyzing answers */}
          <View style={styles.analysisStep}>
            <Animated.View style={[
              styles.stepIcon, 
              { 
                backgroundColor: progressPercentage >= 25 ? ourColors.primary : ourColors.cardBorder,
                borderColor: progressPercentage >= 25 ? ourColors.primary : ourColors.cardBorder,
                transform: [{ scale: step1Animation }]
              }
            ]}>
              {progressPercentage >= 25 ? (
                <Animated.Text style={[
                  styles.checkMark, 
                  { 
                    color: ourColors.background,
                    transform: [{ scale: step1Animation }]
                  }
                ]}>✓</Animated.Text>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: ourColors.cardBorder }]} />
              )}
            </Animated.View>
            <Text style={[
              styles.stepText, 
              { 
                color: progressPercentage >= 25 ? ourColors.text : ourColors.textSecondary,
                fontWeight: progressPercentage >= 25 ? '600' : '400'
              }
            ]}>
              {t('motivational.analyzing_answers')}
            </Text>
          </View>

          {/* Step 2 - Defining requirements */}
          <View style={styles.analysisStep}>
            <Animated.View style={[
              styles.stepIcon, 
              { 
                backgroundColor: progressPercentage >= 50 ? ourColors.primary : ourColors.cardBorder,
                borderColor: progressPercentage >= 50 ? ourColors.primary : ourColors.cardBorder,
                transform: [{ scale: step2Animation }]
              }
            ]}>
              {progressPercentage >= 50 ? (
                <Animated.Text style={[
                  styles.checkMark, 
                  { 
                    color: ourColors.background,
                    transform: [{ scale: step2Animation }]
                  }
                ]}>✓</Animated.Text>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: ourColors.cardBorder }]} />
              )}
            </Animated.View>
            <Text style={[
              styles.stepText, 
              { 
                color: progressPercentage >= 50 ? ourColors.text : ourColors.textSecondary,
                fontWeight: progressPercentage >= 50 ? '600' : '400'
              }
            ]}>
              {t('motivational.defining_requirements')}
            </Text>
          </View>

          {/* Step 3 - Weight progress */}
          <View style={styles.analysisStep}>
            <Animated.View style={[
              styles.stepIcon, 
              { 
                backgroundColor: progressPercentage >= 75 ? ourColors.primary : ourColors.cardBorder,
                borderColor: progressPercentage >= 75 ? ourColors.primary : ourColors.cardBorder,
                transform: [{ scale: step3Animation }]
              }
            ]}>
              {progressPercentage >= 75 ? (
                <Animated.Text style={[
                  styles.checkMark, 
                  { 
                    color: ourColors.background,
                    transform: [{ scale: step3Animation }]
                  }
                ]}>✓</Animated.Text>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: ourColors.cardBorder }]} />
              )}
            </Animated.View>
            <Text style={[
              styles.stepText, 
              { 
                color: progressPercentage >= 75 ? ourColors.text : ourColors.textSecondary,
                fontWeight: progressPercentage >= 75 ? '600' : '400'
              }
            ]}>
              {t('motivational.estimating_progress')}
            </Text>
          </View>

          {/* Step 4 - Final adjustments */}
          <View style={styles.analysisStep}>
            <Animated.View style={[
              styles.stepIcon, 
              { 
                backgroundColor: progressPercentage >= 100 ? ourColors.primary : ourColors.cardBorder,
                borderColor: progressPercentage >= 100 ? ourColors.primary : ourColors.cardBorder,
                transform: [{ scale: step4Animation }]
              }
            ]}>
              {progressPercentage >= 100 ? (
                <Animated.Text style={[
                  styles.checkMark, 
                  { 
                    color: ourColors.background,
                    transform: [{ scale: step4Animation }]
                  }
                ]}>✓</Animated.Text>
              ) : (
                <View style={[styles.emptyCircle, { borderColor: ourColors.cardBorder }]} />
              )}
            </Animated.View>
            <Text style={[
              styles.stepText, 
              { 
                color: progressPercentage >= 100 ? ourColors.text : ourColors.textSecondary,
                fontWeight: progressPercentage >= 100 ? '600' : '400'
              }
            ]}>
              {t('motivational.adjusting_nutrition')}
            </Text>
          </View>
        </View>

        {/* AI Planning Section */}
        <View style={styles.aiPlanningSection}>
          <View style={[styles.aiIconContainer, { backgroundColor: ourColors.primary + '15' }]}>
            <LottieView
              source={require('@assets/lottie/load.json')}
              autoPlay
              loop
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
              renderMode="HARDWARE" // Hardware acceleration için
              cacheComposition={true} // Cache için
              speed={0.8} // Biraz daha yavaş - daha smooth
            />
          </View>
          <Text style={[styles.aiPlanningTitle, { color: ourColors.text }]}>
            {t('motivational.ai_planning')}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MotivationalLoadingScreen;
