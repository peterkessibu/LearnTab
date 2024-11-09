import {
  ClerkProvider
} from '@clerk/nextjs'
import './globals.css'

export const metadata = {
  title: "LearnTab",
  description: "A flashcard Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1599023620055809" crossorigin="anonymous"></script>
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
