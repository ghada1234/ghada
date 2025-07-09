'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {t('about.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert mx-auto max-w-full text-lg leading-relaxed text-muted-foreground">
            <p>
              {t('about.story.p1')}
            </p>
            <p>
              {t('about.story.p2')}
            </p>
            <p>
              {t('about.story.p3')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
