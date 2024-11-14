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
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
