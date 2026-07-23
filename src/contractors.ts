import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from './firebase'

export type ContractorProfile = {
  uid: string
  companyName: string
  orgNumber: string
  email: string
  phone: string
  postnummer: string
  postnummerPrefix: string
  tradeTypes: string[]
  createdAt: Timestamp
}

export async function registerContractor(
  uid: string,
  data: {
    companyName: string
    orgNumber: string
    email: string
    phone: string
    postnummer: string
    tradeTypes: string[]
  }
) {
  const postnummerPrefix = data.postnummer.replace(/\s/g, '').slice(0, 2)
  await setDoc(doc(db, 'contractors', uid), {
    uid,
    ...data,
    postnummerPrefix,
    createdAt: Timestamp.now(),
  })
}

export async function getContractorProfile(uid: string): Promise<ContractorProfile | null> {
  const snap = await getDoc(doc(db, 'contractors', uid))
  if (!snap.exists()) return null
  return snap.data() as ContractorProfile
}