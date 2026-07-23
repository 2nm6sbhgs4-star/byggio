import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyC16_CV1dNW3L2WNLae6aeWIKDxUWchCNI",
  authDomain: "byggio-b698a.firebaseapp.com",
  projectId: "byggio-b698a",
  storageBucket: "byggio-b698a.firebasestorage.app",
  messagingSenderId: "442466533373",
  appId: "1:442466533373:web:f6ba4c59c62319ccafe394",
  measurementId: "G-K02BXM9QJ3"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)