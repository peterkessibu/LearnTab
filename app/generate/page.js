"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import {
  doc,
  collection,
  writeBatch,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Notification from "../components/Notifications";
import { MenuIcon, ArrowLeftIcon } from "@heroicons/react/outline"; // Import the left arrow icon

// Function to sanitize the set name by replacing certain characters
const sanitizeSetName = (name) => {
  return name.replace(/[\/\[\]]/g, "_").trim();
};

export default function Generate() {
  const [text, setText] = useState(""); // State to hold the input text
  const [flashcards, setFlashcards] = useState([]); // State to hold the generated flashcards
  const [flashcardSets, setFlashcardSets] = useState([]); // State to hold the list of flashcard sets
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    show: false,
  }); // State for notifications
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const { user } = useUser(); // Get the current user
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility

  // Function to fetch flashcard sets for the current user
  const fetchFlashcardSets = useCallback(async () => {
    if (!user) return;
    const userId = user.id;
    const userDocRef = doc(db, "users", userId);
    const flashcardSetsSnapshot = await getDocs(
      collection(userDocRef, "flashcardSets"),
    );
    const sets = flashcardSetsSnapshot.docs.map((doc) => doc.id);
    setFlashcardSets(sets);
  }, [user]);

  // Fetch flashcard sets when the user changes
  useEffect(() => {
    if (user) {
      fetchFlashcardSets();
    }
  }, [user, fetchFlashcardSets]);

  // Disable body scroll when the sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  // Function to handle the submission of text to generate flashcards
  const handleSubmit = async () => {
    if (!text.trim()) {
      setNotification({
        message: "Please enter some text to generate flashcards.",
        type: "error",
        show: true,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ text }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const flashcards = data.flashcards.flashcards;

      if (!flashcards || !Array.isArray(flashcards)) {
        throw new Error(
          "Unexpected response format. Expected an array of flashcards.",
        );
      }

      setFlashcards(flashcards);

      if (saveFlashcardsAuto) {
        await saveFlashcardsAuto(flashcards);
      }

      setNotification({
        message: "Flashcards generated successfully!",
        type: "success",
        show: true,
      });
    } catch (error) {
      setNotification({
        message: "Error generating flashcards. Please try again.",
        type: "error",
        show: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to automatically save generated flashcards to the database
  const saveFlashcardsAuto = async (generatedFlashcards) => {
    if (!user) {
      setNotification({
        message: "User not authenticated. Please sign in.",
        type: "error",
      });
      return;
    }

    const userId = user.id;
    const setName = sanitizeSetName(text.trim());

    try {
      const userDocRef = doc(db, "users", userId);
      const batch = writeBatch(db);

      const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName);
      batch.set(setDocRef, { flashcards: JSON.stringify(generatedFlashcards) });

      await batch.commit();

      setFlashcardSets([...flashcardSets, setName]);
      setNotification({
        message: "Flashcards saved automatically!",
        type: "success",
      });
    } catch (error) {
      setNotification({
        message: "Error saving flashcards. Please try again.",
        type: "error",
      });
    }
  };

  // Function to fetch flashcards from a specific set
  const fetchFlashcards = async (setName) => {
    if (!user) return;
    const userId = user.id;
    const setDocRef = doc(db, "users", userId, "flashcardSets", setName);
    const setDocSnap = await getDoc(setDocRef);

    if (setDocSnap.exists()) {
      setFlashcards(JSON.parse(setDocSnap.data().flashcards));
    } else {
      setNotification({ message: "Error fetching flashcards.", type: "error" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#e4e4f7]">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Sidebar Toggle Icon (Visible only on mobile) */}
        <button
          className={`fixed top-[72px] z-50 p-2 md:hidden bg-white text-[#0c0831] rounded-full shadow-lg transition-all duration-400 ${isSidebarOpen ? "left-[calc(75vw-2rem)]" : "left-2"}`}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <ArrowLeftIcon className="h-6 w-6" /> // Show left arrow when sidebar is open
          ) : (
            <MenuIcon className="h-6 w-6" /> // Show menu icon when sidebar is closed
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-1 left-0 h-[calc(100vh-4rem)] md:h-screen w-3/4 sm:w-1/2 md:w-64 lg:w-1/5 bg-[#ebecf5] z-40 p-4 overflow-y-auto transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 mt-16 md:mt-0`}
        >
          <p className="text-base md:text-lg lg:text-lg font-semibold mb-4">
            LearnTab History
          </p>
          <hr className="border-gray-300 my-1" />
          <ul>
            {flashcardSets.map((setName, index) => (
              <li key={index} className="mb-2">
                <button
                  className="text-[#0c0831] capitalize text-sm md:text-base px-4 py-2 rounded-md bg-gray-100 hover:bg-[#0c0831] w-full hover:text-white transition duration-300 ease-in-out cursor-pointer shadow-md focus:outline-none"
                  onClick={() => {
                    fetchFlashcards(setName);
                    setSidebarOpen(false);
                  }}
                >
                  {setName}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Flashcard Generation Section */}
        <div className="flex-grow flex flex-col items-center w-full md:w-4/5 p-4 mt-4">
          <div className="w-full max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center">
              Generate Flashcards
            </h1>
            <div className="flex flex-col items-center">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
                className="w-full lg:w-1/2 p-3 border border-gray-300 rounded-md mb-4"
                rows="4"
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full lg:w-1/2 py-2 px-3 text-white bg-white rounded-lg 
                                border-1 ${loading ? "animate-gradient" : "hover:animate-gradient"}
                                transition duration-500 ease-in-out relative z-0 overflow-hidden`}
              >
                <span className="relative z-10">
                  {loading ? "Generating..." : "Generate Flashcards"}
                </span>
                <div className="absolute inset-0 rounded-lg border-gradient animate-gradient z-0"></div>
              </button>
            </div>
            {flashcards.length > 0 && (
              <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
                {flashcards.map((flashcard, index) => (
                  <div
                    key={index}
                    className="flip-container cursor-pointer p-2"
                    onClick={() => {
                      const updatedFlashcards = [...flashcards];
                      updatedFlashcards[index] = {
                        ...flashcard,
                        isFlipped: !flashcard.isFlipped,
                      };
                      setFlashcards(updatedFlashcards);
                    }}
                  >
                    <div
                      className={`flip-card ${flashcard.isFlipped ? "flip" : ""}`}
                    >
                      <div className="front bg-white border rounded-b-lg border-gray-300 shadow-xl flex flex-col h-full">
                        <div className="flex-grow overflow-y-auto p-6 items-center justify-center shadow-xl">
                          <p className="text-2xl text-center italic pt-4">
                            {flashcard.front}
                          </p>
                        </div>
                        <div className="text-center p-[4px] bg-[#0c0831] rounded-b-lg text-white border-t border-gray-300">
                          <p className="text-sm italic">Tap to Flip</p>
                        </div>
                      </div>
                      <div className="back bg-white border rounded-b-lg border-gray-300 shadow-xl flex flex-col h-full">
                        <div className="flex-grow overflow-y-auto p-2 shadow-xl">
                          <p className="text-lg italic">{flashcard.back}</p>
                        </div>
                        <div className="text-center p-[4px] rounded-b-lg bg-[#0c0831] text-white border-t border-gray-300">
                          <p className="text-sm italic">Tap to Flip</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </div>
  );
}
