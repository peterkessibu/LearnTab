// app/sign-up/page.tsx
'use client'
import { SignUp, useAuth } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const { isSignedIn } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (isSignedIn) {
            router.push('/flashcards')
        }
    }, [isSignedIn, router])

    return (
        <div className="flex flex-col min-h-screen justify-center items-center bg-gray-100 p-6">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
                <SignUp />
            </div>
        </div>
    )
}
