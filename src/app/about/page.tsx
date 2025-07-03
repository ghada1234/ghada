'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

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
            <div className="flex justify-center items-center md:col-span-1">
              <Avatar className="h-64 w-64 shadow-lg">
                <AvatarImage
                  src="https://placehold.co/400x400.png"
                  alt="Ghada Al-Ani"
                  data-ai-hint="woman portrait"
                  className="object-cover"
                />
                <AvatarFallback>
                  <User className="h-32 w-32" />
                </AvatarFallback>
              </Avatar>
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
