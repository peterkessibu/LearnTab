'use client'

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link'

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Replace with actual auth state
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Perform logout API call here
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include', // Include cookies for session management
            });

            // Clear local state
            setIsLoggedIn(false);

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
                    {isLoggedIn && (
                        <button
                            onClick={handleLogout}
                            className="text-[#09172b] bg-white hover:text-gray-200 border-[1px] border-white p-2 rounded-lg"
                        >
                            Log Out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Header;
