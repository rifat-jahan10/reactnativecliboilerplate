import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useI18nContext } from './I18nProvider';

export const I18nTest: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('common');
  
  const {
    t,
    changeLanguage,
    currentLanguage,
    availableLanguages,
    formatDate,
    formatNumber,
    formatCurrency,
  } = useI18nContext();

  const categories = [
    'common',
    'navigation',
    'auth',
    'profile',
    'settings',
    'notifications',
    'errors',
    'validation',
    'onesignal',
  ];

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
  };

  const renderCategoryContent = (category: string) => {
    const keys = Object.keys(t(category, { returnObjects: true }) || {});
    
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryTitle}>{t(`${category}.title`, { defaultValue: category })}</Text>
        {keys.map((key) => (
          <View key={key} style={styles.keyRow}>
            <Text style={styles.keyName}>{key}:</Text>
            <Text style={styles.keyValue}>{t(`${category}.${key}`)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('common.loading')} - i18n Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Language Settings</Text>
        
        <View style={styles.languageContainer}>
          <Text style={styles.label}>Current Language: {currentLanguage}</Text>
          <Text style={styles.label}>Available Languages:</Text>
          <View style={styles.languageButtons}>
            {availableLanguages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.languageButton,
                  currentLanguage === lang && styles.activeLanguageButton,
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text style={[
                  styles.languageButtonText,
                  currentLanguage === lang && styles.activeLanguageButtonText,
                ]}>
                  {lang.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Formatting Examples</Text>
        
        <View style={styles.formatContainer}>
          <Text style={styles.label}>Date: {formatDate(new Date())}</Text>
          <Text style={styles.label}>Number: {formatNumber(1234.56)}</Text>
          <Text style={styles.label}>Currency: {formatCurrency(99.99, 'USD')}</Text>
          <Text style={styles.label}>Currency (TRY): {formatCurrency(99.99, 'TRY')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category Selection</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.activeCategoryButtonText,
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Translation Content</Text>
        {renderCategoryContent(selectedCategory)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  languageContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  languageButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  activeLanguageButton: {
    backgroundColor: '#007AFF',
  },
  languageButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeLanguageButtonText: {
    color: 'white',
  },
  formatContainer: {
    marginTop: 10,
  },
  categoryScroll: {
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  categoryContainer: {
    marginTop: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  keyRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  keyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  keyValue: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
});
