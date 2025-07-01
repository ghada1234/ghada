'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { lang, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label={t('header.toggleLanguage')}>
      <Globe className="h-5 w-5" />
    </Button>
  );
}
