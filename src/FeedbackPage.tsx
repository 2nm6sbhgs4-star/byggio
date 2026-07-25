import { useState } from 'react'
import { useAuth } from './AuthContext'
import { submitFeedback } from './feedback'

function FeedbackPage() {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    await submitFeedback({
      userId: user?.uid ?? null,
      email: user?.email ?? null,
      message: message.trim(),
    })
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="project-page">
        <h1>Tack för din feedback!</h1>
        <p>Vi läser allt som skickas in och tar det med oss när vi utvecklar Byggio vidare.</p>
      </div>
    )
  }

  return (
    <div className="project-page">
      <h1>Lämna feedback</h1>
      <p>Berätta hur vi kan hjälpa dig bättre – vilket innehåll saknar du, eller vad skulle du vilja se i Byggio?</p>

      <form className="contractor-form" onSubmit={handleSubmit}>
        <label>
          Din feedback
          <textarea
            required
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Skriv fritt – t.ex. 'Jag skulle vilja ha en kalkylator för...' eller 'Jag saknar information om...'"
          />
        </label>
        <button type="submit" className="main-button" disabled={submitting}>
          {submitting ? 'Skickar...' : 'Skicka feedback'}
        </button>
      </form>
    </div>
  )
}
export default FeedbackPage
