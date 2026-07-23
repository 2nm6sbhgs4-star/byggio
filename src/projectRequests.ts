import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export type ProjectRequest = {
  userId: string
  projectSlug: string
  projectTitle: string
  variantLabel?: string
  inputValues: Record<string, string>
  name: string
  email: string
  phone: string
  postnummer: string
  postnummerPrefix: string
  message: string
  status: 'open' | 'closed'
  createdAt: Timestamp
}

export async function publishProjectRequest(data: {
  userId: string
  projectSlug: string
  projectTitle: string
  variantLabel?: string
  inputValues: Record<string, string>
  name: string
  email: string
  phone: string
  postnummer: string
  message: string
}) {
  const postnummerPrefix = data.postnummer.replace(/\s/g, '').slice(0, 2)
  await addDoc(collection(db, 'projectRequests'), {
    ...data,
    postnummerPrefix,
    status: 'open',
    createdAt: Timestamp.now(),
  })
}