import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AppProviders } from '@/providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import ContentProtection from '@/components/security/ContentProtection';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GTEEP | Gilead Trust Economic Empowerment Project',
    template: '%s | GTEEP',
  },
  description:
    'GTEEP — Gilead Trust Economic Empowerment Project. Evidence-driven policy analysis for socially inclusive development in Africa. Research, policy engagement, citizen enlightenment, and economic empowerment.',
  keywords: [
    'GTEEP',
    'Gilead Trust',
    'Economic Empowerment',
    'African economics',
    'trade policy',
    'international trade',
    'regional integration',
    'economic development',
    'Africa trade',
    'AfCFTA',
    'policy research',
    'development economics',
    'Nigeria economics',
    'gender equity',
    'data speaks',
  ],
  authors: [{ name: 'GTEEP' }],
  creator: 'GTEEP',
  publisher: 'GTEEP',
  metadataBase: new URL('https://gteep.com'),
  alternates: {
    canonical: 'https://gteep.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gteep.com',
    siteName: 'GTEEP',
    title: 'GTEEP | Gilead Trust Economic Empowerment Project',
    description:
      'Evidence-driven policy analysis for socially inclusive development in Africa. Research, policy engagement, and economic empowerment.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GTEEP - Gilead Trust Economic Empowerment Project',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTEEP | Gilead Trust Economic Empowerment Project',
    description:
      'Evidence-driven policy analysis for socially inclusive development in Africa.',
    images: ['/og-image.png'],
    creator: '@gteep_africa',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AppProviders>
          <ContentProtection>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ScrollToTop />
          </ContentProtection>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'font-sans',
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}
