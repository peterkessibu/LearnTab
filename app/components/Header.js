// components/Navbar.js
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useAuth } from '@clerk/nextjs';

export default function Navbar() {
    const { isSignedIn, user } = useUser();
    const { signOut } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="flex justify-between items-center bg-[#0b1e36] text-white p-4 md:p-6">
            {/* Logo / Home Link */}
            <Link href="/" className="text-xl md:text-2xl font-bold">
                LearnTab
            </Link>

            {/* Authenticated & Unauthenticated Links */}
            <div className="flex items-center space-x-2 md:space-x-4">
                {isSignedIn ? (
                    <div className="flex items-center space-x-2 md:space-x-3">
                        {/* Profile Image (Hidden on small screens) */}
                        <Image
                            src={user?.profileImageUrl || "/default-picture.svg"}
                            alt="Profile"
                            className="hidden sm:block rounded-full"
                            width={32}
                            height={32}
                        />
                        {/* User's Name */}
                        <span className="text-sm sm:text-base">{user?.firstName}</span>
                        {/* Log Out Button */}
                        <button
                            onClick={handleLogout}
                            className="text-[#09172b] bg-white border-[1px] border-white p-1 sm:p-2 rounded-lg"
                        >
                            Log Out
                        </button>
                    </div>
                ) : (
                    <>
                        <Link href="/sign-in" className="bg-white text-[#0d0c47] py-1 px-2 sm:py-1 sm:px-4 rounded-lg">
                            Sign In
                        </Link>
                        <Link href="/sign-up" className="text-white py-1 px-2 sm:py-1 sm:px-4 rounded-lg">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
