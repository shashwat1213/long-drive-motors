import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { fontDisplay, fontSans } from './fonts';
import { defaultMetadata } from '@/lib/seo/metadata';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils/format';

export const metadata = defaultMetadata;

export const viewport = {
  themeColor: '#0A0B0D',
  colorScheme: 'dark' as const,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(fontDisplay.variable, fontSans.variable)} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Header />
        <main id="main" className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
