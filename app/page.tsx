'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export default function HomePage() {
  const { isSignedIn, user } = useUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto px-6 py-12 ">
        <h2 className="text-4xl font-bold text-center mb-12">Welcome to LearnTab</h2>
        <p className="text-center text-lg mb-8">Boost your learning with flashcards designed for every subject!</p>

        {/* 6 Cards explaining the use of flashcards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Active Learning</h3>
            <p>Flashcards promote active recall, which is proven to be one of the most effective learning techniques.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Math</h3>
            <p>Master complex formulas and equations with math flashcards. Reinforce important mathematical concepts through repetition.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Science</h3>
            <p>Flashcards help in memorizing important scientific facts, such as biological processes and chemical reactions.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Language Learning</h3>
            <p>Learn new vocabulary, grammar rules, and phrases efficiently by using flashcards for language learning.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">History</h3>
            <p>Memorize historical dates, events, and figures with flashcards, which makes learning history more engaging and effective.</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-2xl font-semibold mb-4">Exam Preparation</h3>
            <p>Prepare for your exams by using flashcards for quick review sessions and focused study breaks.</p>
          </div>
        </div>

        {/* Sign Up / Sign In Prompt */}
        {!isSignedIn && (
          <div className="text-center mt-12">
            <p className="text-xl">Join us today to create your own flashcards!</p>
            <div className="mt-6 space-x-4">
              <Link href="/sign-up" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Sign Up</Link>
              <Link href="/sign-in" className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600">Sign In</Link>
            </div>
          </div>
        )}

        {/* User-specific content */}
        {isSignedIn && (
          <div className="text-center mt-12">
            <p className="text-xl">Welcome back, {user.firstName}!</p>
            <Link href="/flashcards" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">View Your Flashcards</Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
