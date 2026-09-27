import type { Metadata, Viewport } from 'next'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt'
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar'

import './globals.css'

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(serverUrl),
  title: {
    default: 'St. Mark Coptic Orthodox Center',
    template: '%s | St. Mark Coptic Orthodox Center',
  },
  description:
    'Liturgical schedules, live streams, food ordering, and news for St. Mark Coptic Orthodox Church.',
  manifest: '/manifest.json',
  applicationName: 'St. Mark Coptic Orthodox Center',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'St. Mark',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  openGraph: {
    type: 'website',
    siteName: 'St. Mark Coptic Orthodox Center',
    title: 'St. Mark Coptic Orthodox Center',
    description:
      'Liturgical schedules, live streams, food ordering, and news for St. Mark Coptic Orthodox Church.',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e293b',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-slate-50 text-slate-900 antialiased">
        <ServiceWorkerRegistrar />
        <Header />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <Footer />
        <PwaInstallPrompt />
      </body>
    </html>
  )
}
