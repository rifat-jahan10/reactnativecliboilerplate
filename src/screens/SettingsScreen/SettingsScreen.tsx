import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  Linking,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '@hooks/useI18n';
import { SvgXml } from 'react-native-svg';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/storage';

const backIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const arrowRightIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const SettingItem = ({ title, onPress, showArrow = true, disabled = false, isDangerous = false }: { 
  title: string; 
  onPress: () => void; 
  showArrow?: boolean; 
  disabled?: boolean;
  isDangerous?: boolean;
}) => {
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    surface: '#F8F9FA',
    border: '#E0E0E0',
    cardBorder: '#E0E0E0',
    danger: '#FF3B30',
  };

  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        { 
          backgroundColor: ourColors.background, 
          borderBottomColor: ourColors.cardBorder,
          opacity: disabled ? 0.5 : 1 
        }
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.menuItemText, 
        { 
          color: isDangerous ? ourColors.danger : ourColors.text 
        }
      ]}>
        {title}
      </Text>
      {showArrow && (
        <View style={styles.menuItemRight}>
          <SvgXml 
            xml={arrowRightIcon.replace(/currentColor/g, ourColors.text)} 
            width={24} 
            height={24} 
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const SectionTitle = ({ title }: { title: string }) => {
  const ourColors = {
    text: '#000000',
  };
  return (
    <Text style={[styles.sectionTitle, { color: ourColors.text }]}>{title}</Text>
  );
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { t } = useI18n();
  const [tapCount, setTapCount] = useState(0);
  const [isDeveloperModeEnabled, setIsDeveloperModeEnabled] = useState(false);

  // Developer mode'u yükle
  useEffect(() => {
    const loadDeveloperMode = async () => {
      try {
        const isEnabled = await storage.get(STORAGE_KEYS.DEVELOPER_MODE_ENABLED);
        setIsDeveloperModeEnabled(isEnabled === 'true');
      } catch (error) {
        console.error('Developer mode yüklenirken hata:', error);
      }
    };
    loadDeveloperMode();
  }, []);

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    surface: '#F8F9FA',
    border: '#E0E0E0',
  };
  
  // URL bağlantıları
  const privacyPolicyUrl = 'https://your-privacy-policy-url.com';
  const termsOfUseUrl = 'https://your-terms-of-use-url.com';
  
  // URL'yi açmak için fonksiyon
  const openURL = useCallback(async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error(`URL açılamıyor: ${url}`);
    }
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      t('settings.logout_title'),
      t('settings.logout_message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.logout_confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Local storage'ı temizle
              await storage.clear();
              
              Alert.alert(t('common.success'), t('settings.logout_success'));
              
              // TabNavigator'a geri git
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'First' }],
              });
            } catch (error) {
              console.error('Çıkış yapılırken hata:', error);
              Alert.alert(t('common.error'), t('settings.logout_error'));
            }
          },
        },
      ],
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      t('settings.delete_title'),
      t('settings.delete_message'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.delete_confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Local storage'ı temizle
              await storage.clear();
              
              Alert.alert(t('common.success'), t('settings.delete_success'));
              
              // Onboarding'e geri git
              (navigation as any).reset({
                index: 0,
                routes: [{ name: 'First' }],
              });
            } catch (error) {
              console.error('Hesap silinirken hata:', error);
              Alert.alert(t('common.error'), t('settings.delete_error'));
            }
          }
        },
      ]
    );
  };

  // Görünmez buton için tap handler
  const handleInvisibleButtonPress = async () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount >= 3) {
      try {
        const newDeveloperMode = !isDeveloperModeEnabled;
        await storage.set(STORAGE_KEYS.DEVELOPER_MODE_ENABLED, newDeveloperMode.toString());
        setIsDeveloperModeEnabled(newDeveloperMode);
        setTapCount(0);
        
        Alert.alert(
          t('settings.developer_mode'),
          newDeveloperMode 
            ? t('settings.developer_mode_enabled') 
            : t('settings.developer_mode_disabled')
        );
      } catch (error) {
        console.error('Developer mode ayarlanırken hata:', error);
      }
    } else {
      // 2 saniye sonra tap count'u sıfırla
      setTimeout(() => {
        setTapCount(0);
      }, 2000);
    }
  };

  // Developer resources sayfası handler
  const handleDeveloperResourcesPress = () => {
    (navigation as any).navigate('DeveloperResourcesScreen');
  };



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      {/* Header with Back Button */}
      <View style={[styles.header, { 
        backgroundColor: ourColors.background, 
        borderBottomColor: ourColors.border 
      }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <SvgXml 
            xml={backIcon.replace(/currentColor/g, ourColors.text)} 
            width={24} 
            height={24} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: ourColors.text }]}>{t('settings.title')}</Text>
        
        {/* Görünmez buton - sağ üst köşe */}
        <TouchableOpacity 
          onPress={handleInvisibleButtonPress}
          style={styles.invisibleButton}
        />
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: ourColors.background }]} 
        contentContainerStyle={{
          paddingBottom: 120 // Tab bar + extra space
        }}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Developer Resources - sadece developer mode açıkken görünür */}
        {isDeveloperModeEnabled && (
          <View style={[styles.section, { backgroundColor: ourColors.background, marginTop: 32 }]}>
            <View style={styles.sectionHeader}>
              <SectionTitle title={t('settings.developer')} />
            </View>
            <SettingItem 
              title={t('settings.developer_resources')} 
              onPress={handleDeveloperResourcesPress} 
            />
          </View>
        )}
        
        {/* Legal Section */}
        <View style={[styles.section, { backgroundColor: ourColors.background, marginTop: 32 }]}>
          <View style={styles.sectionHeader}>
            <SectionTitle title={t('settings.legal')} />
          </View>
          <SettingItem 
            title={t('settings.privacy_policy')} 
            onPress={() => openURL(privacyPolicyUrl)} 
          />
          <SettingItem 
            title={t('settings.terms_of_use')} 
            onPress={() => openURL(termsOfUseUrl)} 
          />
        </View>
        
        {/* Account Actions Section */}
        <View style={[styles.section, { backgroundColor: ourColors.background, marginTop: 40 }]}>
          <SettingItem
            title={t('settings.logout')}
            onPress={handleLogout}
            showArrow={false}
            isDangerous={false}
          />
          <SettingItem
            title={t('settings.delete_account')}
            onPress={handleDeleteAccount}
            showArrow={false}
            isDangerous={true}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  invisibleButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 60,
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default SettingsScreen;
