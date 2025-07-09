'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/language-context';
import Image from 'next/image';

const AdBanner = () => {
  const { t } = useLanguage();

  return (
    <Card className="w-full border-dashed border-primary/50 bg-primary/5">
      <CardContent className="p-4">
        <a 
          href="#" 
          onClick={(e) => e.preventDefault()} 
          className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left"
        >
          <Image
            src="https://placehold.co/300x250.png"
            data-ai-hint="advertisement product"
            alt="Advertisement"
            width={150}
            height={125}
            className="rounded-md object-cover"
          />
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {t('ads.title')}
            </p>
            <h4 className="text-lg font-semibold">{t('ads.headline')}</h4>
            <p className="text-sm text-muted-foreground">{t('ads.description')}</p>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default AdBanner;
