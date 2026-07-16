import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';

// ─── Font Configuration ───

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

// ─── SEO Metadata ───

export const metadata: Metadata = {
  title: 'Baldyas Satrio Albani | Creative Designer & Digital Craftsman',
  description:
    'Portfolio of Baldyas Satrio Albani — Graphic Designer at Anomali Digital. Specializing in visual communication design, branding, and digital experiences that merge art with technology.',
  keywords: [
    'Baldyas Satrio Albani',
    'Graphic Designer',
    'Visual Communication Design',
    'Anomali Digital',
    'Portfolio',
    'Creative Designer',
    'Digital Craftsman',
    'UI/UX',
    'Branding',
    'Indonesia',
  ],
  authors: [{ name: 'Baldyas Satrio Albani' }],
  creator: 'Baldyas Satrio Albani',
  openGraph: {
    title: 'Baldyas Satrio Albani | Creative Designer & Digital Craftsman',
    description:
      'Graphic Designer at Anomali Digital. Crafting visual experiences that resonate.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Baldyas Satrio Albani Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baldyas Satrio Albani | Creative Designer & Digital Craftsman',
    description:
      'Graphic Designer at Anomali Digital. Crafting visual experiences that resonate.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
};

// ─── Root Layout ───

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="noise min-h-screen bg-bg font-body text-text antialiased">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          <main>{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
