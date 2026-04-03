import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Royal Hire Consulting | Professional E-Learning & Training",
    template: "%s | Royal Hire Consulting"
  },
  description: "Empowering careers through structured professional training and world-class consulting services. Join thousands of professionals who have transformed their careers with Royal Hire Academy.",
  keywords: ["e-learning", "professional training", "consulting", "career development", "online courses", "certification"],
  authors: [{ name: "Royal Hire Consulting" }],
  creator: "Royal Hire Consulting",
  publisher: "Royal Hire Consulting",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'Royal Hire Consulting',
    title: 'Royal Hire Consulting | Professional E-Learning & Training',
    description: 'Empowering careers through structured professional training and world-class consulting services.',
    images: [
      {
        url: '/hero-upgraded.png',
        width: 1200,
        height: 630,
        alt: 'Royal Hire Consulting - Professional Training',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Royal Hire Consulting | Professional E-Learning & Training',
    description: 'Empowering careers through structured professional training and world-class consulting services.',
    images: ['/hero-upgraded.png'],
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
  },
  manifest: '/manifest.json',
};

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
