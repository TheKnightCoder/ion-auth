import './globals.css'
import '@mantine/core/styles.layer.css'

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ColorSchemeScript, MantineProvider, createTheme } from '@mantine/core'
import { Toaster } from '@/components/ui/toaster'

const myTheme = createTheme({
  primaryColor: 'green',
  fontFamily: 'sans-serif',
  fontFamilyMonospace: 'monospace',
})

export const metadata: Metadata = {
  title: 'Bootstrap Project',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="auto font-sans bg-background">
        <MantineProvider theme={myTheme} defaultColorScheme="auto">
          {children}
        </MantineProvider>
        <Toaster />
      </body>
    </html>
  )
}
