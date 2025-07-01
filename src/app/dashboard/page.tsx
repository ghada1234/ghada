'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PlusCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { suggestMeals, type SuggestMealsOutput, type MealSuggestion } from '@/ai/flows/suggest-meals';
import { useMealLog } from '@/contexts/meal-log-context';

// Daily goals - these could come from user settings in a full app
const DAILY_GOALS = {
  calories: 2000,
  protein: 120,
  carbs: 250,
  fats: 70,
  fiber: 30,
  sodium: 2300,
  sugar: 50,
  potassium: 3500,
  vitaminC: 90,
  calcium: 1000,
  iron: 18,
};

export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const { loggedMeals } = useMealLog();
  const [suggestions, setSuggestions] = useState<SuggestMealsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totals = useMemo(() => {
    return loggedMeals.reduce((acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fats += meal.fats;
      acc.fiber += meal.fiber;
      acc.sodium += meal.sodium;
      acc.sugar += meal.sugar;
      acc.potassium += meal.potassium;
      acc.vitaminC += meal.vitaminC;
      acc.calcium += meal.calcium;
      acc.iron += meal.iron;
      return acc;
    }, {
      calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0,
      sodium: 0, sugar: 0, potassium: 0, vitaminC: 0, calcium: 0, iron: 0,
    });
  }, [loggedMeals]);

  const getProgress = (current: number, goal: number) => (goal > 0 ? (current / goal) * 100 : 0);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestMeals({ language: lang });
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to generate meal suggestions:", error);
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
                <span className="font-medium">{totals.calories.toLocaleString()} / {DAILY_GOALS.calories.toLocaleString()} kcal</span>
              </div>
              <Progress value={getProgress(totals.calories, DAILY_GOALS.calories)} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.protein')}</span>
                <span className="font-medium">{totals.protein.toFixed(1)} / {DAILY_GOALS.protein} g</span>
              </div>
              <Progress value={getProgress(totals.protein, DAILY_GOALS.protein)} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.carbs')}</span>
                <span className="font-medium">{totals.carbs.toFixed(1)} / {DAILY_GOALS.carbs} g</span>
              </div>
              <Progress value={getProgress(totals.carbs, DAILY_GOALS.carbs)} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.fats')}</span>
                <span className="font-medium">{totals.fats.toFixed(1)} / {DAILY_GOALS.fats} g</span>
              </div>
              <Progress value={getProgress(totals.fats, DAILY_GOALS.fats)} />
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span>{t('dashboard.fiber')}</span>
                <span className="font-medium">{totals.fiber.toFixed(1)} / {DAILY_GOALS.fiber} g</span>
              </div>
              <Progress value={getProgress(totals.fiber, DAILY_GOALS.fiber)} />
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
              <p className="font-medium">{totals.sodium.toLocaleString()} / {DAILY_GOALS.sodium.toLocaleString()} mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.sugar')}</p>
              <p className="font-medium">{totals.sugar.toFixed(1)} / {DAILY_GOALS.sugar} g</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.potassium')}</p>
              <p className="font-medium">{totals.potassium.toLocaleString()} / {DAILY_GOALS.potassium.toLocaleString()} mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.vitaminC')}</p>
              <p className="font-medium">{totals.vitaminC.toFixed(1)} / {DAILY_GOALS.vitaminC} mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.calcium')}</p>
              <p className="font-medium">{totals.calcium.toLocaleString()} / {DAILY_GOALS.calcium.toLocaleString()} mg</p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">{t('dashboard.iron')}</p>
              <p className="font-medium">{totals.iron.toFixed(1)} / {DAILY_GOALS.iron} mg</p>
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
            {loggedMeals.length === 0 ? (
              <>
                <p className="text-sm text-muted-foreground">{t('dashboard.logEmpty')}</p>
                <img
                  src="https://placehold.co/600x400.png"
                  alt="Empty plate"
                  className="mt-4 rounded-md"
                  data-ai-hint="empty plate"
                />
              </>
            ) : (
              <div className="mt-4 space-y-4">
                {loggedMeals.map(meal => (
                  <div key={meal.id} className="flex items-center gap-4">
                    {meal.photoDataUri && (
                      <Image
                        src={meal.photoDataUri}
                        alt={meal.dishName}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{meal.dishName}</p>
                      <p className="text-sm text-muted-foreground">{meal.calories} {t('dashboard.log.calories')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
