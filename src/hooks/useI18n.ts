import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import '../config/i18n'; // i18n konfigürasyonunu import et

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((language: string) => {
    i18n.changeLanguage(language);
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  const getAvailableLanguages = useCallback(() => {
    return Object.keys(i18n.options.resources || {});
  }, [i18n]);

  const isLanguageLoaded = useCallback((language: string) => {
    return i18n.hasResourceBundle(language, 'translation');
  }, [i18n]);

  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'tr' ? 'tr-TR' : 'en-US';
    
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    }).format(date);
  }, [getCurrentLanguage]);

  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'tr' ? 'tr-TR' : 'en-US';
    
    return new Intl.NumberFormat(locale, options).format(number);
  }, [getCurrentLanguage]);

  const formatCurrency = useCallback((amount: number, currency: string = 'USD', options?: Intl.NumberFormatOptions) => {
    const currentLang = getCurrentLanguage();
    const locale = currentLang === 'tr' ? 'tr-TR' : 'en-US';
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      ...options,
    }).format(amount);
  }, [getCurrentLanguage]);

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isLanguageLoaded,
    formatDate,
    formatNumber,
    formatCurrency,
    currentLanguage: getCurrentLanguage(),
    availableLanguages: getAvailableLanguages(),
  };
};
