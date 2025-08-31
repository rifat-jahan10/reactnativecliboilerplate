import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';
import { SvgXml } from 'react-native-svg';

const ComparisonScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();

  // Animation refs
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;

  // Responsive design
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;

  const getResponsiveSize = (size: number) => {
    if (isTablet) return size * 1.3;
    if (isSmallScreen) return size * 0.9;
    return size;
  };

  const getResponsivePadding = (padding: number) => {
    if (isTablet) return padding * 1.5;
    if (isSmallScreen) return padding * 0.8;
    return padding;
  };

  // Colors
  const ourColors = {
    background: '#FFFFFF',
    text: '#1C1C1E',
    textSecondary: '#8E8E93',
    primary: '#1EB7A7',
    primaryLight: '#F0FDFC',
    primaryDark: '#0F766E',
    surface: '#FFFFFF',
    cardShadow: '#000000',
    grayIcon: '#D1D1D6',
    grayLight: '#F2F2F7',
    borderColor: '#E5E5EA',
  };

  // Modern SVG Icons
  const crossIconSvg = (color: string) => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="none"/>
      <path d="M8 8l8 8M16 8l-8 8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const checkIconSvg = (color: string) => `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="none"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  const sparkleIconSvg = (color: string) => `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1L12.09 6.26L18 7L12.09 7.74L10 13L7.91 7.74L2 7L7.91 6.26L10 1Z" fill="${color}"/>
    </svg>
  `;

  // Data
  const comparisonData = [
    {
      id: 1,
      without: t('comparison.without_1'),
      with: t('comparison.with_1'),
    },
    {
      id: 2,
      without: t('comparison.without_2'),
      with: t('comparison.with_2'),
    },
    {
      id: 3,
      without: t('comparison.without_3'),
      with: t('comparison.with_3'),
    },
    {
      id: 4,
      without: t('comparison.without_4'),
      with: t('comparison.with_4'),
    },
  ];

  const navigateToPromise = () => {
    (navigation as any).navigate('PromiseScreen');
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(slideAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnimation, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const slideTranslateY = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  const buttonScale = buttonAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ourColors.background,
    },
    content: {
      flex: 1,
      paddingTop: getResponsivePadding(50),
    },
    headerContainer: {
      paddingHorizontal: getResponsivePadding(24),
      marginBottom: getResponsivePadding(32),
      alignItems: 'center',
    },
    title: {
      fontSize: getResponsiveSize(30),
      fontFamily: 'System',
      fontWeight: '800',
      textAlign: 'center',
      color: ourColors.text,
      marginBottom: getResponsivePadding(8),
      letterSpacing: -0.8,
      lineHeight: getResponsiveSize(36),
    },
    subtitle: {
      fontSize: getResponsiveSize(17),
      fontFamily: 'System',
      fontWeight: '500',
      textAlign: 'center',
      color: ourColors.textSecondary,
      lineHeight: getResponsiveSize(24),
    },
    cardsContainer: {
      flexDirection: 'row',
      paddingHorizontal: getResponsivePadding(16),
      marginBottom: getResponsivePadding(40),
      gap: getResponsivePadding(14),
    },
    leftCard: {
      flex: 1,
      backgroundColor: ourColors.grayLight,
      borderRadius: getResponsiveSize(28),
      padding: getResponsivePadding(24),
      borderWidth: 1,
      borderColor: ourColors.borderColor,
    },
    rightCard: {
      flex: 1,
      backgroundColor: ourColors.primaryLight,
      borderRadius: getResponsiveSize(28),
      padding: getResponsivePadding(24),
      borderWidth: 2,
      borderColor: ourColors.primary,
      shadowColor: ourColors.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
      position: 'relative',
    },
    cardHeader: {
      alignItems: 'center',
      marginBottom: getResponsivePadding(24),
      paddingBottom: getResponsivePadding(16),
    },
    leftCardHeader: {
      borderBottomWidth: 1,
      borderBottomColor: ourColors.borderColor,
    },
    rightCardHeader: {
      borderBottomWidth: 1,
      borderBottomColor: ourColors.primary + '50',
    },
    cardTitle: {
      fontSize: getResponsiveSize(16),
      fontFamily: 'System',
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    leftCardTitle: {
      color: ourColors.textSecondary,
    },
    rightCardTitle: {
      color: ourColors.primary,
    },
    comparisonItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: getResponsivePadding(22),
      paddingVertical: getResponsivePadding(6),
    },
    iconContainer: {
      marginRight: getResponsivePadding(14),
      marginTop: getResponsivePadding(2),
    },
    itemText: {
      flex: 1,
      fontSize: getResponsiveSize(14),
      fontFamily: 'System',
      lineHeight: getResponsiveSize(21),
    },
    leftItemText: {
      color: ourColors.textSecondary,
      fontWeight: '500',
    },
    rightItemText: {
      color: ourColors.text,
      fontWeight: '600',
    },
    decorativeContainer: {
      position: 'absolute',
      top: getResponsivePadding(12),
      right: getResponsivePadding(12),
      flexDirection: 'row',
      alignItems: 'center',
      gap: getResponsivePadding(4),
    },
    buttonContainer: {
      paddingHorizontal: getResponsivePadding(20),
      paddingBottom: getResponsivePadding(50),
    },
    continueButton: {
      backgroundColor: ourColors.primary,
      paddingVertical: getResponsivePadding(18),
      borderRadius: getResponsiveSize(28),
      alignItems: 'center',
      shadowColor: ourColors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    continueButtonText: {
      fontSize: getResponsiveSize(18),
      fontFamily: 'System',
      fontWeight: '700',
      color: ourColors.surface,
      letterSpacing: 0.2,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {t('comparison.title')}
          </Text>
          <Text style={styles.subtitle}>
            {t('comparison.subtitle')}
          </Text>
        </View>

        {/* Cards Container */}
        <Animated.View 
          style={[
            styles.cardsContainer,
            {
              opacity: slideAnimation,
              transform: [{ translateY: slideTranslateY }]
            }
          ]}
        >
          {/* Left Card - Without App */}
          <View style={styles.leftCard}>
            <View style={[styles.cardHeader, styles.leftCardHeader]}>
              <Text style={[styles.cardTitle, styles.leftCardTitle]}>
                {t('comparison.without_app')}
              </Text>
            </View>
            
            {comparisonData.map((item) => (
              <View key={`left-${item.id}`} style={styles.comparisonItem}>
                <View style={styles.iconContainer}>
                  <SvgXml xml={crossIconSvg(ourColors.grayIcon)} width={22} height={22} />
                </View>
                <Text style={[styles.itemText, styles.leftItemText]}>
                  {item.without}
                </Text>
              </View>
            ))}
          </View>

          {/* Right Card - With App */}
          <View style={styles.rightCard}>
            <View style={[styles.cardHeader, styles.rightCardHeader]}>
              <Text style={[styles.cardTitle, styles.rightCardTitle]}>
                {t('comparison.with_app')}
              </Text>
            </View>
            
            {comparisonData.map((item) => (
              <View key={`right-${item.id}`} style={styles.comparisonItem}>
                <View style={styles.iconContainer}>
                  <SvgXml xml={checkIconSvg(ourColors.primary)} width={22} height={22} />
                </View>
                <Text style={[styles.itemText, styles.rightItemText]}>
                  {item.with}
                </Text>
              </View>
            ))}

            {/* Decorative Elements */}
            <View style={styles.decorativeContainer}>
              <SvgXml xml={sparkleIconSvg('#FFD700')} width={16} height={16} />
              <SvgXml xml={sparkleIconSvg(ourColors.primary)} width={14} height={14} />
            </View>
          </View>
        </Animated.View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Animated.View
            style={{
              transform: [{ scale: buttonScale }],
              opacity: buttonAnimation,
            }}
          >
            <TouchableOpacity
              style={styles.continueButton}
              onPress={navigateToPromise}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>
                {t('comparison.continue_button')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ComparisonScreen;