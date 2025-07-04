'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUserSettings } from '@/contexts/user-settings-context';
import { useTestimonials } from '@/contexts/testimonials-context';

export default function HomePage() {
  const { t } = useLanguage();
  const { settings } = useUserSettings();
  const user = settings.profile;
  const { testimonials: userTestimonials } = useTestimonials();
  
  // The 'as any' is used here because t() can return a complex object (array of objects)
  // based on the JSON structure, not just a string.
  const defaultTestimonials = t('home.testimonials.reviews') as any[];

  // Combine user-submitted testimonials with default ones, showing newest user ones first.
  const allTestimonials = [
    ...userTestimonials.slice().reverse(),
    ...defaultTestimonials
  ];

  return (
    <div>
      <section className="flex flex-col items-center justify-center min-h-[calc(80vh-4rem)] p-4 text-center">
        <div className="flex items-center justify-center mb-6">
          <Leaf className="h-16 w-16 text-primary" />
          <h1 className="ml-4 text-5xl font-bold font-headline tracking-tighter">
            {t('metadata.title')}
          </h1>
        </div>
        <p className="max-w-2xl mx-auto mb-8 text-lg text-muted-foreground">
          {t('home.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
           {user && user.name ? (
              <Button asChild size="lg">
                <Link href="/dashboard">{t('home.loggedIn.goToDashboard')}</Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/register">{t('home.getStarted')}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">{t('header.login')}</Link>
                </Button>
              </>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">
            {t('home.testimonials.title')}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allTestimonials.map((testimonial, index) => (
              <Card key={testimonial.id || index} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={testimonial.avatar || undefined}
                        alt={testimonial.name}
                        data-ai-hint={testimonial.dataAiHint}
                      />
                      <AvatarFallback>
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {testimonial.name}
                      </p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-5 w-5',
                              i < testimonial.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-muted-foreground/30'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
