"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import { Star, Users, Zap } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const Loading = dynamic(() => import("./components/Loading"), { ssr: false });
  const [buttonText, setButtonText] = useState("Get Started");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2450);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    setButtonText("Getting ready");

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  };

  if (isLoading) {
    return (
      <div className="bg-[#dedeff] flex h-screen my-auto w-full justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-6xl text-blue-900 font-bold mb-4">LearnTab</p>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#dedeff]">
      <Header />

      {/* Main Content Area */}
      <div className="flex-grow container mx-auto p-6">
        <p className="text-3xl font-bold text-center mb-2">
          Welcome to LearnTab
        </p>

        {isSignedIn ? (
          <div className="text-center m-4">
            <p className="text-xl font-semibold">
              Welcome back, {user.firstName}!
            </p>
            <p className="text-center text-lg mb-4">
              Boost your learning with flashcards designed for every subject!
            </p>
            <Link
              href="/generate"
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              View My Flashcards
            </Link>
          </div>
        ) : (
          <div className="text-center my-6">
            <p className="text-xl">
              Join us today to create your own flashcards!
            </p>
            <button onClick={handleClick}>
              <Link
                href="/sign-up"
                className="inline-block bg-blue-600 mt-2 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {buttonText}
              </Link>
            </button>
          </div>
        )}

        {/* 6 Cards explaining the use of flashcards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 text-[#0b1e36]">
          <div className="bg-white shadow-md rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Active Learning</p>
            <p>
              Flashcards promote active recall, which is proven to be one of the
              most effective learning techniques.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Math</p>
            <p>
              Master complex formulas and equations with math flashcards.
              Reinforce important mathematical concepts through repetition.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Science</p>
            <p>
              Flashcards help in memorizing important scientific facts, such as
              biological processes and chemical reactions.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Language Learning</p>
            <p>
              Learn new vocabulary, grammar rules, and phrases efficiently by
              using flashcards for language learning.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">History</p>
            <p>
              Memorize historical dates, events, and figures with flashcards,
              which makes learning history more engaging and effective.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-4 text-center">
            <p className="text-xl font-semibold mb-2">Exam Preparation</p>
            <p>
              Prepare for your exams by using flashcards for quick review
              sessions and focused study breaks.
            </p>
          </div>
        </div>
        <main>
          <section className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Learn Anything with FlashMaster
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              Powerful flashcards for learners of all ages
            </p>
            <Link
              href="#"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xl md:text-2xl font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Get Started with Flashcards
            </Link>
          </section>

          <section className="bg-white py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Flashcards for Every Learner
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    word: "A",
                    subtext: "for Apple",
                    image: "/placeholder.svg?height=200&width=200",
                  },
                  {
                    word: "Photosynthesis",
                    subtext: "Biology",
                    image: "/placeholder.svg?height=200&width=200",
                  },
                  {
                    word: "2+2=4",
                    subtext: "Math",
                    image: "/placeholder.svg?height=200&width=200",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
                  >
                    <Image
                      src={card.image}
                      alt={card.word}
                      width={200}
                      height={200}
                      className="mx-auto mb-4 rounded-lg"
                    />
                    <p className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-2">
                      {card.word}
                    </p>
                    <p className="text-lg text-center text-gray-600">
                      {card.subtext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12 bg-indigo-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Why Choose FlashMaster?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                  {
                    icon: Star,
                    title: "Engaging Content",
                    description: "From simple to advanced topics",
                  },
                  {
                    icon: Users,
                    title: "For All Ages",
                    description: "Suitable for kids and adults alike",
                  },
                  {
                    icon: Zap,
                    title: "Boost Learning",
                    description: "Improve retention and recall",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <feature.icon className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of learners improving their skills with
                FlashMaster
              </p>
              <Link
                href="#"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Create Your First Flashcard
              </Link>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
