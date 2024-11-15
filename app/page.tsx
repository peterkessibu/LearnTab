"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import dynamic from "next/dynamic";
import { Star, Users, Zap } from "lucide-react";
import FlashcardSection from "./components/FlashcardSection";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const Loading = dynamic(() => import("./components/Loading"), { ssr: false }); // Dynamically import the Loading component
  const [buttonText, setButtonText] = useState("Get Started with LearnTab"); // State to manage button text

  // useEffect to simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2.45 seconds
    }, 2450);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  // Handle button click
  const handleClick = () => {
    setButtonText("Getting ready..."); // Update button text

    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  };

  // Render loading screen if isLoading is true
  if (isLoading) {
    return (
      <div className="bg-[#dedeff] flex h-screen my-auto w-full justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <p className="text-6xl text-blue-900 font-bold mb-4">LearnTab</p>
          <Loading /> {/* Show loading component */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#dedeff]">
      <Header /> {/* Header component */}
      {/* Main Content Area */}
      <div className="flex-grow container mx-auto">
          <div className="text-center">
            <section className="container mx-auto px-4 py-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Learn Anything with LearnTab
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-4">
                Powerful flashcards for learners of all ages
                <br/>
                  Boost your learning with flashcards designed for every subject!
              </p>
              <button onClick={handleClick}>
                <Link
                  href={"/sign-up"}
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-xl md:text-2xl font-semibold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                >
                  {buttonText}
                </Link>
              </button>
            </section>
          </div>
        <main>
          {/* Flashcards Section */}
          <FlashcardSection />

          {/* Features Section */}
          <section className="py-12">
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
                    color: "text-yellow-400",
                  },
                  {
                    icon: Users,
                    title: "For All Ages",
                    description: "Suitable for kids and adults alike",
                    color: "text-blue-800",
                  },
                  {
                    icon: Zap,
                    title: "Boost Learning",
                    description: "Improve retention and recall",
                    color: "text-yellow-400",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <feature.icon
                      className={`h-12 w-12 ${feature.color} mx-auto mb-4`}
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}
