import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, STORAGE_CONFIG, StorageKey, StorageValue } from '../config/storage';

interface UseStorageOptions {
  defaultValue?: StorageValue;
  parseJson?: boolean;
}

export const useStorage = <T extends StorageValue = StorageValue>(
  key: StorageKey,
  options: UseStorageOptions = {}
) => {
  const { defaultValue, parseJson = false } = options;
  const [value, setValue] = useState<T | null>(defaultValue as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prefixedKey = `${STORAGE_CONFIG.PREFIX}${key}`;

  const getValue = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedValue = await AsyncStorage.getItem(prefixedKey);
      
      if (storedValue === null) {
        setValue(defaultValue as T);
        return;
      }

      if (parseJson) {
        try {
          const parsedValue = JSON.parse(storedValue);
          setValue(parsedValue);
        } catch (parseError) {
          setError('Failed to parse stored value');
          setValue(defaultValue as T);
        }
      } else {
        setValue(storedValue as T);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Storage error');
      setValue(defaultValue as T);
    } finally {
      setLoading(false);
    }
  }, [prefixedKey, defaultValue, parseJson]);

  const setValueToStorage = useCallback(async (newValue: T) => {
    try {
      setError(null);
      
      if (newValue === null) {
        await AsyncStorage.removeItem(prefixedKey);
        setValue(null);
        return;
      }

      const valueToStore = parseJson ? JSON.stringify(newValue) : String(newValue);
      await AsyncStorage.setItem(prefixedKey, valueToStore);
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to storage');
    }
  }, [prefixedKey, parseJson]);

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(prefixedKey);
      setValue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from storage');
    }
  }, [prefixedKey]);

  const clearAll = useCallback(async () => {
    try {
      setError(null);
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(k => k.startsWith(STORAGE_CONFIG.PREFIX));
      await AsyncStorage.multiRemove(prefixedKeys);
      setValue(defaultValue as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear storage');
    }
  }, [defaultValue]);

  useEffect(() => {
    getValue();
  }, [getValue]);

  return {
    value,
    setValue: setValueToStorage,
    removeValue,
    clearAll,
    loading,
    error,
    refresh: getValue,
  };
};

export const useStorageMulti = <T extends Record<string, StorageValue>>(
  keys: StorageKey[],
  options: UseStorageOptions = {}
) => {
  const { defaultValue, parseJson = false } = options;
  const [values, setValues] = useState<T | null>(defaultValue as T);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const prefixedKeys = keys.map(key => `${STORAGE_CONFIG.PREFIX}${key}`);

  const getValues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedValues = await AsyncStorage.multiGet(prefixedKeys);
      const result: Partial<T> = {};
      
      storedValues.forEach(([key, value]) => {
        if (value !== null) {
          const originalKey = key.replace(STORAGE_CONFIG.PREFIX, '');
          
          if (parseJson) {
            try {
              result[originalKey as keyof T] = JSON.parse(value);
            } catch {
              result[originalKey as keyof T] = value as T[keyof T];
            }
          } else {
            result[originalKey as keyof T] = value as T[keyof T];
          }
        }
      });
      
      setValues(result as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Storage error');
      setValues(defaultValue as T);
    } finally {
      setLoading(false);
    }
  }, [prefixedKeys, defaultValue, parseJson]);

  const setValuesToStorage = useCallback(async (newValues: Partial<T>) => {
    try {
      setError(null);
      
      const keyValuePairs: [string, string][] = [];
      
      Object.entries(newValues).forEach(([key, value]) => {
        if (value !== null) {
          const prefixedKey = `${STORAGE_CONFIG.PREFIX}${key}`;
          const valueToStore = parseJson ? JSON.stringify(value) : String(value);
          keyValuePairs.push([prefixedKey, valueToStore]);
        }
      });
      
      if (keyValuePairs.length > 0) {
        await AsyncStorage.multiSet(keyValuePairs);
      }
      
      setValues(prev => ({ ...prev, ...newValues } as T));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to storage');
    }
  }, [parseJson]);

  useEffect(() => {
    getValues();
  }, [getValues]);

  return {
    values,
    setValues: setValuesToStorage,
    loading,
    error,
    refresh: getValues,
  };
};
