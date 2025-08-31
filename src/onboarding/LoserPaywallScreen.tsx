import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';
import { SvgXml } from 'react-native-svg';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive design helpers
const isTablet = SCREEN_WIDTH >= 768;
const isSmallScreen = SCREEN_WIDTH < 375;
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

// SVG Icons
const timerIcon = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/>
<polyline points="12,6 12,12 16,14" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const fireIcon = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 14.5C8.5 16.9853 10.5147 19 13 19C15.4853 19 17.5 16.9853 17.5 14.5C17.5 12.0147 15.4853 10 13 10C10.5147 10 8.5 12.0147 8.5 14.5Z" stroke="${color}" stroke-width="2"/>
<path d="M13 10C13 8.5 14 7 15.5 6.5C16.5 6 17 5 17 4C17 3 16 2 15 2C14 2 13 3 13 4V10Z" stroke="${color}" stroke-width="2"/>
</svg>
`;

const LoserPaywallScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  
  // State
  const [timeLeft, setTimeLeft] = useState(300); // 5 dakika
  
  // Animation refs
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    surface: '#F8F9FA',
    border: '#E0E0E0',
    buttonText: '#FFFFFF',
    error: '#FF6B6B',
  };

  useEffect(() => {
    startAnimations();
    startCountdown();
    // Storage'ı biraz geciktiriyoruz
    setTimeout(() => {
      markOnboardingCompleted();
    }, 100);
  }, []);

  const markOnboardingCompleted = async () => {
    try {
      await storage.set(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
      console.log('✅ Onboarding completed flag saved');
    } catch (error) {
      console.error('❌ Failed to save onboarding completion:', error);
    }
  };

  const startAnimations = () => {
    // Pulse animation for offer
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Shake animation for urgency
    const shake = () => {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start(() => {
        setTimeout(shake, 5000);
      });
    };
    setTimeout(shake, 2000);
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    // TabNavigator'a git
    (navigation as any).reset({
      index: 0,
      routes: [{ name: 'TabNavigator' }],
    });
  };

  const handleSubscribe = () => {
    // PaywallScreen'e geri git
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Text style={[styles.closeButtonText, { color: ourColors.text }]}>✕</Text>
      </TouchableOpacity>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Logo */}
        <Image 
          source={require('@assets/logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Urgency Timer */}
        <Animated.View style={[
          styles.urgencyContainer,
          { 
            backgroundColor: ourColors.primary + '15',
            borderColor: ourColors.primary,
            transform: [{ translateX: shakeAnimation }]
          }
        ]}>
          <SvgXml xml={timerIcon(ourColors.primary)} width={getResponsiveSize(20)} height={getResponsiveSize(20)} />
          <Text style={[styles.urgencyText, { color: ourColors.primary }]}>
            {t('loser_paywall.urgency_text')} {formatTime(timeLeft)}
          </Text>
        </Animated.View>

        {/* Main Title */}
        <Text style={[styles.title, { color: ourColors.text }]}>
          {t('loser_paywall.wait_title')}
        </Text>

        <Text style={[styles.subtitle, { color: ourColors.textSecondary }]}>
          {t('loser_paywall.wait_subtitle')}
        </Text>

        {/* Special Offer Card */}
        <Animated.View style={[
          styles.offerCard,
          { 
            backgroundColor: ourColors.surface,
            borderColor: ourColors.primary,
            transform: [{ scale: pulseAnimation }]
          }
        ]}>
          <View style={[styles.discountBadge, { backgroundColor: ourColors.primary }]}>
            <SvgXml xml={fireIcon(ourColors.buttonText)} width={getResponsiveSize(16)} height={getResponsiveSize(16)} />
            <Text style={[styles.discountText, { color: ourColors.buttonText }]}>
              {t('loser_paywall.special_offer')}
            </Text>
          </View>

          <Text style={[styles.offerTitle, { color: ourColors.text }]}>
            {t('loser_paywall.offer_title')}
          </Text>

          <Text style={[styles.productType, { color: ourColors.primary }]}>
            {t('loser_paywall.yearly')}
          </Text>

          <Text style={[styles.productPrice, { color: ourColors.text }]}>
            ₺199,99
          </Text>

          <Text style={[styles.offerDescription, { color: ourColors.textSecondary }]}>
            {t('loser_paywall.offer_description')}
          </Text>
        </Animated.View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={[styles.sectionTitle, { color: ourColors.text }]}>
            {t('loser_paywall.benefits_title')}
          </Text>
          
          {[
            t('loser_paywall.benefit_1'),
            t('loser_paywall.benefit_2'),
            t('loser_paywall.benefit_3'),
            t('loser_paywall.benefit_4'),
          ].map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={[styles.checkIcon, { backgroundColor: ourColors.primary }]}>
                <Text style={[styles.checkMark, { color: ourColors.buttonText }]}>✓</Text>
              </View>
              <Text style={[styles.benefitText, { color: ourColors.text }]}>
                {benefit}
              </Text>
            </View>
          ))}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: ourColors.primary }]}
          onPress={handleSubscribe}
        >
          <Text style={[styles.subscribeButtonText, { color: ourColors.buttonText }]}>
            {t('loser_paywall.cta_button')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: getResponsivePadding(50),
    right: getResponsivePadding(20),
    zIndex: 1000,
    width: getResponsiveSize(32),
    height: getResponsiveSize(32),
    borderRadius: getResponsiveSize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: getResponsiveSize(20),
    fontWeight: '600',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: getResponsivePadding(20),
    paddingTop: getResponsivePadding(100),
    paddingBottom: getResponsivePadding(40),
  },
  logoImage: {
    width: getResponsiveSize(60),
    height: getResponsiveSize(60),
    alignSelf: 'center',
    marginBottom: getResponsivePadding(30),
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getResponsivePadding(12),
    paddingHorizontal: getResponsivePadding(20),
    borderRadius: getResponsiveSize(25),
    borderWidth: 2,
    marginBottom: getResponsivePadding(30),
  },
  urgencyText: {
    fontSize: getResponsiveSize(16),
    fontWeight: '700',
    fontFamily: 'System',
    marginLeft: getResponsivePadding(8),
  },
  title: {
    fontSize: getResponsiveSize(28),
    fontWeight: '800',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(16),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: getResponsiveSize(16),
    fontWeight: '500',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(40),
    lineHeight: getResponsiveSize(22),
  },
  offerCard: {
    borderRadius: getResponsiveSize(20),
    borderWidth: 2,
    padding: getResponsivePadding(24),
    marginBottom: getResponsivePadding(40),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsivePadding(16),
    paddingVertical: getResponsivePadding(8),
    borderRadius: getResponsiveSize(20),
    marginBottom: getResponsivePadding(16),
  },
  discountText: {
    fontSize: getResponsiveSize(14),
    fontWeight: '700',
    fontFamily: 'System',
    marginLeft: getResponsivePadding(6),
  },
  offerTitle: {
    fontSize: getResponsiveSize(24),
    fontWeight: '700',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(16),
  },
  productType: {
    fontSize: getResponsiveSize(16),
    fontWeight: '600',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(8),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productPrice: {
    fontSize: getResponsiveSize(32),
    fontWeight: '800',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(16),
  },
  offerDescription: {
    fontSize: getResponsiveSize(14),
    fontWeight: '400',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: getResponsiveSize(20),
  },
  benefitsSection: {
    marginBottom: getResponsivePadding(40),
  },
  sectionTitle: {
    fontSize: getResponsiveSize(20),
    fontWeight: '700',
    fontFamily: 'System',
    marginBottom: getResponsivePadding(20),
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsivePadding(16),
  },
  checkIcon: {
    width: getResponsiveSize(24),
    height: getResponsiveSize(24),
    borderRadius: getResponsiveSize(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: getResponsivePadding(12),
  },
  checkMark: {
    fontSize: getResponsiveSize(14),
    fontWeight: '700',
    fontFamily: 'System',
  },
  benefitText: {
    fontSize: getResponsiveSize(16),
    fontWeight: '500',
    fontFamily: 'System',
    flex: 1,
    lineHeight: getResponsiveSize(22),
  },
  subscribeButton: {
    paddingVertical: getResponsivePadding(18),
    paddingHorizontal: getResponsivePadding(32),
    borderRadius: getResponsiveSize(25),
    marginBottom: getResponsivePadding(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscribeButtonText: {
    fontSize: getResponsiveSize(18),
    fontWeight: '700',
    fontFamily: 'System',
    textAlign: 'center',
  },

});

export default LoserPaywallScreen;
