import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  RefreshControl,
  TextInput,
  Alert,
  Platform,
  StatusBar,
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

interface StorageData {
  title: string;
  key: string;
  data: any;
  isEditable: boolean;
}

// JSON görüntüleyici bileşeni
const JSONViewer = ({ data, indentLevel = 0 }: { data: any; indentLevel?: number }) => {
  const ourColors = {
    text: '#000000',
    textSecondary: '#666666',
    jsonString: '#16A34A',
    jsonNumber: '#3B82F6',
    jsonBoolean: '#9333EA',
    jsonError: '#FF3B30',
  };

  const indent = '  '.repeat(indentLevel);
  
  if (data === null) {
    return <Text style={[styles.jsonNull, { color: ourColors.jsonError }]}>{indent}null</Text>;
  }
  
  if (typeof data === 'undefined') {
    return <Text style={[styles.jsonUndefined, { color: ourColors.jsonError }]}>{indent}undefined</Text>;
  }
  
  if (typeof data === 'string') {
    return <Text style={[styles.jsonString, { color: ourColors.jsonString }]}>{indent}"{data}"</Text>;
  }
  
  if (typeof data === 'number') {
    return <Text style={[styles.jsonNumber, { color: ourColors.jsonNumber }]}>{indent}{data}</Text>;
  }
  
  if (typeof data === 'boolean') {
    return <Text style={[styles.jsonBoolean, { color: ourColors.jsonBoolean }]}>{indent}{data ? 'true' : 'false'}</Text>;
  }
  
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <Text style={{ color: ourColors.textSecondary }}>{indent}[]</Text>;
    }
    
    return (
      <View>
        <Text style={{ color: ourColors.textSecondary }}>{indent}[</Text>
        {data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row' }}>
            <JSONViewer data={item} indentLevel={indentLevel + 1} />
            {index < data.length - 1 && <Text style={{ color: ourColors.textSecondary }}>,</Text>}
          </View>
        ))}
        <Text style={{ color: ourColors.textSecondary }}>{indent}]</Text>
      </View>
    );
  }
  
  if (typeof data === 'object') {
    const keys = Object.keys(data);
    
    if (keys.length === 0) {
      return <Text style={{ color: ourColors.textSecondary }}>{indent}{'{}'}</Text>;
    }
    
    return (
      <View>
        <Text style={{ color: ourColors.textSecondary }}>{indent}{'{'}</Text>
        {keys.map((key, index) => (
          <View key={key} style={{ flexDirection: 'row' }}>
            <Text style={[styles.jsonKey, { color: '#E11D48' }]}>{indent}  "{key}"</Text>
            <Text style={{ color: ourColors.textSecondary }}>: </Text>
            <View style={{ flex: 1 }}>
              <JSONViewer data={data[key]} indentLevel={0} />
            </View>
            {index < keys.length - 1 && <Text style={{ color: ourColors.textSecondary }}>,</Text>}
          </View>
        ))}
        <Text style={{ color: ourColors.textSecondary }}>{indent}{'}'}</Text>
      </View>
    );
  }
  
  return <Text style={{ color: ourColors.textSecondary }}>{indent}{String(data)}</Text>;
};

const DeveloperResourcesScreen = () => {
  const { t } = useI18n();
  const navigation = useNavigation();
  const [storageData, setStorageData] = useState<StorageData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Colors - mevcut proje renklerini kullan
  const ourColors = {
    background: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    primary: '#1EB7A7',
    surface: '#F8F9FA',
    border: '#E0E0E0',
    cardBorder: '#E0E0E0',
    card: '#F8F9FA',
    success: '#16A34A',
    warning: '#F59E0B',
    danger: '#FF3B30',
  };

  useEffect(() => {
    fetchStorageData();
  }, []);

  const fetchStorageData = async () => {
    try {
      const allKeys = await storage.getAllKeys();
      const allData: StorageData[] = [];

      for (const key of allKeys) {
        try {
          const value = await storage.get(key, true); // parseJson = true
          const displayName = getDisplayName(key);
          
          allData.push({
            title: displayName,
            key,
            data: value,
            isEditable: isEditableKey(key),
          });
        } catch (error) {
          console.error(`Error fetching ${key}:`, error);
          allData.push({
            title: getDisplayName(key),
            key,
            data: 'Error loading data',
            isEditable: false,
          });
        }
      }

      // Show message if no data found
      if (allData.length === 0) {
        console.log('No storage data found');
      }

      setStorageData(allData);
    } catch (error) {
      console.error('Storage verilerini alırken hata:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu');
    }
  };



  const getDisplayName = (key: string): string => {
    const displayNames: Record<string, string> = {
      // User related
      [STORAGE_KEYS.USER_TOKEN]: 'Kullanıcı Token',
      [STORAGE_KEYS.USER_PROFILE]: 'Kullanıcı Profili',
      [STORAGE_KEYS.USER_SETTINGS]: 'Kullanıcı Ayarları',
      [STORAGE_KEYS.USER_PREFERENCES]: 'Kullanıcı Tercihleri',
      
      // User onboarding data
      [STORAGE_KEYS.USER_DISPLAY_NAME]: 'Kullanıcı Display Adı',
      [STORAGE_KEYS.USER_GENDER]: 'Kullanıcı Cinsiyeti',
      [STORAGE_KEYS.USER_AGE]: 'Kullanıcı Yaşı',
      [STORAGE_KEYS.USER_HEIGHT]: 'Kullanıcı Boyu',
      [STORAGE_KEYS.USER_WEIGHT]: 'Kullanıcı Kilosu',
      [STORAGE_KEYS.USER_EXPERIENCE]: 'Deneyim Seviyesi',
      [STORAGE_KEYS.USER_EXERCISE_HOURS]: 'Egzersiz Saatleri',
      [STORAGE_KEYS.USER_FOCUS_AREAS]: 'Odak Alanları',
      [STORAGE_KEYS.USER_SPORTS]: 'Spor Türleri',
      [STORAGE_KEYS.USER_ENVIRONMENT_PREFERENCE]: 'Ortam Tercihi',
      [STORAGE_KEYS.USER_AIM]: 'Kullanıcı Hedefi',
      
      // App related
      [STORAGE_KEYS.APP_LANGUAGE]: 'Uygulama Dili',
      [STORAGE_KEYS.APP_THEME]: 'Uygulama Teması',
      [STORAGE_KEYS.APP_FIRST_LAUNCH]: 'İlk Başlatma',
      [STORAGE_KEYS.APP_VERSION]: 'Uygulama Versiyonu',
      [STORAGE_KEYS.ONBOARDING_COMPLETED]: 'Onboarding Tamamlandı',
      
      // OneSignal related
      [STORAGE_KEYS.ONESIGNAL_USER_ID]: 'OneSignal User ID',
      [STORAGE_KEYS.ONESIGNAL_EMAIL]: 'OneSignal Email',
      [STORAGE_KEYS.ONESIGNAL_EXTERNAL_ID]: 'OneSignal External ID',
      
      // Cache related
      [STORAGE_KEYS.CACHE_TIMESTAMP]: 'Cache Zaman Damgası',
      [STORAGE_KEYS.CACHE_DATA]: 'Cache Verileri',
      
      // Form data
      [STORAGE_KEYS.FORM_DRAFTS]: 'Form Taslakları',
      [STORAGE_KEYS.SEARCH_HISTORY]: 'Arama Geçmişi',
      
      // Offline data
      [STORAGE_KEYS.OFFLINE_QUEUE]: 'Offline Kuyruk',
      [STORAGE_KEYS.SYNC_STATUS]: 'Senkronizasyon Durumu',
      
      // Developer mode
      [STORAGE_KEYS.DEVELOPER_MODE_ENABLED]: 'Developer Mode',
    };

    return displayNames[key] || key;
  };

  const isEditableKey = (key: string): boolean => {
    const nonEditableKeys = [
      STORAGE_KEYS.CACHE_TIMESTAMP,
      STORAGE_KEYS.APP_VERSION,
      STORAGE_KEYS.APP_FIRST_LAUNCH,
    ];
    return !nonEditableKeys.includes(key as any);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStorageData();
    setRefreshing(false);
  };

  const copyToClipboard = async (data: any, title: string) => {
    try {
      await Clipboard.setString(JSON.stringify(data, null, 2));
      Alert.alert('Başarılı', `${title} kopyalandı`);
    } catch (error) {
      Alert.alert('Hata', 'Kopyalama başarısız oldu');
    }
  };

  const clearAllStorage = async () => {
    Alert.alert(
      'Tüm Verileri Temizle',
      'Bu işlem tüm saklanan verileri silecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await storage.clear();
              Alert.alert('Başarılı', 'Tüm veriler temizlendi');
              await fetchStorageData();
            } catch (error) {
              Alert.alert('Hata', 'Veriler temizlenirken bir hata oluştu');
            }
          },
        },
      ]
    );
  };



  const StorageCard = ({ item }: { item: StorageData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState('');
    const [viewMode, setViewMode] = useState<'text' | 'json'>('text');

    const handleEdit = () => {
      setEditedData(JSON.stringify(item.data, null, 2));
      setIsEditing(true);
    };

    const handleSave = async () => {
      try {
        let parsedData;
        try {
          parsedData = JSON.parse(editedData);
        } catch {
          // Try as string if JSON parse fails
          parsedData = editedData;
        }

        await storage.set(item.key as any, parsedData);
        Alert.alert('Başarılı', 'Veriler başarıyla güncellendi');
        setIsEditing(false);
        await fetchStorageData();
      } catch (error) {
        Alert.alert('Hata', 'Veriler güncellenirken bir hata oluştu');
      }
    };

    const handleDelete = async () => {
      Alert.alert(
        'Veriyi Sil',
        `${item.title} verisini silmek istediğinizden emin misiniz?`,
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              try {
                await storage.remove(item.key as any);
                Alert.alert('Başarılı', 'Veri başarıyla silindi');
                await fetchStorageData();
              } catch (error) {
                Alert.alert('Hata', 'Veri silinirken bir hata oluştu');
              }
            },
          },
        ]
      );
    };

    const formatJSON = (data: any): string => {
      if (typeof data !== 'object' || data === null) {
        return String(data);
      }
      
      try {
        return JSON.stringify(data, null, 2);
      } catch (e) {
        return String(data);
      }
    };

    const toggleViewMode = () => {
      setViewMode(viewMode === 'text' ? 'json' : 'text');
    };

    return (
      <View style={[styles.storageCard, { 
        backgroundColor: ourColors.card,
        borderColor: ourColors.cardBorder,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
          },
          android: {
            elevation: 2,
          },
        }),
      }]}>
        <View style={styles.storageCardHeader}>
          <Text style={[styles.storageTitle, { color: ourColors.text }]}>{item.title}</Text>
          <View style={styles.buttonContainer}>
            {isEditing ? (
              <>
                <TouchableOpacity 
                  onPress={handleSave}
                  style={[styles.button, { backgroundColor: ourColors.success }]}
                >
                  <Text style={styles.buttonText}>Kaydet</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setIsEditing(false)}
                  style={[styles.button, { backgroundColor: ourColors.textSecondary }]}
                >
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  onPress={toggleViewMode}
                  style={[styles.button, { backgroundColor: '#6366F1' }]}
                >
                  <Text style={styles.buttonText}>
                    {viewMode === 'text' ? 'JSON' : 'Text'}
                  </Text>
                </TouchableOpacity>
                {item.isEditable && (
                  <TouchableOpacity 
                    onPress={handleEdit}
                    style={[styles.button, { backgroundColor: ourColors.warning }]}
                  >
                    <Text style={styles.buttonText}>Düzenle</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => copyToClipboard(item.data, item.title)}
                  style={[styles.button, { backgroundColor: ourColors.primary }]}
                >
                  <Text style={styles.buttonText}>Kopyala</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDelete}
                  style={[styles.button, { backgroundColor: ourColors.danger }]}
                >
                  <Text style={styles.buttonText}>Sil</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <ScrollView 
          style={[styles.dataContainer, { backgroundColor: ourColors.surface }]}
          nestedScrollEnabled={true}
        >
          {isEditing ? (
            <TextInput
              style={[styles.dataInput, { color: ourColors.textSecondary }]}
              multiline
              value={editedData}
              onChangeText={setEditedData}
              placeholder="JSON formatında veri girin..."
              placeholderTextColor={ourColors.textSecondary}
            />
          ) : viewMode === 'text' ? (
            <Text style={[styles.dataText, { color: ourColors.textSecondary }]}>
              {formatJSON(item.data)}
            </Text>
          ) : (
            <View style={styles.jsonViewerContainer}>
              <JSONViewer data={item.data} />
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: ourColors.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={ourColors.background} />
      
      {/* Header with Back Button */}
      <View style={[styles.header, { 
        backgroundColor: ourColors.background, 
        borderBottomColor: ourColors.cardBorder 
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
        <Text style={[styles.headerTitle, { color: ourColors.text }]}>Developer Resources</Text>
      </View>

      <ScrollView 
        style={[styles.content, { backgroundColor: ourColors.background }]}
        contentContainerStyle={{
          paddingBottom: 120 // Tab bar + extra space
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={ourColors.primary}
            colors={[ourColors.primary]}
          />
        }
      >
        {/* Storage Section */}
        <View style={[styles.section, { backgroundColor: ourColors.background }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: ourColors.text }]}>Storage Verileri</Text>
          </View>
          <Text style={[styles.description, { color: ourColors.textSecondary }]}>
            Uygulama içinde gerçekten saklanan veriler aşağıda listelenmiştir.
          </Text>
          
          {storageData.length === 0 ? (
            <View style={[styles.emptyContainer, { backgroundColor: ourColors.card, borderColor: ourColors.cardBorder }]}>
              <Text style={[styles.emptyText, { color: ourColors.textSecondary }]}>
                Henüz hiç veri kaydedilmemiş.
              </Text>
              <Text style={[styles.emptySubtext, { color: ourColors.textSecondary }]}>
                Onboarding sürecini tamamlayın veya uygulamayı kullanmaya başlayın.
              </Text>
            </View>
          ) : (
            storageData.map((item, index) => (
              <StorageCard key={index} item={item} />
            ))
          )}
        </View>

        {/* Tools Section */}
        <View style={[styles.section, { backgroundColor: ourColors.background, marginTop: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: ourColors.text }]}>Araçlar</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: ourColors.cardBorder }]}
            onPress={onRefresh}
          >
            <Text style={[styles.menuItemText, { color: ourColors.text }]}>Verileri Yenile</Text>
            <View style={styles.menuItemRight}>
              <SvgXml xml={arrowRightIcon.replace(/currentColor/g, ourColors.text)} width={24} height={24} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, { borderBottomColor: ourColors.cardBorder }]}
            onPress={clearAllStorage}
          >
            <Text style={[styles.menuItemText, { color: ourColors.danger }]}>Tüm Verileri Temizle</Text>
            <View style={styles.menuItemRight}>
              <SvgXml xml={arrowRightIcon.replace(/currentColor/g, ourColors.danger)} width={24} height={24} />
            </View>
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  storageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  storageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  dataContainer: {
    maxHeight: 200,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  dataText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    lineHeight: 20,
  },
  dataInput: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  jsonViewerContainer: {
    padding: 4,
  },
  jsonKey: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '600',
  },
  jsonString: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  jsonNumber: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  jsonBoolean: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '600',
  },
  jsonNull: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontStyle: 'italic',
  },
  jsonUndefined: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontStyle: 'italic',
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
  emptyContainer: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
});

export default DeveloperResourcesScreen;
