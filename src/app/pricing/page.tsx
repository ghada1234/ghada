
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';

export default function PricingPage() {
  const { t } = useLanguage();

  const freeFeatures = t('pricing.free.features') as any[];
  const proFeatures = t('pricing.pro.features') as any[];

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline">
          {t('pricing.title')}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {t('pricing.subtitle')}
        </p>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>{t('pricing.announcement.title')}</AlertTitle>
        <AlertDescription>
          {t('pricing.announcement.description')}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('pricing.free.title')}</CardTitle>
            <CardDescription>{t('pricing.free.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {t('pricing.free.price')}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </div>
            <ul className="space-y-2">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">{t('pricing.free.button')}</Button>
          </CardFooter>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>{t('pricing.pro.title')}</CardTitle>
            <CardDescription>{t('pricing.pro.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {t('pricing.pro.price')}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </div>
            <ul className="space-y-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full cursor-default">
              {t('pricing.pro.button')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
