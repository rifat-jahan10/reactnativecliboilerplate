import OneSignal from 'react-native-onesignal';
import { ONESIGNAL_CONFIG } from '../config/onesignal';
import { useState, useEffect } from 'react';

export const useOneSignal = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);

  const initializeOneSignal = async () => {
    try {
      OneSignal.setAppId(ONESIGNAL_CONFIG.appId);

      OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent: any) => {
        console.log('OneSignal: notification will show in foreground:', notificationReceivedEvent);
        notificationReceivedEvent.preventDefault();
      });

      OneSignal.setNotificationOpenedHandler((notification: any) => {
        console.log('OneSignal: notification opened:', notification);
      });

      OneSignal.promptForPushNotificationsWithUserResponse((response: boolean) => {
        setHasNotificationPermission(response);
      });

      const deviceState = await OneSignal.getDeviceState();
      setUserId(deviceState?.userId || null);
      setIsInitialized(true);
    } catch (error) {
      console.error('OneSignal initialization error:', error);
    }
  };

  useEffect(() => {
    initializeOneSignal();
  }, []);

  const setEmail = async (email: string) => {
    try {
      await OneSignal.setEmail(email);
      return true;
    } catch (error) {
      console.error('Error setting email:', error);
      return false;
    }
  };

  const setExternalUserId = async (externalId: string) => {
    try {
      await OneSignal.setExternalUserId(externalId);
      return true;
    } catch (error) {
      console.error('Error setting external user ID:', error);
      return false;
    }
  };

  const sendNotification = async (playerId: string, title: string, message: string) => {
    try {
      const notification = {
        app_id: ONESIGNAL_CONFIG.appId,
        include_player_ids: [playerId],
        headings: { en: title },
        contents: { en: message },
      };

      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${ONESIGNAL_CONFIG.restApiKey}`,
        },
        body: JSON.stringify(notification),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  return {
    isInitialized,
    userId,
    hasNotificationPermission,
    setEmail,
    setExternalUserId,
    sendNotification,
  };
}; 