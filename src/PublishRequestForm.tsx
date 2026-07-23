import { useState } from 'react'
import { useAuth } from './AuthContext'
import { publishProjectRequest } from './projectRequests'

function PublishRequestForm({ projectSlug, projectTitle, variantLabel, inputValues, onClose }: {
  projectSlug: string
  projectTitle: string
  variantLabel?: string
  inputValues: Record<string, string>
  onClose: () => void
}) {
  const { user, loginWithGoogle } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [postnummer, setPostnummer] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    await publishProjectRequest({
      userId: user.uid,
      projectSlug,
      projectTitle,
      variantLabel,
      inputValues,
      name,
      email: user.email ?? '',
      phone,
      postnummer,
      message,
    })
    setSubmitting(false)
    setDone(true)
  }

  if (!user) {
    return (
      <div className="publish-box">
        <p>Du måste vara inloggad för att skicka en offertförfrågan.</p>
        <button className="main-button" onClick={loginWithGoogle}>Logga in med Google</button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="publish-box">
        <h3>Förfrågan skickad! ✓</h3>
        <p>Din förfrågan är nu synlig för hantverkare i ditt område. Du kontaktas direkt av de som är intresserade.</p>
      </div>
    )
  }

  return (
    <div className="publish-box">
      <h3>Skicka offertförfrågan</h3>
      <p className="disclaimer">
        Dina mått och materialberäkning för {projectTitle}{variantLabel ? ` – ${variantLabel}` : ''} skickas med automatiskt.
      </p>
      <form className="contractor-form" onSubmit={handleSubmit}>
        <label>
          Namn
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Telefonnummer
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Postnummer (var projektet ska utföras)
          <input type="text" required placeholder="XXX XX" value={postnummer} onChange={(e) => setPostnummer(e.target.value)} />
        </label>
        <label>
          Meddelande (valfritt)
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
        </label>
        <div className="publish-buttons">
          <button type="button" className="cookie-decline" onClick={onClose}>Avbryt</button>
          <button type="submit" className="main-button" disabled={submitting}>
            {submitting ? 'Skickar...' : 'Skicka förfrågan'}
          </button>
        </div>
      </form>
    </div>
  )
}
export default PublishRequestForm