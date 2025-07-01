'use client';

import Link from 'next/link';
import { CookingPot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/language-context';
import LanguageSwitcher from './language-switcher';

export default function Header() {
  const { t, lang } = useLanguage();

  const navLinks = [
    { href: '/dashboard', label: t('header.dashboard') },
    { href: '/add-food', label: t('header.addFood') },
    { href: '/meal-planner', label: t('header.mealPlanner') },
  ];

  const titleLink = (
    <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
      <CookingPot className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl">{t('header.title')}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
          {titleLink}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side={lang === 'ar' ? 'right' : 'left'}>
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/dashboard" className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CookingPot className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl">{t('header.title')}</span>
              </Link>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Mobile Title */}
        <div className="flex items-center gap-2 md:hidden">
          {titleLink}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher />
        <Button>{t('header.login')}</Button>
      </div>
    </header>
  );
}
