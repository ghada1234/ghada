'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';
import { useUserSettings, type DailyGoals } from '@/contexts/user-settings-context';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { dailyGoals, updateGoals } = useUserSettings();
  const { toast } = useToast();
  const [formState, setFormState] = useState<DailyGoals>(dailyGoals);

  useEffect(() => {
    setFormState(dailyGoals);
  }, [dailyGoals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string for user input, but treat as 0 for state
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setFormState(prevState => ({
        ...prevState,
        [name]: numericValue,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoals(formState);
    toast({
      title: t('settings.toastSuccessTitle'),
      description: t('settings.toastSuccessDescription'),
    });
  };
  
  const renderGoalInput = (key: keyof DailyGoals, unit: string) => (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label htmlFor={key} className="text-base">
        {t(`settings.goals.${key}`)}
      </Label>
      <div className="flex items-center gap-2">
         <Input
            id={key}
            name={key}
            type="number"
            value={formState[key] === 0 && (document.activeElement?.id !== key) ? '' : formState[key]}
            onChange={handleChange}
            placeholder="0"
            className="text-center"
         />
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-2xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{t('settings.title')}</CardTitle>
          <CardDescription>{t('settings.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold font-headline">{t('settings.macrosTitle')}</h3>
            {renderGoalInput('calories', 'kcal')}
            {renderGoalInput('protein', 'g')}
            {renderGoalInput('carbs', 'g')}
            {renderGoalInput('fats', 'g')}
            {renderGoalInput('fiber', 'g')}
            
            <h3 className="mt-6 text-xl font-semibold font-headline">{t('settings.microsTitle')}</h3>
            {renderGoalInput('sugar', 'g')}
            {renderGoalInput('sodium', 'mg')}
            {renderGoalInput('potassium', 'mg')}
            {renderGoalInput('calcium', 'mg')}
            {renderGoalInput('iron', 'mg')}
            {renderGoalInput('vitaminC', 'mg')}
            
            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {t('settings.saveButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
