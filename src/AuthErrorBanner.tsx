import { useAuth } from './AuthContext'

function AuthErrorBanner() {
  const { authError, clearAuthError } = useAuth()

  if (!authError) return null

  return (
    <div className="auth-error-banner">
      <p>{authError}</p>
      <button className="auth-error-close" onClick={clearAuthError} aria-label="Stäng">✕</button>
    </div>
  )
}
export default AuthErrorBanner
