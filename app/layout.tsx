import type { Metadata } from 'next'
import './globals.css'
import AuroraField from '@/components/AuroraField'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import MonitoringInitializer from '@/components/MonitoringInitializer'

export const metadata: Metadata = {
  title: 'AdGenXAI - The Aurora Engine for Growth',
  description: 'Generate ads and reels, refine with personas, and publish everywhere—automatically.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorBoundary>
          <MonitoringInitializer />
          <AuroraField />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
