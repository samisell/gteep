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
    default: 'Prof. Bola Akanji | Economics, Trade & Development Research',
    template: '%s | Prof. Bola Akanji',
  },
  description:
    'Official website of Prof. Bola Akanji — leading researcher in international trade policy, African economic integration, regional value chains, and industrial development. Explore research, publications, projects, and insights on Africa\'s economic transformation.',
  keywords: [
    'Bola Akanji',
    'African economics',
    'trade policy',
    'international trade',
    'regional integration',
    'economic development',
    'Africa trade',
    'WTO',
    'AfCFTA',
    'industrial policy',
    'value chains',
    'development economics',
    'Nigeria economics',
    'GTEEP',
  ],
  authors: [{ name: 'Prof. Bola Akanji' }],
  creator: 'Prof. Bola Akanji',
  publisher: 'GTEEP',
  metadataBase: new URL('https://gteep.com'),
  alternates: {
    canonical: 'https://gteep.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gteep.com',
    siteName: 'Prof. Bola Akanji',
    title: 'Prof. Bola Akanji | Economics, Trade & Development Research',
    description:
      'Leading researcher in international trade policy, African economic integration, and regional development. Advancing evidence-based policy for Africa\'s economic transformation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Prof. Bola Akanji - Economics, Trade & Development Research',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prof. Bola Akanji | Economics, Trade & Development Research',
    description:
      'Leading researcher in international trade policy, African economic integration, and regional development.',
    images: ['/og-image.png'],
    creator: '@bolaakanji',
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
