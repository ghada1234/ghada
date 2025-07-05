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
import { signInWithGoogle, signInWithFacebook } from '@/services/auth';

// Helper component for SVG icons to avoid repeating the className
const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <div className="h-5 w-5">{children}</div>
);

const GoogleIcon = () => (
  <SocialIcon>
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Google</title>
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.41 0-6.24-2.82-6.24-6.32s2.83-6.32 6.24-6.32c1.93 0 3.25.79 4.1 1.62l2.33-2.33C18.16 2.63 15.68 1.5 12.48 1.5c-5.21 0-9.48 4.22-9.48 9.42s4.27 9.42 9.48 9.42c5.08 0 9.2-4.1 9.2-9.28 0-.8-.08-1.56-.21-2.28h-9.21z" />
    </svg>
  </SocialIcon>
);

const FacebookIcon = () => (
  <SocialIcon>
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title>Facebook</title>
      <path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29h-3.128v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.92c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h5.698C23.41 24 24 23.41 24 22.675V1.325C24 .59 23.41 0 22.675 0z" />
    </svg>
  </SocialIcon>
);

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
    router.push('/'); // Push to home page instead of dashboard
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const socialSignIn =
      provider === 'google' ? signInWithGoogle : signInWithFacebook;
    const user = await socialSignIn();
    if (user) {
      updateProfile({
        name: user.displayName,
        avatar: user.photoURL,
      });
      toast({
        title: t('register.socialSuccessTitle'),
        description: t('register.socialSuccessDescription').replace(
          '{provider}',
          provider.charAt(0).toUpperCase() + provider.slice(1)
        ),
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: t('register.socialErrorTitle'),
        description: t('register.socialErrorDescription'),
      });
    }
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
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t('register.orContinueWith')}
                </span>
              </div>
            </div>
            <div className="grid w-full grid-cols-2 gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('google')}
              >
                <GoogleIcon /> {t('register.google')}
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialLogin('facebook')}
              >
                <FacebookIcon /> {t('register.facebook')}
              </Button>
            </div>
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
