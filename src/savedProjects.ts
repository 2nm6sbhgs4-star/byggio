import { collection, addDoc, query, where, orderBy, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export type SavedProject = {
  id: string
  userId: string
  projectSlug: string
  projectTitle: string
  variantLabel?: string
  inputValues: Record<string, string>
  createdAt: Timestamp
}

export async function saveProject(
  userId: string,
  projectSlug: string,
  projectTitle: string,
  inputValues: Record<string, string>,
  variantLabel?: string
) {
  await addDoc(collection(db, 'savedProjects'), {
    userId,
    projectSlug,
    projectTitle,
    variantLabel: variantLabel ?? null,
    inputValues,
    createdAt: Timestamp.now(),
  })
}

export async function getUserProjects(userId: string): Promise<SavedProject[]> {
  const q = query(
    collection(db, 'savedProjects'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SavedProject))
}

export async function deleteSavedProject(projectId: string) {
  await deleteDoc(doc(db, 'savedProjects', projectId))
}