import React from "react"
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { I18nProvider } from '@/lib/i18n'
import { NewsletterWrapper } from '@/components/newsletter-wrapper'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HomePageSchemas } from '@/components/structured-data'
import './globals.css'

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});
const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ystmedia.com'),
  title: {
    default: 'YST Media | Tourism Consulting Excellence',
    template: '%s | YST Media'
  },
  description: 'A trusted partner for the future of tourism. Over 40 years of experience in hospitality consulting, hotel management, and digital innovation.',
  keywords: ['tourism consulting', 'hotel management', 'hospitality consulting', 'digital marketing tourism', 'Romania tourism', 'YST Media'],
  authors: [{ name: 'YST Media' }],
  creator: 'YST Media',
  publisher: 'YST Media',
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
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    alternateLocale: 'en_US',
    url: 'https://ystmedia.com',
    siteName: 'YST Media',
    title: 'YST Media | Tourism Consulting Excellence',
    description: 'A trusted partner for the future of tourism. Over 40 years of experience in hospitality consulting, hotel management, and digital innovation.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YST Media - Tourism Consulting',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YST Media | Tourism Consulting Excellence',
    description: 'A trusted partner for the future of tourism. Over 40 years of experience in hospitality consulting.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://ystmedia.com',
    languages: {
      'ro-RO': 'https://ystmedia.com',
      'en-US': 'https://ystmedia.com',
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" suppressHydrationWarning>
      <head>
        <HomePageSchemas />
      </head>
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <NewsletterWrapper />
            <WhatsAppButton />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
