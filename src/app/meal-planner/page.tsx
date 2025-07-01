
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { suggestMeals, type SuggestMealsOutput, type MealSuggestion } from '@/ai/flows/suggest-meals';

export default function MealPlannerPage() {
  const { t, lang } = useLanguage();
  const [suggestions, setSuggestions] = useState<SuggestMealsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const renderNutrient = (label: string, value: number, unit: string) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value != null ? value.toLocaleString() : 'N/A'} {unit}</span>
    </div>
  );

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
  );

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{t('mealPlanner.title')}</CardTitle>
          <CardDescription>{t('mealPlanner.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGenerateSuggestions} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('mealPlanner.generating')}
              </>
            ) : (
              t('mealPlanner.generateButton')
            )}
          </Button>
          
          <div className="mt-6">
            {isLoading && !suggestions && (
              <div className="flex items-center justify-center gap-2 p-8 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>{t('mealPlanner.generating')}</span>
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
               <p className="py-8 text-center text-sm text-muted-foreground">{t('mealPlanner.suggestionsEmpty')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
