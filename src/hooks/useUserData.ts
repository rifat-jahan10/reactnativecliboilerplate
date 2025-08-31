import { useState, useEffect, useCallback } from 'react';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@config/storage';
import { UserData, UserUpdateData, createEmptyUserData, updateUserData } from '@/types/user';

interface UseUserDataReturn {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  updateUser: (updates: UserUpdateData) => Promise<boolean>;
  getUserData: () => Promise<UserData | null>;
  clearUserData: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

export const useUserData = (): UseUserDataReturn => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User data'yı storage'dan getir
  const getUserData = useCallback(async (): Promise<UserData | null> => {
    try {
      setError(null);
      const storedUserData = await storage.get<UserData>(STORAGE_KEYS.USER_DATA, true);
      
      if (!storedUserData) {
        // İlk kez kullanılıyorsa boş user data oluştur
        const emptyUserData = createEmptyUserData();
        await storage.set(STORAGE_KEYS.USER_DATA, emptyUserData);
        return emptyUserData;
      }
      
      return storedUserData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'User data getirme hatası';
      setError(errorMessage);
      console.error('useUserData: getUserData error:', err);
      return null;
    }
  }, []);

  // User data'yı güncelle
  const updateUser = useCallback(async (updates: UserUpdateData): Promise<boolean> => {
    try {
      setError(null);
      
      let currentUserData = userData;
      if (!currentUserData) {
        currentUserData = await getUserData();
        if (!currentUserData) {
          currentUserData = createEmptyUserData();
        }
      }

      const updatedUserData = updateUserData(currentUserData, updates);
      const success = await storage.set(STORAGE_KEYS.USER_DATA, updatedUserData);
      
      if (success) {
        setUserData(updatedUserData);
        console.log('User data updated:', updatedUserData);
        return true;
      } else {
        setError('User data güncellenemedi');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'User data güncelleme hatası';
      setError(errorMessage);
      console.error('useUserData: updateUser error:', err);
      return false;
    }
  }, [userData, getUserData]);

  // User data'yı temizle
  const clearUserData = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const success = await storage.remove(STORAGE_KEYS.USER_DATA);
      
      if (success) {
        setUserData(null);
        console.log('User data cleared');
        return true;
      } else {
        setError('User data temizlenemedi');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'User data temizleme hatası';
      setError(errorMessage);
      console.error('useUserData: clearUserData error:', err);
      return false;
    }
  }, []);

  // User data'yı yenile
  const refreshUserData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const refreshedUserData = await getUserData();
      setUserData(refreshedUserData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'User data yenileme hatası';
      setError(errorMessage);
      console.error('useUserData: refreshUserData error:', err);
    } finally {
      setLoading(false);
    }
  }, [getUserData]);

  // Component mount olduğunda user data'yı getir
  useEffect(() => {
    refreshUserData();
  }, [refreshUserData]);

  return {
    userData,
    loading,
    error,
    updateUser,
    getUserData,
    clearUserData,
    refreshUserData,
  };
};
