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
        <CardContent>
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <Avatar className="h-40 w-40">
                <AvatarImage
                  src="https://placehold.co/200x200.png"
                  alt="Ghada Al-Ani"
                  data-ai-hint="woman portrait"
                />
                <AvatarFallback>
                  <User className="h-20 w-20" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-4">
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
