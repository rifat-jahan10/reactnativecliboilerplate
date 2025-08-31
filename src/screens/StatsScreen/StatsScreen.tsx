import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useI18n } from '@hooks/useI18n';

const StatsScreen = () => {
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
        <Text style={[styles.title, { color: ourColors.text }]}>
          {t('tabs.stats')}
        </Text>
        <Text style={[styles.subtitle, { color: ourColors.textSecondary }]}>
          {t('stats.coming_soon')}
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'System',
    textAlign: 'center',
  },
});

export default StatsScreen;
