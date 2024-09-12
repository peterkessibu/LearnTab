import {
  ClerkProvider
} from '@clerk/nextjs'
import './globals.css'
import { Poppins } from "next/font/google";
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

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
        <body className="poppins">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
