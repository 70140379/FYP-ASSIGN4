// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";           // <-- Add this
import { getFirestore } from "firebase/firestore"; // <-- And this
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxeNhuNBSi5JjHcZ1kZ5mlqjMbWvQnioI",
  authDomain: "web-assignment4-edd70.firebaseapp.com",
  projectId: "web-assignment4-edd70",
  storageBucket: "web-assignment4-edd70.firebasestorage.app",
  messagingSenderId: "460900250573",
  appId: "1:460900250573:web:f246a993cd6e7e00960a84",
  measurementId: "G-5XSH27YDP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);    // Now this works
export const db = getFirestore(app); // And this too
export const storage = getStorage(app);