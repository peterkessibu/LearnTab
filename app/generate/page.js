'use client'

import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { doc, collection, getDoc, writeBatch } from 'firebase/firestore'
import { db } from '../firebase' // Adjust the import path to your Firebase config

export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)

    const { user } = useUser() // Retrieve user from Clerk

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }

        try {
            const response = await fetch('/api/chat/route', {
                method: 'POST',
                body: JSON.stringify({ text }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            // Check if data has the expected structure
            console.log('Generated flashcards:', data)
            if (!Array.isArray(data)) {
                throw new Error('Unexpected response format')
            }

            setFlashcards(data)
        } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
        }
    }


    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)

    const saveFlashcards = async () => {
        if (!setName.trim()) {
            alert('Please enter a name for your flashcard set.')
            return
        }

        try {
            if (!user || !user.id) {
                throw new Error('User not authenticated')
            }

            const userDocRef = doc(collection(db, 'users'), user.id)
            const userDocSnap = await getDoc(userDocRef)

            const batch = writeBatch(db)

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data()
                const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
                batch.update(userDocRef, { flashcardSets: updatedSets })
            } else {
                batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
            }

            const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
            batch.set(setDocRef, { flashcards })

            await batch.commit()

            alert('Flashcards saved successfully!')
            handleCloseDialog()
            setSetName('')
        } catch (error) {
            console.error('Error saving flashcards:', error)
            alert('An error occurred while saving flashcards. Please try again.')
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-4">Generate Flashcards</h1>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text"
                className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
                rows="4"
            />
            <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
                Generate Flashcards
            </button>

            {/* Flashcard display */}
            {flashcards.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Generated Flashcards</h2>
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
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                        onClick={handleOpenDialog}
                    >
                        Save Flashcards
                    </button>
                </div>
            )}
            {dialogOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
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
        </div>
    )
}
