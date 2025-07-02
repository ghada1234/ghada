'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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

interface UserSettingsContextType {
  dailyGoals: DailyGoals;
  updateGoals: (newGoals: Partial<DailyGoals>) => void;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'nutrisnap_user_settings';

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(DEFAULT_GOALS);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        // Merge stored settings with defaults to ensure all keys are present
        const parsedSettings = JSON.parse(storedSettings);
        setDailyGoals(currentGoals => ({ ...currentGoals, ...parsedSettings }));
      }
    } catch (error) {
      console.error("Failed to load user settings from localStorage", error);
    }
  }, []);

  const updateGoals = useCallback((newGoals: Partial<DailyGoals>) => {
    setDailyGoals(prevGoals => {
      const updatedGoals = { ...prevGoals, ...newGoals };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedGoals));
      } catch (error) {
        console.error("Failed to save user settings to localStorage", error);
      }
      return updatedGoals;
    });
  }, []);

  const value = {
    dailyGoals,
    updateGoals,
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
