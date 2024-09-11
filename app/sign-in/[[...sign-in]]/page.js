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
        <div className="flex flex-col min-h-screen justify-center items-center p-6">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
                <SignIn
                    path="/sign-in"
                    routing="path"
                    signUpUrl="/sign-up"
                    appearance={{
                        elements: {
                            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                            formButtonSecondary: 'bg-gray-500 hover:bg-gray-600 text-white',
                            formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50',
                            formFieldLabel: 'text-gray-700',
                            formTitle: 'text-2xl font-semibold text-gray-800',
                            formDescription: 'text-gray-600',
                            // Customize more elements as needed
                        },
                    }}
                />
            </div>
        </div>
    )
}
