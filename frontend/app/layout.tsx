import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import ThemeProvider from "@/components/theme-provider"
import WebgazerProvider from "@/components/webgazer-provider"
import Header from "@/components/header"

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Attention Flow Analyzer",
  description: "Analyze and visualize flow of attention by tracking eye movements",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <WebgazerProvider />
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <Header />
          
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
