export interface UserData {
  // Basic info
  displayName: string | null;
  gender: number | null; // 0 = male, 1 = female
  age: number | null;
  
  // Physical info
  height: {
    cm: number;
    feet?: number;
    inches?: number;
    isMetric: boolean;
  } | null;
  
  weight: {
    kg: number;
    lbs?: number;
    isMetric: boolean;
  } | null;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
  // Onboarding progress
  onboardingCompleted: boolean;
  onboardingStep: string | null;
}

export interface UserUpdateData {
  displayName?: string;
  gender?: number;
  age?: number;
  height?: {
    cm: number;
    feet?: number;
    inches?: number;
    isMetric: boolean;
  };
  weight?: {
    kg: number;
    lbs?: number;
    isMetric: boolean;
  };
  onboardingCompleted?: boolean;
  onboardingStep?: string;
}

// Helper functions for user data
export const createEmptyUserData = (): UserData => ({
  displayName: null,
  gender: null,
  age: null,
  height: null,
  weight: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  onboardingCompleted: false,
  onboardingStep: null,
});

export const updateUserData = (currentData: UserData, updates: UserUpdateData): UserData => ({
  ...currentData,
  ...updates,
  updatedAt: new Date().toISOString(),
});
