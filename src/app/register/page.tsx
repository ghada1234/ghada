'use client';

import { useState, useRef } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Upload } from 'lucide-react';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { updateProfile } = useUserSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setAvatar(preview);
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
                <div className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t('register.uploadAvatar')}
                  </Button>
                  <Input
                    id="custom-avatar"
                    type="file"
                    ref={fileInputRef}
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
