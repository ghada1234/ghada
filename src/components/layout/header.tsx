'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';
import LanguageSwitcher from './language-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { useUserSettings } from '@/contexts/user-settings-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Leaf } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { t } = useLanguage();
  const { settings, updateProfile } = useUserSettings();
  const user = settings.profile;
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    // Clear user settings for logout
    updateProfile({ name: null, avatar: null });
    // In a real app, you would also clear tokens, etc.
    router.push('/login');
  };

  const isDashboardLayout = pathname.startsWith('/dashboard') || 
                            pathname.startsWith('/add-food') || 
                            pathname.startsWith('/meal-planner') || 
                            pathname.startsWith('/reports') || 
                            pathname.startsWith('/settings') || 
                            pathname.startsWith('/feedback') || 
                            pathname.startsWith('/about');
  
  const headerClasses = cn(
    "sticky top-0 z-40 flex h-20 items-center justify-between gap-4 px-4 md:px-6 transition-colors duration-300",
    isScrolled || isDashboardLayout ? "bg-card border-b border-border" : "bg-transparent"
  );
  
  return (
    <header className={headerClasses}>
      <div className="flex items-center gap-2">
        {isDashboardLayout ? (
          <SidebarTrigger className="md:hidden" />
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{t('metadata.title')}</span>
          </Link>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <LanguageSwitcher />
        {user.name ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatar || ''}
                      alt={user.name || 'User Avatar'}
                    />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{t('header.dashboard')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">{t('header.settings')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {t('header.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
             <Button asChild variant="ghost">
              <Link href="/login">{t('header.login')}</Link>
            </Button>
            <Button asChild>
              <Link href="/register">{t('home.getStarted')}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
