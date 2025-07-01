import type { Metadata } from 'next';
import { Space_Grotesk, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';

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

export const metadata: Metadata = {
  title: 'NutriSnap',
  description: 'Snap photos of your meals for instant nutritional analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${sourceCodePro.variable}`}>
      <body className="min-h-dvh bg-background font-body text-foreground antialiased">
        <div className="relative flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
