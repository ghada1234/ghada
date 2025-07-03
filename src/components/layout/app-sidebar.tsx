'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, LayoutDashboard, PlusSquare, BookOpen, Settings, Home, Info, Star, BarChart } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/language-context';

export default function AppSidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { state } = useSidebar();

  const navLinks = [
    { href: '/', label: t('header.home'), icon: Home },
    { href: '/dashboard', label: t('header.dashboard'), icon: LayoutDashboard },
    { href: '/add-food', label: t('header.addFood'), icon: PlusSquare },
    { href: '/meal-planner', label: t('header.mealPlanner'), icon: BookOpen },
    { href: '/reports', label: t('header.reports'), icon: BarChart },
    { href: '/settings', label: t('header.settings'), icon: Settings },
    { href: '/about', label: t('header.about'), icon: Info },
    { href: '/feedback', label: t('header.feedback'), icon: Star },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-primary" />
          {state === 'expanded' && <span className="font-headline text-xl">{t('header.title')}</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')}
                tooltip={{ children: link.label }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
