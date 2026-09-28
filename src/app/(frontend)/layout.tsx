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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f2ea' },
    { media: '(prefers-color-scheme: dark)', color: '#0e141f' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

// Applied before first paint so the correct theme is set with no flash.
const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();`

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col bg-cream text-ink antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ServiceWorkerRegistrar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <PwaInstallPrompt />
      </body>
    </html>
  )
}
