
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/language-context';
import { useMealLog } from '@/contexts/meal-log-context';
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Flame, MessageSquare } from 'lucide-react';
import {
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  isSameDay,
  differenceInCalendarDays,
  subDays,
} from 'date-fns';
import { useUserSettings } from '@/contexts/user-settings-context';
import { Button } from '@/components/ui/button';

type AggregatedData = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  sugar: number;
  potassium: number;
  vitaminC: number;
  calcium: number;
  iron: number;
};

export default function ReportsPage() {
  const { t } = useLanguage();
  const { loggedMeals } = useMealLog();
  const { settings } = useUserSettings();

  const chartConfig = {
    calories: {
      label: t('reports.calories'),
      color: 'hsl(var(--chart-1))',
    },
    protein: {
      label: t('reports.protein'),
      color: 'hsl(var(--chart-2))',
    },
    carbs: {
      label: t('reports.carbs'),
      color: 'hsl(var(--chart-3))',
    },
    fats: {
      label: t('reports.fats'),
      color: 'hsl(var(--chart-4))',
    },
  } satisfies ChartConfig;

  const [activeTab, setActiveTab] = useState('daily');

  const aggregateDataByPeriod = (
    startDate: Date,
    endDate: Date,
    period: 'day' | 'week' | 'month'
  ): AggregatedData[] => {
    let intervals;
    const weekStartsOn = 1; // Monday
    if (period === 'day') {
      intervals = eachDayOfInterval({ start: startDate, end: endDate });
    } else if (period === 'week') {
      intervals = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn });
    } else {
      intervals = eachMonthOfInterval({ start: startDate, end: endDate });
    }

    const aggregated = intervals.map(intervalStart => {
      let intervalEnd;
      let name;

      if (period === 'day') {
        intervalEnd = intervalStart;
        name = format(intervalStart, 'EEE');
      } else if (period === 'week') {
        intervalEnd = endOfWeek(intervalStart, { weekStartsOn });
        name = format(intervalStart, 'd MMM');
      } else { // month
        intervalEnd = endOfMonth(intervalStart);
        name = format(intervalStart, 'MMMM');
      }

      const mealsInInterval = loggedMeals.filter(meal => {
        const mealDate = parseISO(meal.loggedAt);
        return mealDate >= intervalStart && mealDate <= intervalEnd;
      });

      const daysWithLogs = new Set(mealsInInterval.map(m => format(parseISO(m.loggedAt), 'yyyy-MM-dd'))).size;
      const divisor = period === 'day' ? 1 : (daysWithLogs || 1);

      const initialTotals = {
        calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0,
        sodium: 0, sugar: 0, potassium: 0, vitaminC: 0, calcium: 0, iron: 0,
      };

      const totals = mealsInInterval.reduce((acc, meal) => {
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
        },
        initialTotals
      );
      
      const avg = {
        calories: totals.calories / divisor,
        protein: totals.protein / divisor,
        carbs: totals.carbs / divisor,
        fats: totals.fats / divisor,
        fiber: totals.fiber / divisor,
        sodium: totals.sodium / divisor,
        sugar: totals.sugar / divisor,
        potassium: totals.potassium / divisor,
        vitaminC: totals.vitaminC / divisor,
        calcium: totals.calcium / divisor,
        iron: totals.iron / divisor,
      };
      
      return {
        name,
        calories: Math.round(avg.calories),
        protein: Math.round(avg.protein),
        carbs: Math.round(avg.carbs),
        fats: Math.round(avg.fats),
        fiber: Math.round(avg.fiber),
        sodium: Math.round(avg.sodium),
        sugar: Math.round(avg.sugar),
        potassium: Math.round(avg.potassium),
        vitaminC: Math.round(avg.vitaminC),
        calcium: Math.round(avg.calcium),
        iron: Math.round(avg.iron * 10) / 10, // Round to one decimal place
      };
    });
    
    // For daily, we want to show all days, even with 0 meals
    if (period === 'day') {
        return aggregated;
    }
    // For weekly/monthly, only show periods with logged meals
    return aggregated.filter(data => data.calories > 0 || data.protein > 0 || data.carbs > 0 || data.fats > 0);
  };

  const chartData = useMemo(() => {
    const today = new Date();
    if (loggedMeals.length === 0) return [];
    
    if (activeTab === 'daily') {
      return aggregateDataByPeriod(subDays(today, 6), today, 'day');
    }
    if (activeTab === 'weekly') {
      const firstLogDate = parseISO(loggedMeals.reduce((earliest, meal) => (meal.loggedAt < earliest ? meal.loggedAt : earliest), loggedMeals[0].loggedAt));
      return aggregateDataByPeriod(firstLogDate, today, 'week');
    }
    if (activeTab === 'monthly') {
      const firstLogDate = parseISO(loggedMeals.reduce((earliest, meal) => (meal.loggedAt < earliest ? meal.loggedAt : earliest), loggedMeals[0].loggedAt));
      return aggregateDataByPeriod(firstLogDate, today, 'month');
    }
    return [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, loggedMeals, t]);

  const currentStreak = useMemo(() => {
    if (loggedMeals.length === 0) return 0;

    const uniqueLogDays = Array.from(
      new Set(loggedMeals.map(meal => format(parseISO(meal.loggedAt), 'yyyy-MM-dd')))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    if (uniqueLogDays.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const mostRecentLog = parseISO(uniqueLogDays[0]);

    if (!isSameDay(mostRecentLog, today) && !isSameDay(mostRecentLog, subDays(today, 1))) {
      return 0;
    }

    let expectedDate = mostRecentLog;

    for (const day of uniqueLogDays) {
      const logDate = parseISO(day);
      if (isSameDay(logDate, expectedDate)) {
        streak++;
        expectedDate = subDays(expectedDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [loggedMeals]);
  
  const handleShareOnWhatsApp = () => {
    if (chartData.length === 0) return;

    const { dailyGoals } = settings;

    const initialTotals = {
        name: '',
        calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0,
        sodium: 0, sugar: 0, potassium: 0, vitaminC: 0, calcium: 0, iron: 0,
    };

    const sumTotals = chartData.reduce((acc, data) => {
        (Object.keys(acc) as Array<keyof typeof acc>).forEach(key => {
            if (key !== 'name') {
                acc[key as keyof Omit<AggregatedData, 'name'>] += data[key as keyof Omit<AggregatedData, 'name'>];
            }
        });
        return acc;
    }, initialTotals);

    const averageTotals: Omit<AggregatedData, 'name'> = {
        calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0,
        sodium: 0, sugar: 0, potassium: 0, vitaminC: 0, calcium: 0, iron: 0,
    };
    
    (Object.keys(averageTotals) as Array<keyof typeof averageTotals>).forEach(key => {
        if (chartData.length > 0) {
            averageTotals[key] = sumTotals[key] / chartData.length;
        }
    });


    const getTitle = () => {
      if (activeTab === 'daily') return t('reports.shareMessage.title.daily');
      if (activeTab === 'weekly') return t('reports.shareMessage.title.weekly');
      if (activeTab === 'monthly') return t('reports.shareMessage.title.monthly');
      return '';
    }

    const message =
      `*${getTitle()}*\n\n` +
      `*═ ${t('reports.shareMessage.macrosHeader')} ═*\n` +
      `🔥 _${t('dashboard.calories')}_: *${averageTotals.calories.toLocaleString(undefined, { maximumFractionDigits: 0 })}* / ${dailyGoals.calories.toLocaleString()} kcal\n` +
      `💪 _${t('dashboard.protein')}_: *${averageTotals.protein.toFixed(1)}* / ${dailyGoals.protein} g\n` +
      `🍞 _${t('dashboard.carbs')}_: *${averageTotals.carbs.toFixed(1)}* / ${dailyGoals.carbs} g\n` +
      `🥑 _${t('dashboard.fats')}_: *${averageTotals.fats.toFixed(1)}* / ${dailyGoals.fats} g\n` +
      `🌾 _${t('dashboard.fiber')}_: *${averageTotals.fiber.toFixed(1)}* / ${dailyGoals.fiber} g\n\n` +
      `*═ ${t('reports.shareMessage.microsHeader')} ═*\n` +
      `🧂 _${t('dashboard.sodium')}_: *${averageTotals.sodium.toLocaleString(undefined, { maximumFractionDigits: 0 })}* / ${dailyGoals.sodium.toLocaleString()} mg\n` +
      `🍬 _${t('dashboard.sugar')}_: *${averageTotals.sugar.toFixed(1)}* / ${dailyGoals.sugar} g\n` +
      `🍌 _${t('dashboard.potassium')}_: *${averageTotals.potassium.toLocaleString(undefined, { maximumFractionDigits: 0 })}* / ${dailyGoals.potassium.toLocaleString()} mg\n` +
      `🍊 _${t('dashboard.vitaminC')}_: *${averageTotals.vitaminC.toFixed(1)}* / ${dailyGoals.vitaminC} mg\n` +
      `🥛 _${t('dashboard.calcium')}_: *${averageTotals.calcium.toLocaleString(undefined, { maximumFractionDigits: 0 })}* / ${dailyGoals.calcium.toLocaleString()} mg\n` +
      `🔩 _${t('dashboard.iron')}_: *${averageTotals.iron.toFixed(1)}* / ${dailyGoals.iron} mg\n\n` +
      `*${t('reports.shareMessage.outro')}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const renderChart = (data: AggregatedData[]) => (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <RechartsBarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          width={40}
          domain={[0, 'dataMax + 100']}
          className="text-xs"
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
      </RechartsBarChart>
    </ChartContainer>
  );

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">{t('reports.title')}</CardTitle>
            <CardDescription>{t('reports.description')}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-tr from-primary/10 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="text-orange-500" />
              {t('reports.gamification.title')}
            </CardTitle>
            <CardDescription>{t('reports.gamification.description')}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <p className="text-6xl font-bold font-headline text-orange-500">{currentStreak}</p>
             <p className="text-muted-foreground">{t('reports.gamification.days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Tabs defaultValue="daily" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">{t('reports.daily')}</TabsTrigger>
                <TabsTrigger value="weekly">{t('reports.weekly')}</TabsTrigger>
                <TabsTrigger value="monthly">{t('reports.monthly')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              renderChart(chartData)
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <p className="text-lg font-semibold">{t('reports.noData')}</p>
              </div>
            )}
          </CardContent>
           <CardFooter>
            <Button className="w-full" onClick={handleShareOnWhatsApp} disabled={chartData.length === 0}>
                <MessageSquare className="mr-2 h-4 w-4" />
                {t('reports.shareOnWhatsApp')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
