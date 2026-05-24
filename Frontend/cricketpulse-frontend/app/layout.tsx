import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export const metadata: Metadata = {
  title: {
    default: 'CricketPulse — Real-time IPL AI',
    template: '%s | CricketPulse',
  },
  description:
    'Real-time multi-agent IPL intelligence platform. XGBoost win probability, LLM commentary, and autonomous alerts on every ball.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0A0A0A" />
        <meta name="color-scheme" content="dark" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-background-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  )
}
