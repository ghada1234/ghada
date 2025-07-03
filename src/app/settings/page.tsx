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
} from '@/contexts/user-settings-context';
import { useToast } from '@/hooks/use-toast';
import { Save, User, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SettingsPage() {
  const { t } = useLanguage();
  const { settings, updateGoals, updateProfile } = useUserSettings();
  const { toast } = useToast();

  const [goalsFormState, setGoalsFormState] = useState<DailyGoals>(
    settings.dailyGoals
  );
  const [profileFormState, setProfileFormState] = useState(settings.profile);

  const MALE_AVATAR = 'https://placehold.co/100x100.png';
  const FEMALE_AVATAR = 'https://placehold.co/100x100.png';
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGoalsFormState(settings.dailyGoals);
    setProfileFormState(settings.profile);
  }, [settings]);

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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateGoals(goalsFormState);
    updateProfile(profileFormState);
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
            {t('settings.title')}
          </CardTitle>
          <CardDescription>{t('settings.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold font-headline">
                {t('settings.profileTitle')}
              </h3>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="name" className="text-base">
                    {t('settings.profile.name')}
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
                <div className="grid grid-cols-2 items-start gap-4">
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
                    <RadioGroup
                      onValueChange={(value) =>
                        setProfileFormState((p) => ({ ...p, avatar: value }))
                      }
                      value={profileFormState.avatar || ''}
                      className="flex gap-4"
                    >
                      <Label
                        htmlFor="male-avatar"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem
                          value={MALE_AVATAR}
                          id="male-avatar"
                          className="sr-only"
                        />
                        <Avatar
                          className={
                            profileFormState.avatar === MALE_AVATAR
                              ? 'ring-2 ring-primary'
                              : ''
                          }
                        >
                          <AvatarImage
                            src={MALE_AVATAR}
                            data-ai-hint="male avatar"
                            alt="Male Avatar"
                          />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                      </Label>
                      <Label
                        htmlFor="female-avatar"
                        className="flex flex-col items-center gap-2 cursor-pointer"
                      >
                        <RadioGroupItem
                          value={FEMALE_AVATAR}
                          id="female-avatar"
                          className="sr-only"
                        />
                        <Avatar
                          className={
                            profileFormState.avatar === FEMALE_AVATAR
                              ? 'ring-2 ring-primary'
                              : ''
                          }
                        >
                          <AvatarImage
                            src={FEMALE_AVATAR}
                            data-ai-hint="female avatar"
                            alt="Female Avatar"
                          />
                          <AvatarFallback>F</AvatarFallback>
                        </Avatar>
                      </Label>
                    </RadioGroup>
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
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold font-headline">
                {t('settings.macrosTitle')}
              </h3>
              <div className="mt-4 space-y-4">
                {renderGoalInput('calories', 'kcal')}
                {renderGoalInput('protein', 'g')}
                {renderGoalInput('carbs', 'g')}
                {renderGoalInput('fats', 'g')}
                {renderGoalInput('fiber', 'g')}
              </div>
            </div>

            <div>
              <h3 className="mt-6 text-xl font-semibold font-headline">
                {t('settings.microsTitle')}
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
              {t('settings.saveButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
