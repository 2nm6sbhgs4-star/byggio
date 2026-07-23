import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export type ProjectRequest = {
  id: string
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

export async function getMatchingRequests(
  postnummerPrefix: string,
  tradeTypes: string[]
): Promise<ProjectRequest[]> {
  if (tradeTypes.length === 0) return []
  const q = query(
    collection(db, 'projectRequests'),
    where('postnummerPrefix', '==', postnummerPrefix),
    where('projectSlug', 'in', tradeTypes),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ProjectRequest))
}