'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('login.emailLabel')}</Label>
            <Input id="email" type="email" placeholder={t('login.emailPlaceholder')} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">{t('login.passwordLabel')}</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Button className="w-full">{t('login.button')}</Button>
          <div className="w-full text-center text-sm text-muted-foreground">
            {t('login.noAccount')} <Link href="/register" className="text-primary underline">{t('login.signUpLink')}</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
