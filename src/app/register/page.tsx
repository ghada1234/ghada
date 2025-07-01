'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();

  const handleRegister = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you'd handle registration logic here.
    toast({
      title: t('register.toastSuccessTitle'),
      description: t('register.toastSuccessDescription'),
    });
    router.push('/login');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleRegister}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">{t('register.title')}</CardTitle>
            <CardDescription>{t('register.description')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="name">{t('register.nameLabel')}</Label>
              <Input id="name" placeholder={t('register.namePlaceholder')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('register.emailLabel')}</Label>
              <Input id="email" type="email" placeholder={t('register.emailPlaceholder')} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('register.passwordLabel')}</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" className="w-full">{t('register.button')}</Button>
            <div className="w-full text-center text-sm text-muted-foreground">
               {t('register.hasAccount')} <Link href="/login" className="text-primary underline">{t('register.signInLink')}</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
