// app/sign-up/page.tsx
'use client'

import { SignUp, useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
    const { isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isSignedIn) {
            router.push('/generate')
        }
    }, [isSignedIn, router])

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#e4e4f7]">
            {/* Navbar */}
            <nav className="w-full">
                <div className="bg-[#0b1e36] p-4 w-full flex justify-center">
                    <Link href={'/'} className="text-white text-2xl font-bold">LearnTab</Link>
                </div>
            </nav>

            <div className="flex flex-col flex-grow justify-center items-center p-4">
                    <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        appearance={{
                            elements: {
                                formButtonPrimary: 'bg-[#003f8f] hover:bg-blue-700 text-white w-full py-2 rounded-lg',
                                formButtonSecondary: 'bg-gray-500 hover:bg-gray-600 text-white w-full py-2 rounded-lg',
                                formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 w-full py-2 px-3 rounded-lg',
                                formFieldLabel: 'text-gray-700 text-sm',
                                formTitle: 'text-2xl font-semibold text-gray-800 mb-4',
                                formDescription: 'text-gray-600 text-center mb-4',
                            },
                        }}
                    />
                </div>
            </div>
    )
}
