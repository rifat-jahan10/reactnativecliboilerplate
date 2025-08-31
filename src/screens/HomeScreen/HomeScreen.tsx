import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useI18n } from '@hooks/useI18n';

const HomeScreen = () => {
  const { t } = useI18n();

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      <View style={styles.content}>
        {/* Logo */}
        <Image 
          source={require('@assets/logo.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />

        {/* Welcome Section */}
        <Text style={[styles.welcomeTitle, { color: ourColors.text }]}>
          {t('home.welcome_title')}
        </Text>
        <Text style={[styles.welcomeSubtitle, { color: ourColors.textSecondary }]}>
          {t('home.welcome_subtitle')}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 100, // Tab bar space
  },
  logoImage: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'System',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen;
