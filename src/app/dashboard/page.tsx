'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { suggestMeals, type SuggestMealsOutput, type MealSuggestion } from '@/ai/flows/suggest-meals';

export default function DashboardPage() {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<SuggestMealsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestMeals({}); // Empty input for now
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to generate meal suggestions:", error);
      // Optional: show a toast notification for the error
    } finally {
      setIsLoading(false);
    }
  };

  const renderSuggestion = (meal: MealSuggestion, mealType: string) => (
    <AccordionItem value={mealType}>
      <AccordionTrigger className="text-base">
        <div className="flex flex-col items-start text-start md:flex-row md:items-center">
          <span className="font-semibold">{t(`dashboard.${mealType}`)}</span>
          <span className="md:mx-2">{meal.dishName}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-4">
        <p className="text-muted-foreground">{meal.description}</p>
        <div>
          <h4 className="font-semibold">{t('dashboard.suggestions.ingredients')}</h4>
          <ul className="mt-2 list-disc list-inside text-muted-foreground">
            {meal.ingredients.map((item: string, index: number) => <li key={index}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">{t('dashboard.suggestions.nutrition')}</h4>
          <p className="mt-2 text-muted-foreground">{meal.nutritionalInfo}</p>
        </div>
        <div>
          <h4 className="font-semibold">{t('dashboard.suggestions.instructions')}</h4>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-muted-foreground">
            {meal.instructions.map((step: string, index: number) => <li key={index}>{step}</li>)}
          </ol>
        </div>
      </AccordionContent>
    </AccordionItem>
  );

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
            {isLoading && (
              <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>{t('dashboard.generating')}</span>
              </div>
            )}
            {suggestions && (
              <Accordion type="single" collapsible className="w-full">
                {renderSuggestion(suggestions.breakfast, 'breakfast')}
                {renderSuggestion(suggestions.lunch, 'lunch')}
                {renderSuggestion(suggestions.dinner, 'dinner')}
              </Accordion>
            )}
            {!isLoading && !suggestions && (
               <p className="py-4 text-center text-sm text-muted-foreground">{t('dashboard.suggestionsEmpty')}</p>
            )}

            <Button onClick={handleGenerateSuggestions} disabled={isLoading} variant="outline" className="mt-4 w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('dashboard.generating')}
                </>
              ) : (
                t('dashboard.generateButton')
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
