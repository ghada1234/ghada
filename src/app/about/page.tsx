'use client';

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
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('about.story.p1')}
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('about.story.p2')}
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t('about.story.p3')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
