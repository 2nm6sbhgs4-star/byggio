import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { registerContractor, getContractorProfile } from './contractors'
import { projects } from './projects'

function BecomeContractorPage() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [orgNumber, setOrgNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [postnummer, setPostnummer] = useState('')
  const [tradeTypes, setTradeTypes] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!user) { setChecking(false); return }
    getContractorProfile(user.uid).then((profile) => {
      setAlreadyRegistered(!!profile)
      setChecking(false)
    })
  }, [user])

  const toggleTrade = (slug: string) => {
    setTradeTypes((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    await registerContractor(user.uid, {
      companyName,
      orgNumber,
      email: user.email ?? '',
      phone,
      postnummer,
      tradeTypes,
    })
    setSubmitting(false)
    setDone(true)
  }

  if (loading || checking) return <div className="project-page"><p>Laddar...</p></div>

  if (!user) {
    return (
      <div className="project-page">
        <h1>Bli hantverkarpartner</h1>
        <p>Du måste vara inloggad för att registrera ditt företag.</p>
        <button className="main-button" onClick={loginWithGoogle}>Logga in med Google</button>
      </div>
    )
  }

  if (done || alreadyRegistered) {
    return (
      <div className="project-page">
        <h1>Du är registrerad!</h1>
        <p>Ditt företag är kopplat till ditt konto. Du kommer att se matchande förfrågningar när den funktionen är på plats.</p>
        <button className="main-button" onClick={() => navigate('/')}>Till startsidan</button>
      </div>
    )
  }

  return (
    <div className="project-page">
      <h1>Bli hantverkarpartner</h1>
      <p>Registrera ditt företag för att få tillgång till projektförfrågningar från privatpersoner.</p>

      <form className="contractor-form" onSubmit={handleSubmit}>
        <label>
          Företagsnamn
          <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </label>
        <label>
          Organisationsnummer
          <input type="text" required placeholder="XXXXXX-XXXX" value={orgNumber} onChange={(e) => setOrgNumber(e.target.value)} />
        </label>
        <label>
          Telefonnummer
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Postnummer (verksamhetsort)
          <input type="text" required placeholder="XXX XX" value={postnummer} onChange={(e) => setPostnummer(e.target.value)} />
        </label>

        <div className="trade-checkboxes">
          <p>Vilka typer av projekt tar ni uppdrag inom?</p>
          {projects.map((p) => (
            <label key={p.slug} className="checkbox-label">
              <input
                type="checkbox"
                checked={tradeTypes.includes(p.slug)}
                onChange={() => toggleTrade(p.slug)}
              />
              {p.title}
            </label>
          ))}
        </div>

        <button type="submit" className="main-button" disabled={submitting || tradeTypes.length === 0}>
          {submitting ? 'Registrerar...' : 'Registrera företag'}
        </button>
      </form>
    </div>
  )
}
export default BecomeContractorPage