# React Native CLI Boilerplate

Bu proje hem Metro bundler hem de Expo ile çalışabilen hibrit bir React Native boilerplate'idir.

## Kurulum

```bash
npm install
```

## OneSignal Kurulumu

1. **OneSignal Dashboard'da yeni app oluştur:**
   - [OneSignal Dashboard](https://app.onesignal.com) adresine git
   - Yeni app oluştur
   - App ID, REST API Key ve Project Number'ı al

2. **Environment variables ayarla:**
   ```bash
   # .env dosyası oluştur (root dizinde)
   ONESIGNAL_APP_ID=your_app_id_here
   ONESIGNAL_REST_API_KEY=your_rest_api_key_here
   ONESIGNAL_PROJECT_NUMBER=your_onesignal_project_number_here
   ```

3. **Android için:**
   - `android/app/src/main/AndroidManifest.xml` dosyası güncellendi
   - Gerekli izinler eklendi

4. **iOS için:**
   - `ios/Podfile` güncellendi
   - `pod install` çalıştır

## i18n (Internationalization) Kurulumu

Bu proje `react-i18next` kullanarak çoklu dil desteği sağlar.

### Desteklenen Diller
- 🇹🇷 Türkçe (tr)
- 🇺🇸 İngilizce (en)

### Kullanım

```typescript
import { useI18nContext } from './src/components/I18nProvider';

const { t, changeLanguage, currentLanguage } = useI18nContext();

// Metin çevirisi
const message = t('common.loading');

// Dil değiştirme
changeLanguage('tr');

// Mevcut dil
console.log(currentLanguage); // 'tr' veya 'en'
```

### Formatting Fonksiyonları

```typescript
const { formatDate, formatNumber, formatCurrency } = useI18nContext();

// Tarih formatı
const date = formatDate(new Date()); // "22 Ağustos 2025" (TR) veya "August 22, 2025" (EN)

// Sayı formatı
const number = formatNumber(1234.56); // "1.234,56" (TR) veya "1,234.56" (EN)

// Para formatı
const currency = formatCurrency(99.99, 'TRY'); // "₺99,99" (TR) veya "$99.99" (EN)
```

### Yeni Dil Ekleme

1. `src/locales/` klasörüne yeni dil dosyası ekle (örn: `de.json`)
2. `src/config/i18n.ts` dosyasında resources'a ekle
3. `src/hooks/useI18n.ts` dosyasında locale mapping'i güncelle

## AsyncStorage Sistemi

Bu proje `@react-native-async-storage/async-storage` kullanarak güçlü bir local storage sistemi sağlar.

### Özellikler

- ✅ **Type-safe storage**: TypeScript ile tam tip güvenliği
- ✅ **Custom hooks**: `useStorage` ve `useStorageMulti` hook'ları
- ✅ **Utility class**: `StorageManager` sınıfı
- ✅ **Prefixed keys**: Otomatik key prefix sistemi
- ✅ **JSON parsing**: Otomatik JSON serialize/deserialize
- ✅ **Error handling**: Kapsamlı hata yönetimi
- ✅ **Multi operations**: Çoklu key işlemleri

### Kullanım

#### Hook ile Kullanım

```typescript
import { useStorage } from './src/hooks/useStorage';
import { STORAGE_KEYS } from './src/config/storage';

// Basit kullanım
const userToken = useStorage(STORAGE_KEYS.USER_TOKEN, { defaultValue: '' });

// JSON parsing ile
const userProfile = useStorage(STORAGE_KEYS.USER_PROFILE, { 
  defaultValue: null, 
  parseJson: true 
});

// Değer değiştirme
userToken.setValue('new_token_here');
```

#### Utility Class ile Kullanım

```typescript
import { storage } from './src/utils/storage';

// Değer kaydetme
await storage.set(STORAGE_KEYS.USER_TOKEN, 'token_value');

// Değer getirme
const token = await storage.get(STORAGE_KEYS.USER_TOKEN);

// JSON parsing ile
const profile = await storage.get(STORAGE_KEYS.USER_PROFILE, true);

// Çoklu işlemler
const values = await storage.multiGet([
  STORAGE_KEYS.USER_TOKEN,
  STORAGE_KEYS.USER_PROFILE
], true);

// Tüm storage temizleme
await storage.clear();
```

#### Multi Storage Hook

```typescript
import { useStorageMulti } from './src/hooks/useStorage';

const userData = useStorageMulti({
  [STORAGE_KEYS.USER_TOKEN]: '',
  [STORAGE_KEYS.USER_PROFILE]: null,
  [STORAGE_KEYS.APP_LANGUAGE]: 'tr'
}, { parseJson: true });

// Çoklu değer güncelleme
userData.setValues({
  [STORAGE_KEYS.USER_TOKEN]: 'new_token',
  [STORAGE_KEYS.APP_LANGUAGE]: 'en'
});
```

### Storage Keys

```typescript
STORAGE_KEYS = {
  // User related
  USER_TOKEN: 'user_token',
  USER_PROFILE: 'user_profile',
  USER_SETTINGS: 'user_settings',
  
  // App related
  APP_LANGUAGE: 'app_language',
  APP_THEME: 'app_theme',
  APP_FIRST_LAUNCH: 'app_first_launch',
  
  // OneSignal related
  ONESIGNAL_USER_ID: 'onesignal_user_id',
  ONESIGNAL_EMAIL: 'onesignal_email',
  
  // Cache related
  CACHE_TIMESTAMP: 'cache_timestamp',
  CACHE_DATA: 'cache_data',
}
```

## Çalıştırma

### Metro ile (Tam Native Özellikler)
```bash
npm run start:metro
# Veya
npm run start
```

### Expo ile (Hızlı Geliştirme)
```bash
npm run start:expo
```

### Platform Spesifik Expo
```bash
npm run start:expo:android
npm run start:expo:ios
npm run start:expo:web
```

## Özellikler

- ✅ React Native CLI (Metro)
- ✅ Expo Go desteği
- ✅ TypeScript
- ✅ Modern React Native (0.80.2)
- ✅ Hibrit çalışma modu
- ✅ OneSignal Push Notifications
- ✅ OneSignal Test Component
- ✅ i18n (Çoklu Dil Desteği)
- ✅ i18n Test Component
- ✅ Türkçe ve İngilizce Locale Dosyaları
- ✅ AsyncStorage Sistemi
- ✅ Storage Test Component
- ✅ Type-safe Storage Hooks
- ✅ Storage Utility Class

## Kullanım Senaryoları

- **Windows'ta geliştirme**: `npm run start:expo` ile Expo Go kullan
- **Production build**: Metro ile tam native özellikler
- **Hızlı test**: Expo Go ile anında sonuç
- **Push notifications**: OneSignal ile
- **Çoklu dil**: i18n ile Türkçe/İngilizce
- **Local storage**: AsyncStorage ile veri saklama

## OneSignal Kullanımı

```typescript
import { useOneSignalContext } from './src/components/OneSignalProvider';

const { userId, sendNotification } = useOneSignalContext();

// Bildirim gönder
await sendNotification(['player_id'], 'Merhaba!', 'Başlık');
```

## i18n Kullanımı

```typescript
import { useI18nContext } from './src/components/I18nProvider';

const { t, changeLanguage } = useI18nContext();

// Metin çevirisi
const welcomeMessage = t('auth.welcome');

// Dil değiştirme
changeLanguage('en');
```

## AsyncStorage Kullanımı

```typescript
import { useStorage } from './src/hooks/useStorage';
import { STORAGE_KEYS } from './src/config/storage';

const userToken = useStorage(STORAGE_KEYS.USER_TOKEN, { defaultValue: '' });

// Değer kaydetme
await userToken.setValue('new_token');

// Değer getirme
console.log(userToken.value);

// Değer silme
await userToken.removeValue();
```

## Not

Bu proje "bare workflow" Expo kullanır, mevcut native kodları korur ve Expo SDK'yı entegre eder.
