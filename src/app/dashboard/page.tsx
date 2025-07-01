'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">{t('dashboard.title')}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.macrosTitle')}</CardTitle>
            <CardDescription>{t('dashboard.macrosDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.calories')}</span>
                <span className="font-medium">1,234 / 2,000 kcal</span>
              </div>
              <Progress value={62} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.protein')}</span>
                <span className="font-medium">80 / 120 g</span>
              </div>
              <Progress value={66} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.carbs')}</span>
                <span className="font-medium">150 / 250 g</span>
              </div>
              <Progress value={60} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.fats')}</span>
                <span className="font-medium">45 / 70 g</span>
              </div>
              <Progress value={64} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.fiber')}</span>
                <span className="font-medium">15 / 30 g</span>
              </div>
              <Progress value={50} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.microsTitle')}</CardTitle>
            <CardDescription>{t('dashboard.microsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.sodium')}</p>
              <p className="font-medium">1500 / 2300 mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.sugar')}</p>
              <p className="font-medium">40 / 50 g</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.potassium')}</p>
              <p className="font-medium">2000 / 3500 mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.vitaminC')}</p>
              <p className="font-medium">75 / 90 mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.calcium')}</p>
              <p className="font-medium">800 / 1000 mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.iron')}</p>
              <p className="font-medium">10 / 18 mg</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{t('dashboard.logTitle')}</CardTitle>
            <Link href="/add-food">
              <Button size="sm">
                <PlusCircle className="mx-2 h-4 w-4" /> {t('dashboard.addFoodButton')}
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{t('dashboard.logEmpty')}</p>
            <img
              src="https://placehold.co/600x400.png"
              alt="Empty plate"
              className="mt-4 rounded-md"
              data-ai-hint="empty plate"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.suggestionsTitle')}</CardTitle>
            <CardDescription>{t('dashboard.suggestionsDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="font-semibold">{t('dashboard.breakfast')}</span> Greek Yogurt with Berries
              </li>
              <li>
                <span className="font-semibold">{t('dashboard.lunch')}</span> Grilled Chicken Salad
              </li>
              <li>
                <span className="font-semibold">{t('dashboard.dinner')}</span> Salmon with Quinoa & Asparagus
              </li>
            </ul>
            <Button variant="outline" className="mt-4 w-full">
              {t('dashboard.generateButton')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
