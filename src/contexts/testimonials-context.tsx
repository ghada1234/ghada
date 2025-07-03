'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface Testimonial {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  text: string;
}

interface TestimonialContextType {
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

const TESTIMONIALS_STORAGE_KEY = 'nutrisnap_testimonials';

export const TestimonialProvider = ({ children }: { children: ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    try {
      const storedTestimonials = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
      if (storedTestimonials) {
        setTestimonials(JSON.parse(storedTestimonials));
      }
    } catch (error) {
      console.error("Failed to load testimonials from localStorage", error);
    }
  }, []);

  const addTestimonial = useCallback((testimonialData: Omit<Testimonial, 'id'>) => {
    const newTestimonial: Testimonial = {
      ...testimonialData,
      id: new Date().toISOString() + Math.random(),
    };

    setTestimonials(prevTestimonials => {
      const updatedTestimonials = [...prevTestimonials, newTestimonial];
      try {
        localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(updatedTestimonials));
      } catch (error) {
        console.error("Failed to save testimonials to localStorage", error);
      }
      return updatedTestimonials;
    });
  }, []);

  const value = {
    testimonials,
    addTestimonial,
  };

  return (
    <TestimonialContext.Provider value={value}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (context === undefined) {
    throw new Error('useTestimonials must be used within a TestimonialProvider');
  }
  return context;
};
