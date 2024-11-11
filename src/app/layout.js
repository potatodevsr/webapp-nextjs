import './globals.css'
import { prompt } from '@/components/shared/fonts'
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants'
import { ThemeProvider } from 'next-themes'

export const metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: APP_NAME
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(SERVER_URL)
}
export const experimental_ppr = true
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${prompt.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
