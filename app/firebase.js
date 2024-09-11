// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwnvPtHzJJqPGFEAsU4Cwml9rL9DO4SFE",
    authDomain: "flashcards-c9678.firebaseapp.com",
    projectId: "flashcards-c9678",
    storageBucket: "flashcards-c9678.appspot.com",
    messagingSenderId: "1065443634071",
    appId: "1:1065443634071:web:38860a31d275dc6359f2d2",
    measurementId: "G-FNEZFHYSMY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

// Export the Firestore instance
export { db };
