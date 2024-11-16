"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
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
        {isSignedIn && !isLoggingOut ? (
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* User's Name */}
            <span className="text-sm sm:text-base">{user.firstName || user.username}</span>
            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="text-sm sm:text-base bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Log Out
            </button>
          </div>
        ) : (
          !isLoggingOut && (
            <div className="flex items-center space-x-2 md:space-x-4">
                <Link
                  href={'/sign-in'}
                  className="bg-white text-[#0d0c47] py-1 px-2 sm:py-1 sm:px-4 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href={'sign-up'}
                  className="text-white border border-white py-1 px-2 sm:py-1 sm:px-4 rounded-lg"
                >
                  Sign Up
                </Link>
            </div>
          )
        )}
      </div>
    </nav>
  );
}