import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/RootNavigator';
import { useI18n } from '@hooks/useI18n';

// Responsive boyutlar için yardımcı fonksiyonlar
const wp = (percentage: number, width: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number, height: number) => {
  return height * (percentage / 100);
};

type AccuracyScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Accuracy'
>;

const AccuracyScreen = () => {
  const navigation = useNavigation<AccuracyScreenNavigationProp>();
  const { t } = useI18n();
  const { width, height: screenHeight } = useWindowDimensions();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;
  const arrowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  
  // State for displaying animated number
  const [displayNumber, setDisplayNumber] = React.useState(0);
  
  // Responsive değerler
  const isTablet = width >= 768;
  const titleFontSize = isTablet ? 48 : (width < 380 ? 28 : 36);
  const subtitleFontSize = isTablet ? 18 : (width < 380 ? 14 : 16);
  const percentageFontSize = isTablet ? 140 : (width < 380 ? 100 : 120);
  const topPadding = screenHeight < 700 ? 10 : 20;
  
  // Tema renkleri (bizim tasarım dili - light mode)
  const colors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    accuracyText: '#999999',
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
      paddingBottom: screenHeight < 700 ? 80 : 100,
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      paddingTop: topPadding,
      marginBottom: screenHeight < 700 ? 40 : 60,
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
    percentageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: screenHeight < 700 ? 40 : 60,
    },
    percentageText: {
      fontSize: percentageFontSize,
      fontFamily: 'System',
      fontWeight: '900',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 24,
      letterSpacing: -4,
      textShadowColor: 'rgba(0, 0, 0, 0.1)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    accuracyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    accuracyArrow: {
      width: 32,
      height: 32,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    accuracyText: {
      fontSize: 16,
      fontFamily: 'System',
      fontWeight: '600',
      color: colors.accuracyText,
      letterSpacing: 0.5,
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
      color: '#FFFFFF',
      fontSize: width < 380 ? 16 : 18,
      fontFamily: 'System',
      fontWeight: '600',
    },
  });

  useEffect(() => {
    // Start all animations immediately and in parallel
    
    // Fade in content immediately
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Scale in the percentage with spring
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    // Start number animation after a short delay (more natural)
    const numberTimeout = setTimeout(() => {
      Animated.timing(numberAnim, {
        toValue: 98.5,
        duration: 1800, // Faster counting
        useNativeDriver: false,
      }).start();
    }, 200); // Shorter delay
    
    // Show arrow with bounce after number starts
    const arrowTimeout = setTimeout(() => {
      Animated.spring(arrowAnim, {
        toValue: 1,
        tension: 120,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }, 1200);
    
    // Listen to number animation value changes
    const listenerId = numberAnim.addListener(({ value }) => {
      setDisplayNumber(Math.round(value * 10) / 10); // Round to 1 decimal place
    });
    
    return () => {
      clearTimeout(numberTimeout);
      clearTimeout(arrowTimeout);
      numberAnim.removeListener(listenerId);
    };
  }, []);

  const handleContinue = () => {
    // Navigate to MotivationalScreen
    navigation.navigate('MotivationalScreen' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{'←'}</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {t('accuracy.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('accuracy.subtitle')}
          </Text>
        </View>

        <Animated.View 
          style={[
            styles.percentageContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.percentageText}>
            {displayNumber}%
          </Text>

          <Animated.View 
            style={[
              styles.accuracyContainer,
              {
                opacity: arrowAnim,
                transform: [
                  {
                    translateY: arrowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.accuracyArrow}>
              <Text style={{ fontSize: 20, color: colors.primary, fontWeight: '700' }}>↗</Text>
            </View>
            <Text style={styles.accuracyText}>
              {t('accuracy.accuracy_label')}
            </Text>
          </Animated.View>
        </Animated.View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('accuracy.continue_button')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AccuracyScreen;
