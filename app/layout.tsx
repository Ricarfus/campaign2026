import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Libre_Caslon_Display } from 'next/font/google'
import './globals.css'

const libreCaslon = Libre_Caslon_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-libre-caslon',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hudson & Rufus, Student Council Election 2026',
  description:
    "Hudson Biggar and Rufus Potié are running for student council president and vice-president at École Secondaire Jules Verne. Election day: October 5, 2026.",
  icons: {
    icon: '/assets/favicon-32.png',
    apple: '/assets/favicon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2A211C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={libreCaslon.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&f[]=supreme@400,500,700&display=swap"
        />
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
