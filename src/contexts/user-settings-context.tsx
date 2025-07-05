'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

// Default goals
export const DEFAULT_GOALS = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fats: 70,
  fiber: 30,
  sodium: 2300,
  sugar: 50,
  potassium: 3500,
  vitaminC: 90,
  calcium: 1000,
  iron: 18,
};
export type DailyGoals = typeof DEFAULT_GOALS;

export interface UserProfile {
  name: string | null;
  avatar: string | null; // URL to avatar image
  dietaryPreference?: string | null;
  allergies?: string | null;
  likes?: string | null;
  dislikes?: string | null;
  positiveFeedbackOn?: string[];
  negativeFeedbackOn?: string[];
  weight?: number | null; // in kg
  height?: number | null; // in cm
  gender?: 'male' | 'female' | null;
}

export interface UserSettings {
  profile: UserProfile;
  dailyGoals: DailyGoals;
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    name: null,
    avatar: null,
    dietaryPreference: null,
    allergies: null,
    likes: null,
    dislikes: null,
    positiveFeedbackOn: [],
    negativeFeedbackOn: [],
    weight: null,
    height: null,
    gender: null,
  },
  dailyGoals: DEFAULT_GOALS,
};

interface UserSettingsContextType {
  settings: UserSettings;
  updateGoals: (newGoals: Partial<DailyGoals>) => void;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  addPositiveFeedback: (dishName: string) => void;
  addNegativeFeedback: (dishName: string) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(
  undefined
);

const SETTINGS_STORAGE_KEY = 'nutrisnap_user_settings';

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Deep merge with defaults to ensure all keys are present
        setSettings((currentSettings) => ({
          ...currentSettings,
          ...parsedSettings,
          profile: {
            ...DEFAULT_SETTINGS.profile,
            ...currentSettings.profile,
            ...parsedSettings.profile,
          },
          dailyGoals: {
            ...currentSettings.dailyGoals,
            ...parsedSettings.dailyGoals,
          },
        }));
      }
    } catch (error) {
      console.error('Failed to load user settings from localStorage', error);
    }
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save user settings to localStorage', error);
    }
  };

  const updateGoals = useCallback((newGoals: Partial<DailyGoals>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        dailyGoals: { ...prevSettings.dailyGoals, ...newGoals },
      };
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, []);

  const updateProfile = useCallback((newProfile: Partial<UserProfile>) => {
    setSettings((prevSettings) => {
      const updatedSettings = {
        ...prevSettings,
        profile: { ...prevSettings.profile, ...newProfile },
      };
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, []);

  const addPositiveFeedback = useCallback((dishName: string) => {
    setSettings((prevSettings) => {
      const updatedProfile = {
        ...prevSettings.profile,
        positiveFeedbackOn: Array.from(
          new Set([...(prevSettings.profile.positiveFeedbackOn || []), dishName])
        ),
      };
      const updatedSettings = { ...prevSettings, profile: updatedProfile };
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, []);

  const addNegativeFeedback = useCallback((dishName: string) => {
    setSettings((prevSettings) => {
      const updatedProfile = {
        ...prevSettings.profile,
        negativeFeedbackOn: Array.from(
          new Set([...(prevSettings.profile.negativeFeedbackOn || []), dishName])
        ),
      };
      const updatedSettings = { ...prevSettings, profile: updatedProfile };
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, []);


  const value = {
    settings,
    updateGoals,
    updateProfile,
    addPositiveFeedback,
    addNegativeFeedback,
  };

  return (
    <UserSettingsContext.Provider value={value}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error('useUserSettings must be used within a UserSettingsProvider');
  }
  return context;
};
