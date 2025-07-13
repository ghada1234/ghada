'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Camera, BrainCircuit, Target, Leaf, Star, NotebookText, BarChart3, Barcode, Database, Users, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useUserSettings } from '@/contexts/user-settings-context';
import { useTestimonials } from '@/contexts/testimonials-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AdBanner from '@/components/ad-banner';

export default function HomePage() {
  const { t } = useLanguage();
  const { settings } = useUserSettings();
  const user = settings.profile;
  const { testimonials: userTestimonials } = useTestimonials();
  
  const defaultTestimonials = t('home.testimonials.reviews') as any[];
  const allTestimonials = [ ...userTestimonials.slice().reverse(), ...defaultTestimonials ];

  const howItWorksSteps = t('home.howItWorks.steps') as any[];
  const features = t('home.features.list') as any[];
  const faqItems = t('home.faq.questions') as any[];

  const featureIcons: { [key: string]: React.ElementType } = {
    'Personalized Meal Plans': NotebookText,
    'Track Your Progress': BarChart3,
    'Barcode Scanner': Barcode,
    'Extensive Food Database': Database,
    'Community & Support': Users,
    'Multi-language': Languages,
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center text-center" id="hero">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t('home.subtitle')}
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="text-lg">
                <Link href={user.name ? "/dashboard" : "/register"}>{t('home.getStarted')}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{t('home.howItWorks.title')}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('home.howItWorks.subtitle')}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {howItWorksSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index === 0 && <Camera className="h-6 w-6" />}
                    {index === 1 && <BrainCircuit className="h-6 w-6" />}
                    {index === 2 && <Target className="h-6 w-6" />}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-secondary py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{t('home.features.title')}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('home.features.subtitle')}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = featureIcons[feature.icon] || Leaf;
                return (
                  <Card key={index} className="border bg-background/50">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="advertisement" className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <AdBanner />
          </div>
        </section>

        <section id="testimonials" className="py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{t('home.testimonials.title')}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t('home.testimonials.subtitle')}</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {allTestimonials.slice(0, 3).map((testimonial, index) => (
                <Card key={testimonial.id || index} className="flex flex-col border bg-background/50">
                  <CardContent className="flex-1 pt-6">
                    <p className="text-muted-foreground italic">&ldquo;{testimonial.text}&rdquo;</p>
                  </CardContent>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar || undefined} alt={testimonial.name} data-ai-hint="woman smiling" />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                         <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn('h-4 w-4', i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30')} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-secondary py-16 sm:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{t('home.faq.title')}</h2>
              <p className="mt-4 text-muted-foreground">{t('home.faq.subtitle')}</p>
            </div>
            <Accordion type="single" collapsible className="mx-auto mt-12 w-full max-w-3xl">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b border-white/10">
                  <AccordionTrigger className="py-4 text-lg hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
    </div>
  );
}
