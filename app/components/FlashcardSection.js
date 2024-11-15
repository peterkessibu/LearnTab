import { useState } from "react";
import Image from "next/image";

const FlashcardSection = () => {
  const [flashcards, setFlashcards] = useState([
    {
      front: "Apple",
      back: "An apple is a sweet, edible fruit produced by the apple tree. It is a pome, meaning it has a fleshy core and seeds enclosed within.",
      image: "/image.png",
      isFlipped: false,
    },
    {
      front: "Information Technology",
      back: "IT encompasses the use of computers and other digital systems to store, retrieve, process, and manage information.",
      image: "/Computer troubleshooting-amico.svg",
      isFlipped: false,
    },
    {
      front: "19 + 6 = 25",
      back: "The sum of 19 and 6 is 25",
      image: "/Calculator-rafiki.svg",
      isFlipped: false,
    },
  ]);

  const handleFlip = (index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index].isFlipped = !updatedFlashcards[index].isFlipped;
    setFlashcards(updatedFlashcards);
  };

  return (
    <main>
      {/* Flashcards Section */}
      <section className="pt-6 pb-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Flashcards for Every Learner
          </h2>
          <div className="w-full grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
            {flashcards.map((flashcard, index) => (
              <div
                key={index}
                className="flip-container cursor-pointer p-2"
                onClick={() => handleFlip(index)}
              >
                <div
                  className={`flip-card ${flashcard.isFlipped ? "flip" : ""} h-72`}
                >
                  <div className="front bg-white border rounded-b-lg border-gray-300 shadow-xl flex flex-col h-full">
                    <div className="flex-grow overflow-y-auto p-2 items-center justify-center shadow-xl">
                      <Image
                        src={flashcard.image}
                        alt={flashcard.front}
                        width={100}
                        height={100}
                        className="mx-auto mb-4 rounded-lg"
                      />
                      <p className="text-2xl text-center italic">
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
        </div>
      </section>
    </main>
  );
};

export default FlashcardSection;
