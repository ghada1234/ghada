
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';
import {
  useUserSettings,
  type DailyGoals,
  type UserProfile,
  DEFAULT_GOALS,
} from '@/contexts/user-settings-context';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Upload, Calculator, RefreshCw } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { settings, updateGoals, updateProfile } = useUserSettings();
  const { toast } = useToast();

  const [goalsFormState, setGoalsFormState] = useState<DailyGoals>(
    settings.dailyGoals
  );
  const [profileFormState, setProfileFormState] =
    useState<UserProfile>(settings.profile);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bmi, setBmi] = useState<number | null>(null);

  useEffect(() => {
    setGoalsFormState(settings.dailyGoals);
    setProfileFormState(settings.profile);
  }, [settings]);
  
  useEffect(() => {
    const weightInKg = profileFormState.weight;
    const heightInCm = profileFormState.height;

    if (weightInKg && heightInCm && heightInCm > 0) {
      const heightInM = heightInCm / 100;
      const calculatedBmi = weightInKg / (heightInM * heightInM);
      setBmi(parseFloat(calculatedBmi.toFixed(1)));
    } else {
      setBmi(null);
    }
  }, [profileFormState.weight, profileFormState.height]);

  const getBmiCategory = (bmiValue: number | null) => {
    if (!bmiValue) return '';
    if (bmiValue < 18.5) return t('profile.bmi.underweight');
    if (bmiValue < 25) return t('profile.bmi.normal');
    if (bmiValue < 30) return t('profile.bmi.overweight');
    return t('profile.bmi.obese');
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : parseInt(value, 10);
    if (!isNaN(numericValue)) {
      setGoalsFormState((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
    }
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'weight' || name === 'height' || name === 'age') {
      const numericValue = value === '' ? null : parseFloat(value);
       if (!isNaN(numericValue!) || numericValue === null) {
          setProfileFormState((prevState) => ({ ...prevState, [name]: numericValue, }));
       }
    } else {
      setProfileFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const toDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const dataUri = await toDataUri(file);
      setProfileFormState((prevState) => ({
        ...prevState,
        avatar: dataUri,
      }));
    }
  };

  const handleCalculateGoals = () => {
    const { weight, height, age, gender, activityLevel } = profileFormState;

    if (!weight || !height || !age || !gender || !activityLevel) {
      toast({
        variant: 'destructive',
        title: t('profile.calculator.errorTitle'),
        description: t('profile.calculator.errorDescription'),
      });
      return;
    }

    // Mifflin-St Jeor Equation for BMR
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    if (gender === 'male') {
      bmr += 5;
    } else {
      bmr -= 161;
    }

    const tdee = Math.round(bmr * parseFloat(activityLevel)); // Total Daily Energy Expenditure

    // Macronutrient distribution (40% carbs, 30% protein, 30% fat)
    const calories = tdee;
    const protein = Math.round((calories * 0.30) / 4);
    const carbs = Math.round((calories * 0.40) / 4);
    const fats = Math.round((calories * 0.30) / 9);

    setGoalsFormState({
      ...DEFAULT_GOALS, // Keep default micro goals
      calories,
      protein,
      carbs,
      fats,
    });

    toast({
      title: t('profile.calculator.successTitle'),
      description: t('profile.calculator.successDescription'),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoals(goalsFormState);
    updateProfile(profileFormState);
    toast({
      title: t('profile.toastSuccessTitle'),
      description: t('profile.toastSuccessDescription'),
    });
  };

  const renderGoalInput = (key: keyof DailyGoals, unit: string) => (
    <div className="grid grid-cols-2 items-center gap-4">
      <Label htmlFor={key} className="text-base">
        {t(`profile.goals.${key}`)}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          id={key}
          name={key}
          type="number"
          value={
            goalsFormState[key] === 0 && document.activeElement?.id !== key
              ? ''
              : goalsFormState[key]
          }
          onChange={handleGoalChange}
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
          <CardTitle className="text-3xl font-headline">
            {t('header.profile')}
          </CardTitle>
          <CardDescription>{t('profile.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold font-headline">
                {t('profile.profileTitle')}
              </h3>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="name" className="text-base pt-2">
                    {t('profile.profile.name')}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={profileFormState.name || ''}
                    onChange={handleProfileChange}
                    placeholder={t('register.namePlaceholder')}
                  />
                </div>
                 <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="weight" className="text-base pt-2">
                    {t('profile.profile.weight')}
                  </Label>
                   <div className="flex items-center gap-2">
                     <Input
                        id="weight"
                        name="weight"
                        type="number"
                        value={profileFormState.weight || ''}
                        onChange={handleProfileChange}
                        placeholder="0"
                        className="text-center"
                      />
                      <span className="text-sm text-muted-foreground">kg</span>
                   </div>
                </div>
                 <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="height" className="text-base pt-2">
                    {t('profile.profile.height')}
                  </Label>
                   <div className="flex items-center gap-2">
                     <Input
                        id="height"
                        name="height"
                        type="number"
                        value={profileFormState.height || ''}
                        onChange={handleProfileChange}
                        placeholder="0"
                        className="text-center"
                      />
                      <span className="text-sm text-muted-foreground">cm</span>
                   </div>
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                    <Label className="text-base pt-2">{t('profile.bmi.title')}</Label>
                    <div className="flex items-center gap-4 rounded-md border p-3">
                        <Calculator className="h-6 w-6 text-muted-foreground" />
                        <div>
                            <p className="font-bold text-lg">{bmi ? bmi : 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{getBmiCategory(bmi)}</p>
                        </div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                    <Label className="text-base pt-2">{t('profile.profile.gender')}</Label>
                    <RadioGroup
                        name="gender"
                        value={profileFormState.gender || ''}
                        onValueChange={(value) => {
                            if (value === 'male' || value === 'female') {
                              setProfileFormState((prevState) => ({ ...prevState, gender: value }));
                            }
                        }}
                        className="flex items-center gap-4 pt-2"
                    >
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male" className="font-normal">{t('profile.profile.male')}</Label>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female" className="font-normal">{t('profile.profile.female')}</Label>
                        </div>
                    </RadioGroup>
                </div>
                 <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="age" className="text-base pt-2">
                    {t('profile.profile.age')}
                  </Label>
                   <div className="flex items-center gap-2">
                     <Input
                        id="age"
                        name="age"
                        type="number"
                        value={profileFormState.age || ''}
                        onChange={handleProfileChange}
                        placeholder="0"
                        className="text-center"
                      />
                      <span className="text-sm text-muted-foreground">{t('profile.profile.years')}</span>
                   </div>
                </div>
                 <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                    <Label className="text-base pt-2">{t('profile.profile.activityLevel')}</Label>
                    <Select
                        name="activityLevel"
                        value={profileFormState.activityLevel || ''}
                        onValueChange={(value) => {
                            setProfileFormState((prevState) => ({ ...prevState, activityLevel: value }));
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t('profile.profile.selectActivityLevel')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1.2">{t('profile.activityLevels.sedentary')}</SelectItem>
                            <SelectItem value="1.375">{t('profile.activityLevels.lightlyActive')}</SelectItem>
                            <SelectItem value="1.55">{t('profile.activityLevels.moderatelyActive')}</SelectItem>
                            <SelectItem value="1.725">{t('profile.activityLevels.veryActive')}</SelectItem>
                            <SelectItem value="1.9">{t('profile.activityLevels.extraActive')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label className="text-base pt-2">
                    {t('register.avatarLabel')}
                  </Label>
                  <div className="space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profileFormState.avatar || ''}
                        alt="User Avatar"
                      />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {t('register.uploadAvatar')}
                    </Button>
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="dietaryPreference" className="text-base pt-2">
                    {t('profile.profile.dietaryPreference')}
                  </Label>
                  <Input
                    id="dietaryPreference"
                    name="dietaryPreference"
                    type="text"
                    value={profileFormState.dietaryPreference || ''}
                    onChange={handleProfileChange}
                    placeholder={t(
                      'profile.profile.dietaryPreferencePlaceholder'
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="allergies" className="text-base pt-2">
                    {t('profile.profile.allergies')}
                  </Label>
                  <Textarea
                    id="allergies"
                    name="allergies"
                    value={profileFormState.allergies || ''}
                    onChange={handleProfileChange}
                    placeholder={t('profile.profile.allergiesPlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="likes" className="text-base pt-2">
                    {t('profile.profile.likes')}
                  </Label>
                  <Textarea
                    id="likes"
                    name="likes"
                    value={profileFormState.likes || ''}
                    onChange={handleProfileChange}
                    placeholder={t('profile.profile.likesPlaceholder')}
                  />
                </div>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  <Label htmlFor="dislikes" className="text-base pt-2">
                    {t('profile.profile.dislikes')}
                  </Label>
                  <Textarea
                    id="dislikes"
                    name="dislikes"
                    value={profileFormState.dislikes || ''}
                    onChange={handleProfileChange}
                    placeholder={t('profile.profile.dislikesPlaceholder')}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold font-headline">
                  {t('profile.macrosTitle')}
                </h3>
                <Button type="button" variant="outline" onClick={handleCalculateGoals}>
                   <RefreshCw className="mr-2 h-4 w-4" />
                   {t('profile.calculator.button')}
                </Button>
              </div>
              <div className="space-y-4">
                {renderGoalInput('calories', 'kcal')}
                {renderGoalInput('protein', 'g')}
                {renderGoalInput('carbs', 'g')}
                {renderGoalInput('fats', 'g')}
                {renderGoalInput('fiber', 'g')}
              </div>
            </div>

            <div>
              <h3 className="mt-6 text-xl font-semibold font-headline">
                {t('profile.microsTitle')}
              </h3>
              <div className="mt-4 space-y-4">
                {renderGoalInput('sugar', 'g')}
                {renderGoalInput('sodium', 'mg')}
                {renderGoalInput('potassium', 'mg')}
                {renderGoalInput('calcium', 'mg')}
                {renderGoalInput('iron', 'mg')}
                {renderGoalInput('vitaminC', 'mg')}
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {t('profile.saveButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
