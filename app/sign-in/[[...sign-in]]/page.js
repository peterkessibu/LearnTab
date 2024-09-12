// app/sign-in/page.tsx
'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const { isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isSignedIn) {
            router.push('/generate')
        }
    }, [isSignedIn, router])

    return (
        <div className="flex flex-col min-h-screen w-full bg-[#dedeff]">
            {/* Navbar */}
            <nav className="w-full">
                <div className="bg-[#003f8f] p-4 w-full flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold">LearnTab</h1>
                </div>
            </nav>
            <div className="flex flex-col justify-center items-center p-4">
                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
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
