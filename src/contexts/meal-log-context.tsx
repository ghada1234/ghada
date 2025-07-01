'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { NutritionalInfo } from '@/ai/schemas';

export type LoggedMeal = NutritionalInfo & {
  id: string;
  photoDataUri?: string | null;
  loggedAt: string;
};

interface MealLogContextType {
  loggedMeals: LoggedMeal[];
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'loggedAt'>) => void;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

const MEAL_LOG_STORAGE_KEY = 'nutrisnap_meal_log';

export const MealLogProvider = ({ children }: { children: ReactNode }) => {
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);

  useEffect(() => {
    try {
      const storedMeals = localStorage.getItem(MEAL_LOG_STORAGE_KEY);
      if (storedMeals) {
        setLoggedMeals(JSON.parse(storedMeals));
      }
    } catch (error) {
      console.error("Failed to load meals from localStorage", error);
    }
  }, []);

  const addMeal = useCallback((mealData: Omit<LoggedMeal, 'id' | 'loggedAt'>) => {
    const newMeal: LoggedMeal = {
      ...mealData,
      id: new Date().toISOString() + Math.random(),
      loggedAt: new Date().toISOString(),
    };

    setLoggedMeals(prevMeals => {
      const updatedMeals = [...prevMeals, newMeal];
      try {
        localStorage.setItem(MEAL_LOG_STORAGE_KEY, JSON.stringify(updatedMeals));
      } catch (error) {
        console.error("Failed to save meals to localStorage", error);
      }
      return updatedMeals;
    });
  }, []);

  const value = {
    loggedMeals,
    addMeal,
  };

  return (
    <MealLogContext.Provider value={value}>
      {children}
    </MealLogContext.Provider>
  );
};

export const useMealLog = () => {
  const context = useContext(MealLogContext);
  if (context === undefined) {
    throw new Error('useMealLog must be used within a MealLogProvider');
  }
  return context;
};
