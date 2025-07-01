'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

type Dictionary = typeof en;
type Language = 'en' | 'ar';

interface LanguageContextType {
  lang: Language;
  dictionary: Dictionary;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries = { en, ar };

function getDescendantProp(obj: any, desc: string): any {
  const arr = desc.split('.');
  let current = obj;
  for (let i = 0; i < arr.length; i++) {
    if (current === undefined) return undefined;
    current = current[arr[i]];
  }
  return current;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Read initial language from cookie, default to 'ar'
  const [lang, setLang] = useState<Language>(() => {
    const cookieLang = Cookies.get('lang');
    return cookieLang === 'en' ? 'en' : 'ar';
  });

  // Effect to update document direction when language changes
  useEffect(() => {
    const newDir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = newDir;
    document.documentElement.lang = lang;
  }, [lang]);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    Cookies.set('lang', newLang, { expires: 365 });
    // Reload to apply server-side rendering with the new language direction
    window.location.reload();
  };
  
  const t = (key: string): string => {
    const dictionary = dictionaries[lang];
    const value = getDescendantProp(dictionary, key);
    return value || key;
  };

  const value = {
    lang,
    dictionary: dictionaries[lang],
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
