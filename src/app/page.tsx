'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 text-center">
      <div className="flex items-center justify-center mb-6">
        <Leaf className="h-16 w-16 text-primary" />
        <h1 className="ml-4 text-5xl font-bold font-headline tracking-tighter">
          {t('metadata.title')}
        </h1>
      </div>
      <p className="max-w-2xl mx-auto mb-8 text-lg text-muted-foreground">
        {t('home.subtitle')}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link href="/register">{t('home.getStarted')}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/login">{t('header.login')}</Link>
        </Button>
      </div>
    </div>
  );
}
