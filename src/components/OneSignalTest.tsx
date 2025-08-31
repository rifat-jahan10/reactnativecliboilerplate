import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useOneSignalContext } from './OneSignalProvider';
import { useI18nContext } from './I18nProvider';

export const OneSignalTest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [externalId, setExternalId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const { t } = useI18nContext();
  const {
    isInitialized,
    userId,
    hasNotificationPermission,
    setEmail: setOneSignalEmail,
    setExternalUserId,
    sendNotification,
  } = useOneSignalContext();

  const handleSetEmail = async () => {
    if (email.trim()) {
      const success = await setOneSignalEmail(email.trim());
      if (success) {
        Alert.alert(t('common.success'), t('onesignal.emailSet'));
      }
    }
  };

  const handleSetExternalId = async () => {
    if (externalId.trim()) {
      const success = await setExternalUserId(externalId.trim());
      if (success) {
        Alert.alert(t('common.success'), t('onesignal.externalIdSet'));
      }
    }
  };

  const handleSendNotification = async () => {
    if (playerId.trim() && message.trim()) {
      const success = await sendNotification(playerId.trim(), title.trim() || 'Test', message.trim());
      if (success) {
        Alert.alert(t('common.success'), t('onesignal.notificationSent'));
      } else {
        Alert.alert(t('common.error'), t('onesignal.notificationFailed'));
      }
    }
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.status}>{t('onesignal.initializing')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('onesignal.title')}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>{t('onesignal.status')}:</Text>
        <Text style={styles.value}>
          {isInitialized ? t('onesignal.initialized') : t('onesignal.initializing')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('onesignal.userId')}:</Text>
        <Text style={styles.value}>{userId || t('onesignal.notAssigned')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('onesignal.notificationPermission')}:</Text>
        <Text style={styles.value}>
          {hasNotificationPermission ? t('onesignal.granted') : t('onesignal.notGranted')}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('onesignal.email')}:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={t('onesignal.enterEmail')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleSetEmail}>
          <Text style={styles.buttonText}>{t('onesignal.setEmail')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('onesignal.externalId')}:</Text>
        <TextInput
          style={styles.input}
          value={externalId}
          onChangeText={setExternalId}
          placeholder={t('onesignal.enterExternalId')}
        />
        <TouchableOpacity style={styles.button} onPress={handleSetExternalId}>
          <Text style={styles.buttonText}>{t('onesignal.setExternalId')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>{t('onesignal.testNotification')}:</Text>
        <TextInput
          style={styles.input}
          value={playerId}
          onChangeText={setPlayerId}
          placeholder={t('onesignal.enterPlayerId')}
        />
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder={t('onesignal.titleOptional')}
        />
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={t('onesignal.enterMessage')}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSendNotification}>
          <Text style={styles.buttonText}>{t('onesignal.sendNotification')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
  },
}); 