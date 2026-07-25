import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export async function submitFeedback(data: {
  userId: string | null
  email: string | null
  message: string
}) {
  await addDoc(collection(db, 'feedback'), {
    ...data,
    createdAt: Timestamp.now(),
  })
}