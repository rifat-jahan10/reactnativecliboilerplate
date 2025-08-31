export const STORAGE_KEYS = {
  // User related - Consolidated user data
  USER_DATA: 'user_data', // Ana user objesi - tüm onboarding verileri burada
  USER_TOKEN: 'user_token',
  USER_PROFILE: 'user_profile',
  USER_SETTINGS: 'user_settings',
  USER_PREFERENCES: 'user_preferences',
  
  // Legacy user onboarding data - backward compatibility için
  USER_DISPLAY_NAME: 'user_display_name',
  USER_GENDER: 'user_gender',
  USER_AGE: 'user_age',
  USER_HEIGHT: 'user_height',
  USER_WEIGHT: 'user_weight',
  USER_EXPERIENCE: 'user_experience',
  USER_EXERCISE_HOURS: 'user_exercise_hours',
  USER_FOCUS_AREAS: 'user_focus_areas',
  USER_SPORTS: 'user_sports',
  USER_ENVIRONMENT_PREFERENCE: 'user_environment_preference',
  USER_AIM: 'user_aim',
  
  // App related
  APP_LANGUAGE: 'app_language',
  APP_THEME: 'app_theme',
  APP_FIRST_LAUNCH: 'app_first_launch',
  APP_VERSION: 'app_version',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // OneSignal related
  ONESIGNAL_USER_ID: 'onesignal_user_id',
  ONESIGNAL_EMAIL: 'onesignal_email',
  ONESIGNAL_EXTERNAL_ID: 'onesignal_external_id',
  
  // Cache related
  CACHE_TIMESTAMP: 'cache_timestamp',
  CACHE_DATA: 'cache_data',
  
  // Form data
  FORM_DRAFTS: 'form_drafts',
  SEARCH_HISTORY: 'search_history',
  
  // Offline data
  OFFLINE_QUEUE: 'offline_queue',
  SYNC_STATUS: 'sync_status',
  
  // Developer mode
  DEVELOPER_MODE_ENABLED: 'developer_mode_enabled',
} as const;

export const STORAGE_CONFIG = {
  // Default values
  DEFAULT_LANGUAGE: 'tr',
  DEFAULT_THEME: 'system',
  
  // Cache expiration (24 hours in milliseconds)
  CACHE_EXPIRATION: 24 * 60 * 60 * 1000,
  
  // Max items in history
  MAX_HISTORY_ITEMS: 50,
  
  // Storage prefixes
  PREFIX: 'rn_boilerplate_',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type StorageValue = string | number | boolean | object | null;
