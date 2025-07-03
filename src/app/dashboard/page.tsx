
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { PlusCircle, Loader2, Utensils, Trash2, Info, Sparkles, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { suggestMeals, type SuggestMealsOutput, type MealSuggestion } from '@/ai/flows/suggest-meals';
import { useMealLog, type LoggedMeal } from '@/contexts/meal-log-context';
import { useUserSettings } from '@/contexts/user-settings-context';
import { isToday } from 'date-fns';
import type { DailyGoals } from '@/contexts/user-settings-context';


const MacroProgress = ({
  nutrientKey,
  label,
  unit,
  currentValue,
  goalValue,
  tooltip,
}: {
  nutrientKey: keyof DailyGoals;
  label: string;
  unit: string;
  currentValue: number;
  goalValue: number;
  tooltip: string;
}) => {
  const getProgress = (current: number, goal: number) => (goal > 0 ? (current / goal) * 100 : 0);

  const getProgressColorClass = (current: number, goal: number): string => {
    if (goal <= 0) return 'bg-primary';
    const percentage = (current / goal) * 100;
    if (percentage > 105) return 'bg-destructive';
    if (percentage > 90) return 'bg-warning';
    return 'bg-primary';
  };

  const isCalories = nutrientKey === 'calories';

  return (
    <div>
      <div className={`mb-1 flex justify-between ${isCalories ? 'items-baseline' : 'items-center'}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center gap-1.5 cursor-help ${isCalories ? 'text-lg font-semibold' : ''}`}>
              <span>{label}</span>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
        <span className={`${isCalories ? 'text-xl font-bold font-headline' : 'font-medium'}`}>
          {currentValue.toLocaleString(undefined, { maximumFractionDigits: isCalories ? 0 : 1 })} / {goalValue.toLocaleString()} {unit}
        </span>
      </div>
      <Progress
        value={getProgress(currentValue, goalValue)}
        indicatorClassName={getProgressColorClass(currentValue, goalValue)}
        className={isCalories ? 'h-4' : 'h-2'}
      />
    </div>
  );
};


export default function DashboardPage() {
  const { t, lang } = useLanguage();
  const { loggedMeals, removeMeal } = useMealLog();
  const { settings } = useUserSettings();
  const { dailyGoals, profile } = settings;
  const [suggestions, setSuggestions] = useState<SuggestMealsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const todaysMeals = useMemo(() => {
    return loggedMeals.filter(meal => isToday(new Date(meal.loggedAt)));
  }, [loggedMeals]);

  const totals = useMemo(() => {
    return todaysMeals.reduce((acc, meal) => {
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
  }, [todaysMeals]);

  const handleGenerateSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await suggestMeals({ language: lang, dietaryPreference: profile.dietaryPreference });
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to generate meal suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareOnWhatsApp = () => {
    const message = 
        `${t('dashboard.shareMessage.intro')}\n\n` +
        `*${t('dashboard.macrosTitleFormatted')}*\n` +
        `🔥 *${t('dashboard.calories')}*: ${totals.calories.toLocaleString()} / ${dailyGoals.calories.toLocaleString()} kcal\n` +
        `💪 *${t('dashboard.protein')}*: ${totals.protein.toFixed(1)} / ${dailyGoals.protein} g\n` +
        `🍞 *${t('dashboard.carbs')}*: ${totals.carbs.toFixed(1)} / ${dailyGoals.carbs} g\n` +
        `🥑 *${t('dashboard.fats')}*: ${totals.fats.toFixed(1)} / ${dailyGoals.fats} g\n` +
        `🌾 *${t('dashboard.fiber')}*: ${totals.fiber.toFixed(1)} / ${dailyGoals.fiber} g\n\n` +
        `*${t('dashboard.microsTitleFormatted')}*\n` +
        `🧂 *${t('dashboard.sodium')}*: ${totals.sodium.toLocaleString()} / ${dailyGoals.sodium.toLocaleString()} mg\n` +
        `🍬 *${t('dashboard.sugar')}*: ${totals.sugar.toFixed(1)} / ${dailyGoals.sugar} g\n` +
        `🍌 *${t('dashboard.potassium')}*: ${totals.potassium.toLocaleString()} / ${dailyGoals.potassium.toLocaleString()} mg\n` +
        `🍊 *${t('dashboard.vitaminC')}*: ${totals.vitaminC.toFixed(1)} / ${dailyGoals.vitaminC} mg\n` +
        `🥛 *${t('dashboard.calcium')}*: ${totals.calcium.toLocaleString()} / ${dailyGoals.calcium.toLocaleString()} mg\n` +
        `🔩 *${t('dashboard.iron')}*: ${totals.iron.toFixed(1)} / ${dailyGoals.iron} g\n\n` +
        `${t('dashboard.shareMessage.outro')}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };
  
  const renderNutrient = (label: string, value: number, unit: string) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value != null ? value.toLocaleString() : 'N/A'} {unit}</span>
    </div>
  );

  const renderSuggestion = (meal: MealSuggestion | undefined, mealType: string) => {
    if (!meal) return null;
    return (
    <AccordionItem value={mealType}>
      <AccordionTrigger className="text-base">
        <div className="flex flex-col items-start text-start md:flex-row md:items-center">
          <span className="font-semibold">{t(`addFood.mealTypes.${mealType}`)}:</span>
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
           <div className="mt-2 space-y-1">
            {renderNutrient(t('addFood.nutrients.calories'), meal.nutritionalInfo.calories, 'kcal')}
            {renderNutrient(t('addFood.nutrients.protein'), meal.nutritionalInfo.protein, 'g')}
            {renderNutrient(t('addFood.nutrients.carbs'), meal.nutritionalInfo.carbs, 'g')}
            {renderNutrient(t('addFood.nutrients.fats'), meal.nutritionalInfo.fats, 'g')}
            {renderNutrient(t('addFood.nutrients.fiber'), meal.nutritionalInfo.fiber, 'g')}
            {renderNutrient(t('addFood.nutrients.sugar'), meal.nutritionalInfo.sugar, 'g')}
            {renderNutrient(t('addFood.nutrients.sodium'), meal.nutritionalInfo.sodium, 'mg')}
            {renderNutrient(t('addFood.nutrients.potassium'), meal.nutritionalInfo.potassium, 'mg')}
            {renderNutrient(t('addFood.nutrients.calcium'), meal.nutritionalInfo.calcium, 'mg')}
            {renderNutrient(t('addFood.nutrients.iron'), meal.nutritionalInfo.iron, 'mg')}
            {renderNutrient(t('addFood.nutrients.vitaminC'), meal.nutritionalInfo.vitaminC, 'mg')}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">{t('dashboard.suggestions.instructions')}</h4>
          <ol className="mt-2 list-decimal list-inside space-y-1 text-muted-foreground">
            {meal.instructions.map((step: string, index: number) => <li key={index}>{step}</li>)}
          </ol>
        </div>
      </AccordionContent>
    </AccordionItem>
    )
  };

  const MealTypeTag = ({ mealType }: { mealType: LoggedMeal['mealType']}) => {
    if (!mealType) return null;
    return (
      <div className="text-xs capitalize px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        {t(`addFood.mealTypes.${mealType}`)}
      </div>
    );
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <h1 className="font-headline text-3xl font-bold">{t('dashboard.title')}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.macrosTitle')}</CardTitle>
            <CardDescription>{t('dashboard.macrosDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MacroProgress nutrientKey="calories" label={t('dashboard.calories')} unit="kcal" currentValue={totals.calories} goalValue={dailyGoals.calories} tooltip={t('dashboard.tooltips.calories')} />
            <MacroProgress nutrientKey="protein" label={t('dashboard.protein')} unit="g" currentValue={totals.protein} goalValue={dailyGoals.protein} tooltip={t('dashboard.tooltips.protein')} />
            <MacroProgress nutrientKey="carbs" label={t('dashboard.carbs')} unit="g" currentValue={totals.carbs} goalValue={dailyGoals.carbs} tooltip={t('dashboard.tooltips.carbs')} />
            <MacroProgress nutrientKey="fats" label={t('dashboard.fats')} unit="g" currentValue={totals.fats} goalValue={dailyGoals.fats} tooltip={t('dashboard.tooltips.fats')} />
            <MacroProgress nutrientKey="fiber" label={t('dashboard.fiber')} unit="g" currentValue={totals.fiber} goalValue={dailyGoals.fiber} tooltip={t('dashboard.tooltips.fiber')} />
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleShareOnWhatsApp}>
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('dashboard.shareOnWhatsApp')}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.microsTitle')}</CardTitle>
            <CardDescription>{t('dashboard.microsDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
              {renderNutrient(t('dashboard.sodium'), totals.sodium, `mg / ${dailyGoals.sodium.toLocaleString()} mg`)}
              {renderNutrient(t('dashboard.sugar'), totals.sugar, `g / ${dailyGoals.sugar} g`)}
              {renderNutrient(t('dashboard.potassium'), totals.potassium, `mg / ${dailyGoals.potassium.toLocaleString()} mg`)}
              {renderNutrient(t('dashboard.vitaminC'), totals.vitaminC, `mg / ${dailyGoals.vitaminC} mg`)}
              {renderNutrient(t('dashboard.calcium'), totals.calcium, `mg / ${dailyGoals.calcium.toLocaleString()} mg`)}
              {renderNutrient(t('dashboard.iron'), totals.iron, `g / ${dailyGoals.iron} g`)}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.logTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            {todaysMeals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-secondary p-4">
                  <Utensils className="h-10 w-10 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{t('dashboard.logEmpty.title')}</h3>
                <p className="text-sm text-muted-foreground">{t('dashboard.logEmpty.subtitle')}</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {todaysMeals.map(meal => (
                  <div key={meal.id} className="group flex items-center gap-4">
                    {meal.photoDataUri ? (
                      <Image
                        src={meal.photoDataUri}
                        alt={meal.dishName}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted">
                        <Utensils className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold">{meal.dishName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{meal.calories} {t('dashboard.log.calories')}</p>
                        <MealTypeTag mealType={meal.mealType} />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMeal(meal.id)}
                      aria-label={t('dashboard.log.removeMeal')}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('dashboard.smartMealIdeasTitle')}</CardTitle>
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
                {renderSuggestion(suggestions.snack, 'snack')}
                {renderSuggestion(suggestions.dessert, 'dessert')}
              </Accordion>
            )}
            {!isLoading && !suggestions && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="mb-4 rounded-full bg-secondary p-4">
                   <Sparkles className="h-8 w-8 text-secondary-foreground" />
                 </div>
                 <h3 className="text-lg font-semibold">{t('dashboard.suggestionsEmpty.title')}</h3>
                 <p className="text-sm text-muted-foreground">{t('dashboard.suggestionsEmpty.subtitle')}</p>
              </div>
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
      <Link href="/add-food" passHref>
        <Button
          className="fixed bottom-6 end-6 h-16 w-16 rounded-full shadow-lg z-50 rtl:end-auto rtl:start-6"
          size="icon"
          aria-label={t('addFood.title')}
        >
          <PlusCircle className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}
