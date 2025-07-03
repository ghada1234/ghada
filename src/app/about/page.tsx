'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{t('about.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <Image
                src="https://placehold.co/400x400.png"
                alt="Ghada Al-Ani"
                width={400}
                height={400}
                className="rounded-lg object-cover shadow-lg"
                data-ai-hint="woman portrait"
              />
            </div>
            <div className="space-y-4 md:col-span-2">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('about.story.p1')}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('about.story.p2')}
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {t('about.story.p3')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
