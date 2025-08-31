import React, { createContext, useContext } from 'react';
import { useOneSignal } from '../hooks/useOneSignal';

interface OneSignalContextType {
  isInitialized: boolean;
  userId: string | null;
  hasNotificationPermission: boolean;
  setEmail: (email: string) => Promise<boolean>;
  setExternalUserId: (externalId: string) => Promise<boolean>;
  sendNotification: (playerId: string, title: string, message: string) => Promise<boolean>;
}

const OneSignalContext = createContext<OneSignalContextType | undefined>(undefined);

interface OneSignalProviderProps {
  children: React.ReactNode;
}

export const OneSignalProvider: React.FC<OneSignalProviderProps> = ({ children }) => {
  const oneSignalHook = useOneSignal();

  return (
    <OneSignalContext.Provider value={oneSignalHook}>
      {children}
    </OneSignalContext.Provider>
  );
};

export const useOneSignalContext = (): OneSignalContextType => {
  const context = useContext(OneSignalContext);
  if (!context) {
    throw new Error('useOneSignalContext must be used within a OneSignalProvider');
  }
  return context;
}; 