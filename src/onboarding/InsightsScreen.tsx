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
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

// Responsive boyutlar için yardımcı fonksiyonlar
const wp = (percentage: number, width: number) => {
  return width * (percentage / 100);
};

const hp = (percentage: number, height: number) => {
  return height * (percentage / 100);
};

type InsightsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Insights'
>;

const InsightsScreen = () => {
  const navigation = useNavigation<InsightsScreenNavigationProp>();
  const { t } = useI18n();
  const { width, height: screenHeight } = useWindowDimensions();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Responsive değerler
  const isTablet = width >= 768;
  const titleFontSize = isTablet ? 48 : (width < 380 ? 28 : 36);
  const subtitleFontSize = isTablet ? 18 : (width < 380 ? 14 : 16);
  const topPadding = screenHeight < 700 ? 10 : 20;
  
  // Chart dimensions
  const chartWidth = width - 64; // 32px padding each side
  const chartHeight = screenHeight < 700 ? 180 : 220;
  
  // Tema renkleri (bizim tasarım dili - light mode)
  const colors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7', // Bizim yeşil
    secondary: '#EF4444', // Red
    cardBg: '#F8F8F8',
    progressBg: '#E5E5E5',
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
    chartContainer: {
      backgroundColor: colors.cardBg,
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      width: '100%',
    },
    chartTitle: {
      fontSize: 18,
      fontFamily: 'System',
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 24,
    },
    svgContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    legendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      gap: 24,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    legendText: {
      fontSize: 14,
      fontFamily: 'System',
      color: colors.textSecondary,
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
    // Start animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    // Navigate to next screen
    navigation.navigate('Accuracy');
  };

  // Generate curve path for height growth chart
  const generateCurvePath = (points: number[][], color: string) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0][0]} ${points[0][1]}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Create smooth curve using quadratic bezier
      const midX = (prevPoint[0] + currentPoint[0]) / 2;
      const controlY = prevPoint[1];
      
      path += ` Q ${midX} ${controlY} ${currentPoint[0]} ${currentPoint[1]}`;
    }
    
    return path;
  };

  // Chart data points (simulated)
  const badHabitsPoints = [
    [20, chartHeight - 40],
    [chartWidth * 0.3, chartHeight - 60],
    [chartWidth * 0.6, chartHeight - 70],
    [chartWidth * 0.9, chartHeight - 80],
  ];

  const optimizedHabitsPoints = [
    [20, chartHeight - 40],
    [chartWidth * 0.3, chartHeight - 90],
    [chartWidth * 0.6, chartHeight - 130],
    [chartWidth * 0.9, chartHeight - 160],
  ];

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
            {t('insights.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('insights.subtitle')}
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            {t('insights.chart_title')}
          </Text>
          
          <View style={styles.svgContainer}>
            <Svg width={chartWidth} height={chartHeight}>
              <Defs>
                <LinearGradient id="primaryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
                  <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.2" />
                </LinearGradient>
                <LinearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0.8" />
                  <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0.2" />
                </LinearGradient>
              </Defs>
              
              {/* Bad habits curve */}
              <Path
                d={generateCurvePath(badHabitsPoints, colors.secondary)}
                stroke={colors.secondary}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Optimized habits curve */}
              <Path
                d={generateCurvePath(optimizedHabitsPoints, colors.primary)}
                stroke={colors.primary}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* End point circles */}
              <Circle
                cx={optimizedHabitsPoints[optimizedHabitsPoints.length - 1][0]}
                cy={optimizedHabitsPoints[optimizedHabitsPoints.length - 1][1]}
                r="6"
                fill={colors.primary}
              />
              
              <Circle
                cx={badHabitsPoints[badHabitsPoints.length - 1][0]}
                cy={badHabitsPoints[badHabitsPoints.length - 1][1]}
                r="6"
                fill={colors.secondary}
              />
              
              {/* Start point circle */}
              <Circle
                cx={20}
                cy={chartHeight - 40}
                r="6"
                fill={colors.primary}
              />
            </Svg>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
              <Text style={styles.legendText}>{t('insights.bad_habits')}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>{t('insights.optimized_habits')}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{t('insights.continue_button')}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default InsightsScreen;
