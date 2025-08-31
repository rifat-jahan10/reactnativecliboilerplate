import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, STORAGE_CONFIG, StorageKey, StorageValue } from '../config/storage';

export class StorageManager {
  private static prefix = STORAGE_CONFIG.PREFIX;

  static getKey(key: StorageKey): string {
    return `${this.prefix}${key}`;
  }

  static async get<T extends StorageValue = StorageValue>(
    key: StorageKey,
    parseJson: boolean = false
  ): Promise<T | null> {
    try {
      const prefixedKey = this.getKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      
      if (value === null) return null;
      
      if (parseJson) {
        try {
          return JSON.parse(value) as T;
        } catch {
          return value as T;
        }
      }
      
      return value as T;
    } catch (error) {
      console.error(`Storage get error for key ${key}:`, error);
      return null;
    }
  }

  static async set<T extends StorageValue = StorageValue>(
    key: StorageKey,
    value: T
  ): Promise<boolean> {
    try {
      const prefixedKey = this.getKey(key);
      
      if (value === null) {
        await AsyncStorage.removeItem(prefixedKey);
        return true;
      }
      
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
      await AsyncStorage.setItem(prefixedKey, valueToStore);
      return true;
    } catch (error) {
      console.error(`Storage set error for key ${key}:`, error);
      return false;
    }
  }

  static async remove(key: StorageKey): Promise<boolean> {
    try {
      const prefixedKey = this.getKey(key);
      await AsyncStorage.removeItem(prefixedKey);
      return true;
    } catch (error) {
      console.error(`Storage remove error for key ${key}:`, error);
      return false;
    }
  }

  static async multiGet<T extends Record<string, StorageValue>>(
    keys: StorageKey[],
    parseJson: boolean = false
  ): Promise<Partial<T>> {
    try {
      const prefixedKeys = keys.map(key => this.getKey(key));
      const values = await AsyncStorage.multiGet(prefixedKeys);
      const result: Partial<T> = {};
      
      values.forEach(([key, value]) => {
        if (value !== null) {
          const originalKey = key.replace(this.prefix, '');
          
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
      
      return result;
    } catch (error) {
      console.error('Storage multiGet error:', error);
      return {};
    }
  }

  static async multiSet<T extends Record<string, StorageValue>>(
    keyValuePairs: Record<string, T[keyof T]>
  ): Promise<boolean> {
    try {
      const pairs: [string, string][] = [];
      
      Object.entries(keyValuePairs).forEach(([key, value]) => {
        if (value !== null) {
          const prefixedKey = this.getKey(key as StorageKey);
          const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
          pairs.push([prefixedKey, valueToStore]);
        }
      });
      
      if (pairs.length > 0) {
        await AsyncStorage.multiSet(pairs);
      }
      
      return true;
    } catch (error) {
      console.error('Storage multiSet error:', error);
      return false;
    }
  }

  static async clear(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(prefixedKeys);
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  }

  static async getAllKeys(): Promise<StorageKey[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, '') as StorageKey);
    } catch (error) {
      console.error('Storage getAllKeys error:', error);
      return [];
    }
  }

  static async getSize(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await this.get(key);
        if (value) {
          totalSize += JSON.stringify(value).length;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Storage getSize error:', error);
      return 0;
    }
  }

  static async isKeyExists(key: StorageKey): Promise<boolean> {
    try {
      const prefixedKey = this.getKey(key);
      const value = await AsyncStorage.getItem(prefixedKey);
      return value !== null;
    } catch (error) {
      console.error(`Storage isKeyExists error for key ${key}:`, error);
      return false;
    }
  }
}

export const storage = StorageManager;
