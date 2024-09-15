
'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { doc, collection, writeBatch, getDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Notification from '../components/Notifications'

export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [flashcardSets, setFlashcardSets] = useState([])
    const [selectedSet, setSelectedSet] = useState(null)
    const [notification, setNotification] = useState({ message: '', type: '', show: false })
    const [loading, setLoading] = useState(false)
    const { user } = useUser()

    // Fetch flashcard sets for the history sidebar
    useEffect(() => {
        if (user) {
            fetchFlashcardSets()
        }
    }, [user])

    const fetchFlashcardSets = async () => {
        if (!user) return
        const userId = user.id
        const userDocRef = doc(db, 'users', userId)
        const flashcardSetsSnapshot = await getDocs(collection(userDocRef, 'flashcardSets'))
        const sets = flashcardSetsSnapshot.docs.map(doc => doc.id)
        setFlashcardSets(sets)
    }

    const handleSubmit = async () => {
        if (!text.trim()) {
            setNotification({ message: 'Please enter some text to generate flashcards.', type: 'error', show: true })
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ text }),
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

            const data = await response.json()
            if (!Array.isArray(data)) throw new Error('Unexpected response format')

            setFlashcards(data)
            await saveFlashcardsAuto(data)  // Automatically save flashcards
        } catch (error) {
            setNotification({ message: 'Error generating flashcards. Please try again.', type: 'error', show: true })
        } finally {
            setLoading(false)
        }
    }

    const saveFlashcardsAuto = async (generatedFlashcards) => {
        if (!user) {
            setNotification({ message: 'User not authenticated. Please sign in.', type: 'error', show: true })
            return
        }

        const userId = user.id
        const setName = `Set-${new Date().toISOString()}` // Automatically generate a set name

        try {
            const userDocRef = doc(db, 'users', userId)
            const batch = writeBatch(db)

            const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
            batch.set(setDocRef, { flashcards: JSON.stringify(generatedFlashcards) })

            await batch.commit()

            // Update sidebar with new set
            setFlashcardSets([...flashcardSets, setName])
            setNotification({ message: 'Flashcards saved automatically!', type: 'success', show: true })
        } catch (error) {
            console.error('Error saving flashcards:', error)
            setNotification({ message: 'Error saving flashcards. Please try again.', type: 'error', show: true })
        }
    }

    const fetchFlashcards = async (setName) => {
        if (!user) return
        const userId = user.id
        const setDocRef = doc(db, 'users', userId, 'flashcardSets', setName)
        const setDocSnap = await getDoc(setDocRef)

        if (setDocSnap.exists()) {
            setFlashcards(JSON.parse(setDocSnap.data().flashcards))
            setSelectedSet(setName)
        } else {
            setNotification({ message: 'Error fetching flashcards.', type: 'error', show: true })
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#dedeff]">
            <Header />
            <main className="flex-grow flex">
                <aside className="w-1/6 p-4 bg-[#ebecf5]">
                    <p className="text-lg font-semibold mb-4">LearnTab History</p>
                    <hr class="border-gray-300 my-1" />
                    <ul>
                        {flashcardSets.map((setName, index) => (
                            <li key={index} className="mb-2">
                                <button
                                    className="text-black italic capitalize"
                                    onClick={() => fetchFlashcards(setName)}
                                >
                                    {setName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Flashcard Generation Section */}
                <div className="w-3/4 p-4">
                    <h1 className="text-4xl font-bold mb-4 mt-3 text-center">Generate Flashcards</h1>
                    <div className='flex flex-col items-center'>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Enter text"
                            className="w-1/3 p-3 border border-gray-300 rounded-md mb-4"
                            rows="4"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-1/3 py-2 px-4 text-white rounded-md ${loading ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                            {loading ? 'Generating...' : 'Generate Flashcards'}
                        </button>

                    </div>
                    {flashcards.length > 0 && (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-4">
                            {flashcards.map((flashcard, index) => (
                                <div
                                    key={index}
                                    className="flip-container cursor-pointer"
                                    onClick={() => {
                                        const updatedFlashcards = [...flashcards]
                                        updatedFlashcards[index] = {
                                            ...flashcard,
                                            isFlipped: !flashcard.isFlipped
                                        }
                                        setFlashcards(updatedFlashcards)
                                    }}
                                >
                                    <div className={`flip-card ${flashcard.isFlipped ? 'flip' : ''}`}>
                                        <div className="front bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                            <h3 className="text-lg font-semibold">Front:</h3>
                                            <p>{flashcard.front}</p>
                                        </div>
                                        <div className="back bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                            <h3 className="text-lg font-semibold">Back:</h3>
                                            <p>{flashcard.back}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    )}
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
    )
}
