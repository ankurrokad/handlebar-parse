import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'HBS Parser - Real-time Handlebars Template Preview',
  description: 'A developer-friendly tool to parse and preview Handlebars templates in real-time with modern UI',
  keywords: ['Handlebars', 'Template Engine', 'Real-time Preview', 'Developer Tools', 'Web Development'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
