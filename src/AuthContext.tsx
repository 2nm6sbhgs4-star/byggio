import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

type AuthContextType = {
  user: User | null
  loading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    // Picks up the result after signInWithRedirect sends the user back here.
    getRedirectResult(auth).catch((err) => {
      console.error('Inloggning misslyckades:', err)
    })
    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    // A full-page redirect (rather than a popup) so login also works with ad
    // blockers and privacy settings that block popups or cross-window auth.
    await signInWithRedirect(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth måste användas inom AuthProvider')
  return context
}