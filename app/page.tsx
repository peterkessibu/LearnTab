'use client'

import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Loading from './components/loading'

export default function HomePage() {
  const { isSignedIn, user } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [ buttonText, setButtonText] = useState('Get Started')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2450)
    return () => clearTimeout(timer)
  }, [])

  const handleClick = () => {
  setButtonText('Getting ready');
  
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 2000);

  return () => clearTimeout(timer);
};


  if (isLoading) {
    return (
      <div className="bg-[#dedeff] poppins-regular flex min-h-screen w-full justify-center items-center">
          <div className='flex flex-col items-center justify-center'>
            <p className="text-6xl text-blue-900 font-bold mb-4">
                LearnTab
            </p>
            <Loading />
          </div>
      </div>
    )
  }

  return (
    <div className="bg-[#dedeff]">
      <Navbar />
      <div className="flex-grow container mx-auto p-8">
        <p className="text-3xl font-bold text-center mb-4">Welcome to LearnTab</p>
        
        {isSignedIn ? (
          <div className="text-center m-4">
            <p className="text-xl">Welcome back, {user.firstName}!</p>
            <p className="text-center text-lg mb-4">Boost your learning with flashcards designed for every subject!</p>
            <Link href="/generate" className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">View Your Flashcards</Link>
          </div>
        ) : (
          <div className="text-center my-6 ">
            <p className="text-xl">Join us today to create your own flashcards!</p>
            <button onClick={handleClick}>
              <Link href="/sign-up" className="inline-block bg-blue-600 mt-2 text-white py-2 px-4 rounded-lg hover:bg-blue-700">{buttonText}</Link>
            </button>
          </div>
        )}

        {/* 6 Cards explaining the use of flashcards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[#0b1e36]">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Active Learning</p>
            <p>Flashcards promote active recall, which is proven to be one of the most effective learning techniques.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Math</p>
            <p>Master complex formulas and equations with math flashcards. Reinforce important mathematical concepts through repetition.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Science</p>
            <p>Flashcards help in memorizing important scientific facts, such as biological processes and chemical reactions.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Language Learning</p>
            <p>Learn new vocabulary, grammar rules, and phrases efficiently by using flashcards for language learning.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">History</p>
            <p>Memorize historical dates, events, and figures with flashcards, which makes learning history more engaging and effective.</p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Exam Preparation</p>
            <p>Prepare for your exams by using flashcards for quick review sessions and focused study breaks.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
