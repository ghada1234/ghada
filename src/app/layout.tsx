import type { Metadata } from 'next';
import { Space_Grotesk, Source_Code_Pro, Cairo } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import { cookies } from 'next/headers';
import { LanguageProvider } from '@/contexts/language-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import { MealLogProvider } from '@/contexts/meal-log-context';
import { UserSettingsProvider } from '@/contexts/user-settings-context';
import { TestimonialProvider } from '@/contexts/testimonials-context';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'NutriSnap',
  description: 'Snap photos of your meals for instant nutritional analysis.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = cookies().get('lang')?.value === 'en' ? 'en' : 'ar';

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} className={`${spaceGrotesk.variable} ${sourceCodePro.variable} ${cairo.variable}`}>
      <body className="min-h-dvh bg-background font-body text-foreground antialiased">
        <LanguageProvider initialLang={lang}>
          <UserSettingsProvider>
            <TestimonialProvider>
              <MealLogProvider>
                <SidebarProvider>
                  <div className="flex">
                    <AppSidebar />
                    <SidebarInset>
                      <Header />
                      <main className="flex-1">{children}</main>
                    </SidebarInset>
                  </div>
                </SidebarProvider>
              </MealLogProvider>
            </TestimonialProvider>
          </UserSettingsProvider>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
