import type { Metadata } from 'next';
import { Space_Grotesk, Cairo } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { LanguageProvider } from '@/contexts/language-context';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import { MealLogProvider } from '@/contexts/meal-log-context';
import { UserSettingsProvider } from '@/contexts/user-settings-context';
import { TestimonialProvider } from '@/contexts/testimonials-context';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'Snapri Snaps',
  description: 'Snap photos of your meals for instant nutritional analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" dir="ltr" className={`${spaceGrotesk.variable} ${cairo.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <LanguageProvider>
          <UserSettingsProvider>
            <TestimonialProvider>
              <MealLogProvider>
                <SidebarProvider>
                  <div className="flex">
                    <AppSidebar />
                    <SidebarInset>
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
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
