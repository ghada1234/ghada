'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import LanguageSwitcher from './language-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher />
        <Button>{t('header.login')}</Button>
      </div>
    </header>
  );
}
