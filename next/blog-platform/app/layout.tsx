import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n"
import { AuthProvider } from "@/lib/auth"
import { PostManagementProvider } from "@/lib/post-management"
import { AnalyticsProvider } from "@/lib/analytics"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BlogSpace - 모던 블로그 플랫폼",
  description: "인스타그램 스타일의 모바일 피드와 전통적인 데스크톱 레이아웃을 갖춘 모던 블로그 플랫폼",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${workSans.variable} ${openSans.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <I18nProvider>
              <AuthProvider>
                <PostManagementProvider>
                  <AnalyticsProvider>
                    {children}
                    <Toaster />
                  </AnalyticsProvider>
                </PostManagementProvider>
              </AuthProvider>
            </I18nProvider>
          </ThemeProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
