'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Notification from '../components/Notifications'

export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [notification, setNotification] = useState({ message: '', type: '', show: false })
    const { user } = useUser()

    const handleSubmit = async () => {
        if (!text.trim()) {
            setNotification({ message: 'Please enter some text to generate flashcards.', type: 'error', show: true })
            return
        }

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
        } catch (error) {
            setNotification({ message: 'Error generating flashcards. Please try again.', type: 'error', show: true })
        }
    }

    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)
    const saveFlashcards = async () => {
        if (!setName.trim()) {
            setNotification({ message: 'Please enter a name for your flashcard set.', type: 'error', show: true })
            return
        }

        if (!user) {
            setNotification({ message: 'User not authenticated. Please sign in.', type: 'error', show: true })
            return
        }

        const userId = user.id

        try {
            const userDocRef = doc(db, 'users', userId)
            const userDocSnap = await getDoc(userDocRef)
            const batch = writeBatch(db)

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data()
                const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
                batch.update(userDocRef, { flashcardSets: updatedSets })
            } else {
                // Create a new user document if it doesn't exist
                batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
            }

            // Create a new document under the user's flashcardSets collection to store the flashcards
            const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
            batch.set(setDocRef, { flashcards: JSON.stringify(flashcards) }) // Save flashcards in JSON format

            await batch.commit()

            setNotification({ message: 'Flashcards saved successfully!', type: 'success', show: true })
            handleCloseDialog()
            setSetName('')
        } catch (error) {
            console.error('Error saving flashcards:', error)
            setNotification({ message: 'Error saving flashcards. Please try again.', type: 'error', show: true })
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#dedeff]">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <h1 className="text-4xl font-bold mb-4 mt-3 text-center">Generate Flashcards</h1>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text"
                        className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        rows="4"
                    />
                    <button
                        onClick={handleSubmit}
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Generate Flashcards
                    </button>
                </div>

                {flashcards.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-2">Generated Flashcards</h2>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {flashcards.map((flashcard, index) => (
                                <div key={index} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold">Front:</h3>
                                        <p>{flashcard.front}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">Back:</h3>
                                        <p>{flashcard.back}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {flashcards.length > 0 && (
                    <div className="mt-4 flex justify-center">
                        <button
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            onClick={handleOpenDialog}
                        >
                            Save Flashcards
                        </button>
                    </div>
                )}

                {dialogOpen && (
                    <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-65">
                        <div className="p-6 rounded-lg shadow-lg w-full max-w-md bg-white">
                            <h2 className="text-lg font-semibold">Save Flashcard Set</h2>
                            <p className="mt-2 text-gray-600">Please enter a name for your flashcard set.</p>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Set Name"
                                value={setName}
                                onChange={(e) => setSetName(e.target.value)}
                                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
                            />
                            <div className="mt-4 flex justify-end space-x-2">
                                <button
                                    onClick={handleCloseDialog}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveFlashcards}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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
