import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'monadpay - Modern Payment App',
  description: 'Send, receive, and manage payments with ease. Modern payment app built for speed and security.',
  keywords: ['payment', 'wallet', 'fintech', 'money transfer', 'digital payments'],
  authors: [{ name: 'monadpay' }],
  openGraph: {
    title: 'monadpay - Modern Payment App',
    description: 'Send, receive, and manage payments with ease.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'monadpay - Modern Payment App',
    description: 'Send, receive, and manage payments with ease.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

