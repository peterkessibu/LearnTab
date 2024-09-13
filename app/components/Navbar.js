// components/Navbar.js
'use client'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
    const { isSignedIn, user } = useUser()

    return (
        <nav className="flex justify-between items-center bg-[#0b1e36] text-white p-4">
            <Link href="/" className="text-2xl font-bold">
                LearnTab
            </Link>

            <div className="flex items-center space-x-4">
                {isSignedIn ? (
                    <div className="flex items-center space-x-2">
                        {/* Profile Image */}
                        <Image
                            src={user.profileImageUrl || "/default-picture.svg"}  
                            alt="Profile"
                            className="rounded-full"
                            width={32}
                            height={32}
                        />
                        <span>{user.fullName}</span>
                    </div>
                ) : (
                    <>
                        <Link href="/sign-in" className="bg-white text-[#0d0c47] py-1 px-4 rounded-lg mx-4">
                            Sign In
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}
