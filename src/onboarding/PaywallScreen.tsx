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
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';
import { SvgXml } from 'react-native-svg';

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
const analyticsIconSvg = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 3V21H21" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 9L12 6L16 10L20 6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="7" y="13" width="2" height="6" fill="${color}"/>
<rect x="11" y="11" width="2" height="8" fill="${color}"/>
<rect x="15" y="15" width="2" height="4" fill="${color}"/>
</svg>
`;

const unlimitedIconSvg = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="${color}" stroke-width="2"/>
<path d="M8 12L11 15L16 9" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const heartIconSvg = (color: string) => `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const starSvg = (color: string) => `
<svg height="24px" viewBox="0 0 24 24" width="24px" fill="${color}">
<path d="M0 0h24v24H0V0z" fill="none"/>
<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z"/>
</svg>
`;

const getSvgIcon = (type: string, color: string) => {
  switch (type) {
    case 'analytics': return analyticsIconSvg(color);
    case 'unlimited': return unlimitedIconSvg(color);
    case 'heart': return heartIconSvg(color);
    case 'star': return starSvg(color);
    default: return starSvg(color);
  }
};

interface SlideData {
  id: number;
  title: string;
  description: string;
  icon: string;
  isAIScore?: boolean;
}

const PaywallScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState('3_monthly');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  const sliderRef = useRef<ScrollView>(null);
  const buzzAnimation = useRef(new Animated.Value(1)).current;

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

  // Slider verileri
  const slides: SlideData[] = [
    {
      id: 1,
      title: t('paywall.slide_1_title'),
      description: t('paywall.slide_1_description'),
      icon: 'score',
      isAIScore: true
    },
    {
      id: 2,
      title: t('paywall.slide_2_title'),
      description: t('paywall.slide_2_description'),
      icon: 'analytics'
    },
    {
      id: 3,
      title: t('paywall.slide_3_title'),
      description: t('paywall.slide_3_description'),
      icon: 'unlimited'
    },
    {
      id: 4,
      title: t('paywall.slide_4_title'),
      description: t('paywall.slide_4_description'),
      icon: 'heart'
    }
  ];

  // Mock products data
  const products = [
    {
      id: 'monthly',
      title: t('paywall.plan_monthly'),
      price: '₺49,99',
      period: t('paywall.period_monthly'),
      description: t('paywall.plan_monthly_desc')
    },
    {
      id: '3_monthly',
      title: t('paywall.plan_3_month'),
      price: '₺99,99', 
      period: t('paywall.period_3_month'),
      description: t('paywall.plan_3_month_desc'),
      isBestChoice: true
    },
    {
      id: 'yearly',
      title: t('paywall.plan_yearly'),
      price: '₺199,99',
      period: t('paywall.period_yearly'),
      description: t('paywall.plan_yearly_desc')
    }
  ];

  // Auto slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        sliderRef.current?.scrollTo({ 
          x: nextSlide * SCREEN_WIDTH,
          y: 0, 
          animated: true 
        });
        return nextSlide;
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Buzz animation for AI Score
  useEffect(() => {
    const startBuzzAnimation = () => {
      Animated.sequence([
        Animated.timing(buzzAnimation, {
          toValue: 1.1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(buzzAnimation, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buzzAnimation, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buzzAnimation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(startBuzzAnimation, 2000);
      });
    };

    setTimeout(startBuzzAnimation, 1000);
  }, [buzzAnimation]);

  const onSlideChange = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const slideIndex = Math.round(contentOffset.x / SCREEN_WIDTH);
    if (slideIndex >= 0 && slideIndex < slides.length) {
      setCurrentSlide(slideIndex);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    sliderRef.current?.scrollTo({ 
      x: index * SCREEN_WIDTH, 
      y: 0,
      animated: true 
    });
  };

  const handleSubscribe = () => {
    // Basit navigation - ana sayfaya git
    (navigation as any).reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleClose = () => {
    // LoserPaywallScreen'e git
    (navigation as any).navigate('LoserPaywallScreen');
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

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: ourColors.text }]}>
          {t('paywall.get')} <Text style={[styles.premiumText, { color: ourColors.primary }]}>{t('paywall.premium')}</Text>
        </Text>

        {/* Feature Slider */}
        <ScrollView
          ref={sliderRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onSlideChange}
          style={styles.slider}
        >
          {slides.map((slide) => (
            <View key={slide.id} style={styles.slide}>
              {slide.isAIScore ? (
                <View style={styles.aiScoreContainer}>
                  <Animated.View 
                    style={[
                      styles.scoreCard, 
                      { 
                        backgroundColor: ourColors.surface,
                        transform: [{ scale: buzzAnimation }]
                      }
                    ]}
                  >
                    <Text style={[styles.scoreNumber, { color: ourColors.primary }]}>86</Text>
                    <View style={styles.scoreBlurOverlay} />
                  </Animated.View>
                </View>
              ) : (
                <View style={styles.slideIconContainer}>
                  <SvgXml 
                    xml={getSvgIcon(slide.icon, ourColors.primary)} 
                    width={getResponsiveSize(48)} 
                    height={getResponsiveSize(48)} 
                  />
                </View>
              )}
              <Text style={[styles.slideTitle, { color: ourColors.text }]}>
                {slide.title}
              </Text>
              <Text style={[styles.slideDescription, { color: ourColors.textSecondary }]}>
                {slide.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Slide Indicator */}
        <View style={styles.slideIndicator}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === currentSlide 
                  ? [styles.activeDot, { backgroundColor: ourColors.primary }]
                  : [styles.inactiveDot, { backgroundColor: ourColors.border }]
              ]}
              onPress={() => goToSlide(index)}
            />
          ))}
        </View>

        {/* Pricing Options */}
        <View style={styles.pricingContainer}>
          {products.map((product) => {
            const isSelected = selectedProduct === product.id;
            
            return (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.priceCard,
                  { 
                    backgroundColor: ourColors.surface,
                    borderColor: isSelected ? ourColors.primary : ourColors.border,
                    borderWidth: isSelected ? 2 : 1,
                  }
                ]}
                onPress={() => setSelectedProduct(product.id)}
              >
                {product.isBestChoice && (
                  <View style={[styles.discountBadge, { backgroundColor: ourColors.primary }]}>
                    <Text style={[styles.discountText, { color: ourColors.buttonText }]}>
                      {t('paywall.best_choice')}
                    </Text>
                  </View>
                )}
                
                <Text style={[styles.priceCardTitle, { color: ourColors.primary }]}>
                  {product.title}
                </Text>
                
                <Text style={[styles.priceCardPrice, { color: ourColors.text }]}>
                  {product.price}
                </Text>
                
                <Text style={[styles.priceCardPeriod, { color: ourColors.textSecondary }]}>
                  {product.period}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: ourColors.primary }]}
          onPress={handleSubscribe}
        >
          <Text style={[styles.subscribeButtonText, { color: ourColors.buttonText }]}>
            {t('paywall.subscribe_button')}
          </Text>
        </TouchableOpacity>

        {/* Testimonials */}
        <View style={styles.testimonialsSection}>
          <View style={styles.starRatingContainer}>
            {[...Array(5)].map((_, i) => (
              <View key={i} style={styles.starIcon}>
                <SvgXml xml={starSvg('#FFC107')} width={getResponsiveSize(28)} height={getResponsiveSize(28)} />
              </View>
            ))}
          </View>
          <Text style={[styles.sectionTitle, { color: ourColors.text, marginTop: 12 }]}>
            {t('paywall.testimonials_title')}
          </Text>
          <Text style={[styles.sectionSubtitle, { color: ourColors.textSecondary }]}>
            {t('paywall.testimonials_subtitle')}
          </Text>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.testimonialsScrollView}
            contentContainerStyle={{ paddingHorizontal: getResponsivePadding(20) }}
          >
            {[{
              id: '1',
              stars: 5,
              title: t('paywall.testimonial_1_title'),
              text: t('paywall.testimonial_1_text'),
              author: 'Nabil',
            },
            {
              id: '2',
              stars: 5,
              title: t('paywall.testimonial_2_title'),
              text: t('paywall.testimonial_2_text'),
              author: 'Alex',
            }].map(item => (
              <View key={item.id} style={[styles.testimonialCard, { backgroundColor: ourColors.surface, borderColor: ourColors.border }]}>
                 <Text style={[styles.testimonialTitle, { color: ourColors.text }]}>{item.title}</Text>
                 <View style={styles.starRatingContainerSmall}>
                    {[...Array(item.stars)].map((_, i) => (
                      <View key={i} style={styles.starIconSmall}>
                        <SvgXml xml={starSvg('#FFC107')} width={getResponsiveSize(18)} height={getResponsiveSize(18)} />
                      </View>
                    ))}
                 </View>
                 <Text style={[styles.testimonialText, { color: ourColors.textSecondary }]}>{item.text}</Text>
                 <Text style={[styles.testimonialAuthor, { color: ourColors.text }]}>{item.author}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Apple Feature Section */}
        <View style={styles.appleFeatureSection}>
          <Image 
            source={require('@assets/social/apple.png')} 
            style={[styles.appleIcon, { tintColor: ourColors.text }]} 
            resizeMode="contain"
          />
          
          <View style={styles.appleFeatureTextContainer}>
            <Image 
              source={require('@assets/social/yaprak.png')} 
              style={[styles.leafIcon, styles.leftLeaf, { tintColor: ourColors.text }]} 
              resizeMode="contain"
            />
            <View style={styles.appleFeatureMainText}>
              <Text style={[styles.appleFeatureSubtitle, { color: ourColors.textSecondary }]}>
                {t('paywall.apple_featured_title')}
              </Text>
              <Text style={[styles.appleFeatureTitle, { color: ourColors.text }]}>
                {t('paywall.apple_featured_subtitle')}
              </Text>
            </View>
            <Image 
              source={require('@assets/social/yaprak.png')} 
              style={[styles.leafIcon, styles.rightLeaf, { tintColor: ourColors.text }]} 
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Comparison Section */}
        <View style={styles.comparisonSection}>
          <Text style={[styles.sectionTitle, { color: ourColors.text, marginBottom: getResponsivePadding(20) }]}>
            {t('paywall.comparison_title')}
          </Text>
          <View style={styles.comparisonHeader}>
            <Text style={[styles.comparisonHeaderText, { flex: 2 }]}></Text>
            <Text style={[styles.comparisonHeaderText, { color: ourColors.textSecondary, textAlign: 'center' }]}>
              {t('paywall.comparison_free')}
            </Text>
            <Text style={[styles.comparisonHeaderText, { color: ourColors.primary, textAlign: 'center' }]}>
              {t('paywall.comparison_pro')}
            </Text>
          </View>
          {[
            { feature: t('paywall.comparison_feature_1'), free: '✓', pro: '✓' },
            { feature: t('paywall.comparison_feature_2'), free: t('paywall.comparison_free_limit_1'), pro: '✓' },
            { feature: t('paywall.comparison_feature_3'), free: t('paywall.comparison_free_limit_2'), pro: '✓' },
            { feature: t('paywall.comparison_feature_4'), free: '✗', pro: '✓' },
          ].map((item, index) => (
            <View key={index} style={[styles.comparisonRow, { borderBottomColor: ourColors.border }]}>
              <Text style={[styles.comparisonFeature, { color: ourColors.text }]}>{item.feature}</Text>
              <Text style={[styles.comparisonValue, { color: ourColors.textSecondary }]}>{item.free}</Text>
              <Text style={[styles.comparisonValue, { color: ourColors.primary }]}>{item.pro}</Text>
            </View>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={[styles.sectionTitle, { color: ourColors.text, marginBottom: getResponsivePadding(20) }]}>
            {t('paywall.faq_title')}
          </Text>
          {[
            { q: t('paywall.faq_q1'), a: t('paywall.faq_a1') },
            { q: t('paywall.faq_q2'), a: t('paywall.faq_a2') },
            { q: t('paywall.faq_q3'), a: t('paywall.faq_a3') },
          ].map((item, index) => (
            <View key={index} style={[styles.faqItem, { backgroundColor: ourColors.surface }]}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              >
                <Text style={[styles.faqQuestionText, { color: ourColors.text }]}>{item.q}</Text>
                <Text style={[styles.faqChevron, { color: ourColors.textSecondary }]}>
                  {expandedFAQ === index ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={[styles.faqAnswerText, { color: ourColors.textSecondary }]}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Support Contact */}
        <View style={styles.supportSection}>
          <Text style={[styles.supportQuestion, { color: ourColors.textSecondary }]}>
            {t('paywall.support_question')}
          </Text>
          <Text style={[styles.supportEmail, { color: ourColors.primary }]}>
            {t('paywall.support_email')}
          </Text>
        </View>

        {/* Footer Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={[styles.footerLink, { color: ourColors.primary }]}>
              {t('paywall.privacy_policy')}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.footerSeparator, { color: ourColors.textSecondary }]}>
            {' • '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.footerLink, { color: ourColors.primary }]}>
              {t('paywall.terms_conditions')}
            </Text>
          </TouchableOpacity>
        </View>
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
    top: getResponsivePadding(60),
    right: getResponsivePadding(20),
    zIndex: 10,
    width: getResponsiveSize(32),
    height: getResponsiveSize(32),
    justifyContent: 'center',
    alignItems: 'center',
  },  
  closeButtonText: {
    fontSize: getResponsiveSize(18),
    fontFamily: 'System',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: getResponsivePadding(80),
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(40),
  },
  logoImage: {
    width: getResponsiveSize(50),
    height: getResponsiveSize(50),
    alignSelf: 'center',
    marginBottom: getResponsivePadding(20),
  },
  subtitle: {
    fontSize: getResponsiveSize(32),
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: getResponsivePadding(16),
    marginTop: getResponsivePadding(20),
  },
  premiumText: {
    fontSize: getResponsiveSize(32),
    fontFamily: 'System',
    fontWeight: '700',
  },
  slider: {
    height: getResponsiveSize(200),
    marginBottom: getResponsivePadding(30),
    marginLeft: -getResponsivePadding(20),
    marginRight: -getResponsivePadding(20),
  },
  slide: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slideIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getResponsivePadding(16),
  },
  aiScoreContainer: {
    alignItems: 'center',
    marginBottom: getResponsivePadding(10),
  },
  scoreCard: {
    width: getResponsiveSize(120),
    height: getResponsiveSize(120),
    borderRadius: getResponsiveSize(20),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scoreNumber: {
    fontSize: getResponsiveSize(48),
    fontFamily: 'System',
    fontWeight: '700',
    letterSpacing: -1,
  },
  scoreBlurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: getResponsiveSize(20),
  },
  slideTitle: {
    fontSize: getResponsiveSize(20),
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: getResponsivePadding(8),
    width: SCREEN_WIDTH,
    paddingHorizontal: getResponsivePadding(20),
  },
  slideDescription: {
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: getResponsiveSize(22),
    width: SCREEN_WIDTH,
    paddingHorizontal: getResponsivePadding(20),
  },
  slideIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: getResponsivePadding(50),
  },
  dot: {
    marginHorizontal: getResponsivePadding(4),
  },
  activeDot: {
    width: getResponsiveSize(8),
    height: getResponsiveSize(8),
    borderRadius: getResponsiveSize(4),
  },
  inactiveDot: {
    width: getResponsiveSize(6),
    height: getResponsiveSize(6),
    borderRadius: getResponsiveSize(3),
  },
  pricingContainer: {
    flexDirection: 'row',
    marginBottom: getResponsivePadding(32),
    gap: getResponsivePadding(12),
  },
  priceCard: {
    flex: 1,
    padding: getResponsivePadding(16),
    borderRadius: getResponsiveSize(16),
    position: 'relative',
    alignItems: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: getResponsiveSize(-15),
    alignSelf: 'center',
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(4),
    borderRadius: getResponsiveSize(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    fontSize: getResponsiveSize(10),
    fontFamily: 'System',
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  priceCardTitle: {
    fontSize: getResponsiveSize(16),
    fontFamily: 'System',
    fontWeight: '700',
    marginBottom: getResponsivePadding(2),
    marginTop: getResponsivePadding(10),
  },
  priceCardPrice: {
    fontSize: getResponsiveSize(18),
    fontFamily: 'System',
    fontWeight: '800',
    marginBottom: getResponsivePadding(2),
  },
  priceCardPeriod: {
    fontSize: getResponsiveSize(12),
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: getResponsiveSize(16),
  },
  subscribeButton: {
    paddingVertical: getResponsivePadding(16),
    borderRadius: getResponsiveSize(16),
    alignItems: 'center',
    marginBottom: getResponsivePadding(20),
  },
  subscribeButtonText: {
    fontSize: getResponsiveSize(18),
    fontFamily: 'System',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: getResponsiveSize(22),
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
    textAlign: 'center',
    marginTop: getResponsivePadding(4),
  },
  testimonialsSection: {
    marginTop: getResponsivePadding(40),
    alignItems: 'center',
  },
  starRatingContainer: {
    flexDirection: 'row',
  },
  starIcon: {
    marginHorizontal: getResponsivePadding(2),
  },
  testimonialsScrollView: {
    marginTop: getResponsivePadding(20),
    marginHorizontal: -getResponsivePadding(20),
  },
  testimonialCard: {
    width: getResponsiveSize(280),
    padding: getResponsivePadding(20),
    borderRadius: getResponsiveSize(16),
    marginRight: getResponsivePadding(12),
    borderWidth: 1,
  },
  testimonialTitle: {
    fontSize: getResponsiveSize(16),
    fontFamily: 'System',
    fontWeight: '700',
  },
  starRatingContainerSmall: {
    flexDirection: 'row',
    marginVertical: getResponsivePadding(8),
  },
  starIconSmall: {
    marginRight: getResponsivePadding(2),
  },
  testimonialText: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    lineHeight: getResponsiveSize(20),
    flex: 1,
  },
  testimonialAuthor: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
    marginTop: getResponsivePadding(12),
    textAlign: 'right',
  },
  appleFeatureSection: {
    marginVertical: getResponsivePadding(50),
    alignItems: 'center',
  },
  appleIcon: {
    width: getResponsiveSize(40),
    height: getResponsiveSize(40),
    alignSelf: 'center',
  },
  appleFeatureTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getResponsivePadding(16),
  },
  leafIcon: {
    width: getResponsiveSize(30),
    height: getResponsiveSize(75),
  },
  leftLeaf: {
    // Sol yaprak için ekstra style (şimdilik boş)
  },
  rightLeaf: {
    transform: [{ scaleX: -1 }], // Sağ yaprak ters çevrilmiş
  },
  appleFeatureMainText: {
    marginHorizontal: getResponsivePadding(15),
    alignItems: 'center',
  },
  appleFeatureSubtitle: {
    fontSize: getResponsiveSize(12),
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  appleFeatureTitle: {
    fontSize: getResponsiveSize(20),
    fontFamily: 'System',
    fontWeight: '700',
  },
  comparisonSection: {
    marginBottom: getResponsivePadding(40),
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: getResponsivePadding(10),
  },
  comparisonHeaderText: {
    flex: 1,
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getResponsivePadding(12),
    borderBottomWidth: 1,
  },
  comparisonFeature: {
    flex: 2,
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
  },
  comparisonValue: {
    flex: 1,
    fontSize: getResponsiveSize(16),
    fontFamily: 'System',
    fontWeight: '700',
    textAlign: 'center',
  },
  faqSection: {
    marginBottom: getResponsivePadding(40),
  },
  faqItem: {
    borderRadius: getResponsiveSize(16),
    marginBottom: getResponsivePadding(12),
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: getResponsivePadding(20),
  },
  faqQuestionText: {
    flex: 1,
    fontSize: getResponsiveSize(15),
    fontFamily: 'System',
    fontWeight: '600',
    paddingRight: getResponsivePadding(12),
  },
  faqChevron: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
  },
  faqAnswer: {
    paddingHorizontal: getResponsivePadding(20),
    paddingBottom: getResponsivePadding(20),
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    lineHeight: getResponsiveSize(20),
  },
  supportSection: {
    alignItems: 'center',
    marginBottom: getResponsivePadding(20),
  },
  supportQuestion: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: getResponsivePadding(4),
  },
  supportEmail: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
    fontWeight: '500',
  },
  footerSeparator: {
    fontSize: getResponsiveSize(14),
    fontFamily: 'System',
  },
});

export default PaywallScreen;