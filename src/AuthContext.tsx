import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signInWithRedirect, getRedirectResult, signOut, type User } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

type AuthContextType = {
  user: User | null
  loading: boolean
  authError: string | null
  clearAuthError: () => void
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const PENDING_KEY = 'byggio-auth-pending'
const BLOCKED_MESSAGE = 'Inloggningen kunde inte slutföras. Om du använder en annonsblockerare eller strikt spårningsskydd i webbläsaren, prova att stänga av det för den här sidan och försök igen.'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })

    // If we sent the user to Google and they're now back without a signed-in
    // user, the redirect handshake was likely blocked (ad blocker, strict
    // tracking protection) rather than the user just cancelling silently.
    const wasPending = sessionStorage.getItem(PENDING_KEY) === '1'
    if (wasPending) sessionStorage.removeItem(PENDING_KEY)

    getRedirectResult(auth)
      .then((result) => {
        if (wasPending && !result) setAuthError(BLOCKED_MESSAGE)
      })
      .catch((err) => {
        console.error('Inloggning misslyckades:', err)
        if (wasPending) setAuthError(BLOCKED_MESSAGE)
      })

    return unsubscribe
  }, [])

  const loginWithGoogle = async () => {
    setAuthError(null)
    sessionStorage.setItem(PENDING_KEY, '1')
    // A full-page redirect (rather than a popup) so login also works with ad
    // blockers and privacy settings that block popups or cross-window auth.
    await signInWithRedirect(auth, googleProvider)
  }

  const logout = async () => {
    await signOut(auth)
  }

  const clearAuthError = () => setAuthError(null)

  return (
    <AuthContext.Provider value={{ user, loading, authError, clearAuthError, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth måste användas inom AuthProvider')
  return context
}