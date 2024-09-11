'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs' 
import { useRouter, useSearchParams } from 'next/navigation'
import { db } from '../firebase' 
import { doc, collection, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore'

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [flipped, setFlipped] = useState({})
    const router = useRouter()
    const searchParams = useSearchParams()
    const search = searchParams.get('id')

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(collection(db, 'users'), user.id)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return

            const colRef = collection(doc(collection(db, 'users'), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []
            docs.forEach((doc) => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [search, user])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)

    const saveFlashcards = async () => {
        if (!setName.trim()) {
            alert('Please enter a name for your flashcard set.')
            return
        }

        try {
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
        <div className="max-w-3xl mx-auto mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {flashcards.map((flashcard) => (
                    <div key={flashcard.id} className="relative bg-white shadow-md rounded-lg overflow-hidden group perspective">
                        <div
                            className="w-full h-full transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180"
                            onClick={() => handleCardClick(flashcard.id)}
                        >
                            {/* Front of the card */}
                            <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-4">
                                <h3 className="text-xl font-semibold">{flashcard.front}</h3>
                            </div>

                            {/* Back of the card */}
                            <div className="absolute w-full h-full bg-white backface-hidden transform rotate-y-180 flex items-center justify-center p-4">
                                <h3 className="text-xl font-semibold">{flashcard.back}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {flashcards.length > 0 && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleOpenDialog}
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
                    >
                        Save Flashcards
                    </button>
                </div>
            )}

            {dialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">Save Flashcard Set</h2>
                        <p className="mb-4">Please enter a name for your flashcard set.</p>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Set Name"
                            value={setName}
                            onChange={(e) => setSetName(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCloseDialog}
                                className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveFlashcards}
                                className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
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
