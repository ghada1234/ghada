import Link from 'next/link';
import { CookingPot, Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/add-food', label: 'Add Food' },
  { href: '/meal-planner', label: 'Meal Planner' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <CookingPot className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">NutriSnap</span>
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="mb-4 flex items-center gap-2 text-lg font-semibold"
              >
                <CookingPot className="h-6 w-6 text-primary" />
                <span className="font-headline text-xl">NutriSnap</span>
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        {/* Mobile Title */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <CookingPot className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl">NutriSnap</span>
          </Link>
        </div>
      </div>


      <div className="flex items-center gap-4 md:gap-2 lg:gap-4">
         <Button>Login</Button>
      </div>
    </header>
  );
}
