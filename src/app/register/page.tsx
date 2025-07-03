'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserSettings } from '@/contexts/user-settings-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { updateProfile } = useUserSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const MALE_AVATAR = 'https://placehold.co/100x100.png';
  const FEMALE_AVATAR = 'https://placehold.co/100x100.png';

  const toDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCustomAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const preview = await toDataUri(file);
      setAvatar(preview); // Also set the main avatar state
    }
  };

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you'd handle registration logic here.
    // For now, just save to context and local storage.
    updateProfile({
      name,
      avatar,
    });

    toast({
      title: t('register.toastSuccessTitle'),
      description: t('register.toastSuccessDescription'),
    });
    router.push('/dashboard'); // Push to dashboard instead of login
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleRegister}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">
              {t('register.title')}
            </CardTitle>
            <CardDescription>{t('register.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('register.nameLabel')}</Label>
              <Input
                id="name"
                placeholder={t('register.namePlaceholder')}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('register.emailLabel')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.emailPlaceholder')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('register.passwordLabel')}</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>{t('register.avatarLabel')}</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar || ''} alt="Selected Avatar" />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <RadioGroup
                    onValueChange={setAvatar}
                    value={avatar || ''}
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
                        className={`h-12 w-12 ${avatar === MALE_AVATAR ? 'ring-2 ring-primary' : ''}`}
                      >
                        <AvatarImage
                          src={MALE_AVATAR}
                          data-ai-hint="male avatar"
                          alt="Male Avatar"
                        />
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <span>{t('register.male')}</span>
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
                        className={`h-12 w-12 ${avatar === FEMALE_AVATAR ? 'ring-2 ring-primary' : ''}`}
                      >
                        <AvatarImage
                          src={FEMALE_AVATAR}
                          data-ai-hint="female avatar"
                          alt="Female Avatar"
                        />
                        <AvatarFallback>F</AvatarFallback>
                      </Avatar>
                      <span>{t('register.female')}</span>
                    </Label>
                  </RadioGroup>
                  <Label
                    htmlFor="custom-avatar"
                    className="text-sm underline cursor-pointer text-primary"
                  >
                    {t('register.uploadAvatar')}
                  </Label>
                  <Input
                    id="custom-avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCustomAvatarChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" className="w-full">
              {t('register.button')}
            </Button>
            <div className="w-full text-center text-sm text-muted-foreground">
              {t('register.hasAccount')}{' '}
              <Link href="/login" className="text-primary underline">
                {t('register.signInLink')}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
