'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useUser, useAuth } from '@clerk/nextjs';

const Header = () => {
    const { isSignedIn, user } = useUser(); // Get user auth state from Clerk
    const { signOut } = useAuth(); // Get signOut function from Clerk
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Sign out using Clerk's signOut method
            await signOut();

            // Clear local user data if needed (Clerk handles most of this)
            // Redirect to homepage
            router.push('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="bg-[#003f8f] p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-white text-xl font-bold">
                    <Link href="/">LearnTab</Link>
                </h1>
                <div className="space-x-4">
                    {isSignedIn ? (
                        <>
                            <span className="text-white">{user?.firstName}</span>
                            <button
                                onClick={handleLogout}
                                className="text-[#09172b] bg-white border-[1px] border-white p-2 rounded-lg"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className="text-white">
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="text-white">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
