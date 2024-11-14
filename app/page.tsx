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
  const { isSignedIn, user } = useUser(); // Get the current user and their sign-in status
  const [isLoading, setIsLoading] = useState(true); // State to manage loading status
  const Loading = dynamic(() => import("./components/Loading"), { ssr: false }); // Dynamically import the Loading component
  const [buttonText, setButtonText] = useState("Get Started with LearnTab"); // State to manage button text
  const [flipped, setFlipped] = useState([false, false, false]);

  // useEffect to simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 2.45 seconds
    }, 2450);
    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  const handleFlip = (index: number): void => {
    setFlipped((prev: boolean[]): boolean[] => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };
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
          <div className="text-center">
            <section className="container mx-auto px-4 py-12 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Learn Anything with LearnTab
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Powerful flashcards for learners of all ages
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
        )}

        <main>
          {/* Flashcards Section */}
         <section className="pt-6 pb-10">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
      Flashcards for Every Learner
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          word: "Apple",
          subtext: "for Apple",
          image: "/image.png",
        },
        {
          word: "Tech",
          subtext: "Information Technology",
          image: "/Researching-amico.svg",
        },
        {
          word: "2+2=4",
          subtext: "Math",
          image: "/Calculator-rafiki.svg",
        },
      ].map((card, index) => (
        <div
          key={index}
          className="flip-container rounded-xl bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 pt-4"
          onClick={() => handleFlip(index)}
        >
          <div className={`flip-card ${flipped[index] ? "flip" : ""}`}>
            <div className="front p-4 rounded-lg">
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
              <div className="tap-to-flip">Tap to Flip</div>
            </div>
            <div className="back p-4 rounded-lg">
              <p className="text-3xl md:text-4xl font-bold text-center text-indigo-600 mb-2">
                {card.subtext}
              </p>
              <div className="tap-to-flip">Tap to Flip</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

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
                  <feature.icon className={`h-12 w-12 ${feature.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
                </div>
            </div>
          </section>

          {/* Call to Action Section */}
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
