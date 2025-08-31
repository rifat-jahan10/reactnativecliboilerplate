import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
import { useStorage } from '../hooks/useStorage';
import { STORAGE_KEYS } from '../config/storage';
import { storage } from '../utils/storage';

export const StorageTest: React.FC = () => {
  const [inputKey, setInputKey] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedKey, setSelectedKey] = useState<keyof typeof STORAGE_KEYS>('USER_TOKEN');
  
  const userToken = useStorage(STORAGE_KEYS.USER_TOKEN, { defaultValue: '', parseJson: false });
  const userProfile = useStorage(STORAGE_KEYS.USER_PROFILE, { defaultValue: null, parseJson: true });
  const appLanguage = useStorage(STORAGE_KEYS.APP_LANGUAGE, { defaultValue: 'tr', parseJson: false });
  const appTheme = useStorage(STORAGE_KEYS.APP_THEME, { defaultValue: 'system', parseJson: false });

  const handleSetValue = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Hata', 'Lütfen bir key girin');
      return;
    }

    const success = await storage.set(inputKey as any, inputValue);
    if (success) {
      Alert.alert('Başarılı', 'Değer kaydedildi');
      setInputValue('');
    } else {
      Alert.alert('Hata', 'Değer kaydedilemedi');
    }
  };

  const handleGetValue = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Hata', 'Lütfen bir key girin');
      return;
    }

    const value = await storage.get(inputKey as any);
    Alert.alert('Değer', value ? String(value) : 'Değer bulunamadı');
  };

  const handleRemoveValue = async () => {
    if (!inputKey.trim()) {
      Alert.alert('Hata', 'Lütfen bir key girin');
      return;
    }

    const success = await storage.remove(inputKey as any);
    if (success) {
      Alert.alert('Başarılı', 'Değer silindi');
      setInputValue('');
    } else {
      Alert.alert('Hata', 'Değer silinemedi');
    }
  };

  const handleClearAll = async () => {
    Alert.alert(
      'Tüm Storage Temizle',
      'Tüm storage verileri silinecek. Emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            const success = await storage.clear();
            if (success) {
              Alert.alert('Başarılı', 'Tüm storage temizlendi');
            } else {
              Alert.alert('Hata', 'Storage temizlenemedi');
            }
          },
        },
      ]
    );
  };

  const handleGetAllKeys = async () => {
    const keys = await storage.getAllKeys();
    Alert.alert('Tüm Keys', keys.join('\n') || 'Key bulunamadı');
  };

  const handleGetSize = async () => {
    const size = await storage.getSize();
    Alert.alert('Storage Boyutu', `${size} bytes`);
  };

  const predefinedKeys = [
    { key: 'USER_TOKEN', label: 'User Token', storage: userToken },
    { key: 'USER_PROFILE', label: 'User Profile', storage: userProfile },
    { key: 'APP_LANGUAGE', label: 'App Language', storage: appLanguage },
    { key: 'APP_THEME', label: 'App Theme', storage: appTheme },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>AsyncStorage Test</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Storage Operations</Text>
        
        <TextInput
          style={styles.input}
          value={inputKey}
          onChangeText={setInputKey}
          placeholder="Storage key girin"
        />
        
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Storage value girin"
        />
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleSetValue}>
            <Text style={styles.buttonText}>Kaydet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleGetValue}>
            <Text style={styles.buttonText}>Getir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleRemoveValue}>
            <Text style={styles.buttonText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predefined Storage Keys</Text>
        
        {predefinedKeys.map(({ key, label, storage: storageHook }) => (
          <View key={key} style={styles.keyRow}>
            <Text style={styles.keyLabel}>{label}:</Text>
            <Text style={styles.keyValue}>
              {storageHook.loading ? 'Yükleniyor...' : 
               storageHook.value ? String(storageHook.value) : 'Değer yok'}
            </Text>
            {storageHook.error && (
              <Text style={styles.errorText}>Hata: {storageHook.error}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Management</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleGetAllKeys}>
            <Text style={styles.buttonText}>Tüm Keys</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleGetSize}>
            <Text style={styles.buttonText}>Boyut</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={[styles.button, styles.dangerButton]} onPress={handleClearAll}>
          <Text style={styles.buttonText}>Tümünü Temizle</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Info</Text>
        
        <Text style={styles.infoText}>
          Prefix: {storage.constructor.name}
        </Text>
        <Text style={styles.infoText}>
          Hook Count: {predefinedKeys.length}
        </Text>
        <Text style={styles.infoText}>
          Status: {predefinedKeys.some(k => k.storage.loading) ? 'Loading' : 'Ready'}
        </Text>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  keyRow: {
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  keyLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  keyValue: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});
