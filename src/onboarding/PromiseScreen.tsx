import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
  Animated,
  PanResponder,
  Vibration,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';
import { SvgXml } from 'react-native-svg';

const PromiseScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const { width, height } = useWindowDimensions();

  // State
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Refs for real-time state tracking
  const isHoldingRef = useRef(false);
  const isCompletedRef = useRef(false);

  // Animations
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const completionAnimation = useRef(new Animated.Value(0)).current;
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const fullscreenAnimation = useRef(new Animated.Value(0)).current;

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
    primary: '#1DD1A1',
    primaryDark: '#10AC84',
    secondary: '#FF6B6B',
    background: '#F8F9FA',
    backgroundDark: '#2C2C54',
    surface: '#FFFFFF',
    text: '#2C2C54',
    textLight: '#FFFFFF',
    textSecondary: '#8395A7',
    success: '#00D68F',
    warning: '#FFAC30',
    error: '#FF5722',
    border: '#DDD5D0',
    shadowLight: 'rgba(99, 99, 99, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.15)',
  };

  // Pan Responder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      
      onPanResponderGrant: () => {
        if (isCompletedRef.current) return;
        
        setIsHolding(true);
        isHoldingRef.current = true;
        Vibration.vibrate(50);
        
        // Start animations
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1.1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(fullscreenAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          })
        ]).start();
        
        // Progress animation
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }).start((finished) => {
          if (finished && isHoldingRef.current) {
            // Clear holding state first
            setIsHolding(false);
            isHoldingRef.current = false;
            
            // Set completed state
            setIsCompleted(true);
            isCompletedRef.current = true;
            Vibration.vibrate([0, 100, 50, 100]);
            
            // Smooth completion animation
            Animated.parallel([
              Animated.timing(completionAnimation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(backgroundAnimation, {
                toValue: 1,
                duration: 400,
                useNativeDriver: false,
              })
            ]).start(() => {
              setTimeout(() => {
                (navigation as any).navigate('PaywallScreen');
              }, 1200);
            });
          }
        });
      },

      onPanResponderRelease: () => {
        if (isCompletedRef.current) return;
        
        setIsHolding(false);
        isHoldingRef.current = false;
        
        // Stop animations
        progressAnimation.stopAnimation();
        fullscreenAnimation.stopAnimation();
        
        // Reset animations
        Animated.parallel([
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(progressAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(fullscreenAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      },
    })
  ).current;

  // Background color animation
  const backgroundColor = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [ourColors.background, ourColors.primary],
  });

  // Dynamic text colors based on completion
  const textColor = isCompleted ? ourColors.textLight : ourColors.text;
  const subtitleColor = isCompleted ? ourColors.textLight : ourColors.textSecondary;

  // Fullscreen circle scale calculation
  const maxDimension = Math.max(width, height);
  const fullscreenScale = fullscreenAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, maxDimension / getResponsiveSize(200) * 2],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isCompleted ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      <Animated.View style={[styles.animatedBackground, { backgroundColor }]}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: textColor }]}>
              {isCompleted ? t('promise.completed_title') : t('promise.title')}
            </Text>
            <Text style={[styles.subtitle, { color: subtitleColor }]}>
              {isCompleted ? t('promise.completed_subtitle') : t('promise.subtitle')}
            </Text>
          </View>

          {/* Interactive Logo */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: scaleAnimation }]
              }
            ]}
            {...panResponder.panHandlers}
          >
            {/* Expanding Circle for Fullscreen Effect */}
            <Animated.View 
              style={[
                styles.expandingCircle,
                {
                  transform: [{ scale: fullscreenScale }]
                }
              ]}
            />

            {/* Progress Ring Background */}
            <View style={styles.progressRing} />
            
            {/* Progress Indicator */}
            <Animated.View 
              style={[
                styles.progressIndicator,
                {
                  transform: [
                    { rotate: '-90deg' },
                    { 
                      rotateZ: progressAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg'],
                      })
                    }
                  ]
                }
              ]}
            />

            {/* Logo/Icon */}
            <View style={styles.logoIcon}>
              <Image 
                source={require('@assets/social/fingerprint.png')}
                style={{
                  width: getResponsiveSize(80),
                  height: getResponsiveSize(80),
                  resizeMode: 'contain',
                  tintColor: ourColors.surface,
                }}
              />
            </View>


          </Animated.View>

          {/* Instructions - Right below logo container */}
          {!isCompleted && (
            <View style={styles.instructionContainer}>
              <Text style={[styles.instructionText, { color: textColor }]}>
                {isHolding ? '' : t('promise.instruction')}
              </Text>
              {!isHolding && (
                <Text style={[styles.hintText, { color: subtitleColor }]}>
                  {t('promise.hint')}
                </Text>
              )}
            </View>
          )}

          {/* Holding Text - Shows over the circle when holding */}
          {isHolding && !isCompleted && (
            <Text style={styles.holdingText}>
              {t('promise.holding')}
            </Text>
          )}

          {/* Completion State */}
          {isCompleted && (
            <Animated.View style={styles.completionContainer}>
              <Animated.View
                style={{
                  opacity: completionAnimation,
                  transform: [
                    { 
                      scale: completionAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      })
                    },
                    { 
                      translateY: completionAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      })
                    }
                  ]
                }}
              >
                <Text style={styles.completionText}>
                  {t('promise.completed_title')}
                </Text>
              </Animated.View>
              
              <Animated.View
                style={{
                  opacity: completionAnimation.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1],
                  }),
                  transform: [
                    { 
                      translateY: completionAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [10, 0],
                      })
                    }
                  ]
                }}
              >
                <Text style={styles.completionSubtext}>
                  {t('promise.completed_subtitle')}
                </Text>
              </Animated.View>
            </Animated.View>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animatedBackground: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontFamily: 'System',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'System',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoCircle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    backgroundColor: '#1DD1A1',
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: '#1DD1A1',
  },
  progressIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: '#FFFFFF',
    transform: [{ rotate: '-90deg' }],
  },
  logoIcon: {
    zIndex: 2,
  },
  expandingCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#1DD1A1',
    zIndex: -1,
  },
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
  },
  instructionText: {
    fontSize: 18,
    fontFamily: 'System',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  hintText: {
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: '500',
    textAlign: 'center',
    opacity: 0.7,
  },
  holdingText: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 28,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#FFFFFF',
    zIndex: 10,
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  completionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  completionText: {
    fontSize: 36,
    fontFamily: 'System',
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  completionSubtext: {
    fontSize: 19,
    fontFamily: 'System',
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  completionIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
});

export default PromiseScreen;