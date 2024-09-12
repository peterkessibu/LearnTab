'use client'

import Link from 'next/link'

const Navbar = () => (
    <nav className="bg-[#003f8f] p-4">
        <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">
                <Link href="/">LearnTab</Link>
            </h1>
            <div className="space-x-4">
                <Link href="/sign-in" className="text-[#09172b] bg-white border-[1px] border-white p-2 rounded-lg" >Sign In</Link>
                <Link href="/sign-up" className="text-white">Sign Up</Link>
            </div>
        </div>
    </nav>
)

export default Navbar
