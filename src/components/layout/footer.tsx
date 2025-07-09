'use client';

import { Leaf, Twitter, Github, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">{t('metadata.title')}</span>
            </Link>
            <p className="max-w-xs text-center text-muted-foreground md:text-left">
              {t('footer.description')}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:justify-end md:gap-16">
            <div>
              <h3 className="mb-2 font-semibold">{t('footer.product')}</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-muted-foreground hover:text-primary">{t('footer.features')}</a></li>
                <li><a href="#testimonials" className="text-muted-foreground hover:text-primary">{t('footer.testimonials')}</a></li>
                <li><a href="#faq" className="text-muted-foreground hover:text-primary">{t('footer.faq')}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">{t('footer.company')}</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">{t('header.about')}</Link></li>
                <li><Link href="/feedback" className="text-muted-foreground hover:text-primary">{t('header.feedback')}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {t('metadata.title')}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Twitter />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Github />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary">
              <Linkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
