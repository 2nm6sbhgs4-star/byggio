import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { registerContractor, getContractorProfile } from './contractors'
import { projects } from './projects'

function BecomeContractorPage() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  const [companyName, setCompanyName] = useState('')
  const [orgNumber, setOrgNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [postnummer, setPostnummer] = useState('')
  const [tradeTypes, setTradeTypes] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle')
  const [verifiedName, setVerifiedName] = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setChecking(false); return }
    getContractorProfile(user.uid).then((profile) => {
      if (profile) {
        setIsEditing(true)
        setCompanyName(profile.companyName)
        setOrgNumber(profile.orgNumber)
        setPhone(profile.phone)
        setPostnummer(profile.postnummer)
        setTradeTypes(profile.tradeTypes)
        setVerifyStatus('verified')
        setVerifiedName(profile.companyName)
      }
      setChecking(false)
    })
  }, [user])

  const toggleTrade = (slug: string) => {
    setTradeTypes((prev) =>
      prev.includes(slug) ? prev.filter((t) => t !== slug) : [...prev, slug]
    )
  }

  const handleOrgNumberChange = (value: string) => {
    setOrgNumber(value)
    setVerifyStatus('idle')
    setVerifiedName(null)
  }

  const handleVerify = async () => {
    if (!orgNumber) return
    setVerifyStatus('checking')
    try {
      const response = await fetch(`/api/verify-org?orgNumber=${encodeURIComponent(orgNumber)}`)
      const data = await response.json()
      if (data.verified) {
        setVerifyStatus('verified')
        setVerifiedName(data.companyName ?? null)
      } else {
        setVerifyStatus('failed')
        setVerifiedName(null)
      }
    } catch (err) {
      console.error(err)
      setVerifyStatus('failed')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || verifyStatus !== 'verified') return
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

  if (done) {
    return (
      <div className="project-page">
        <h1>{isEditing ? 'Uppgifter uppdaterade!' : 'Du är registrerad!'}</h1>
        <p>Ditt företag är kopplat till ditt konto.</p>
        <button className="main-button" onClick={() => navigate('/hantverkarpanel')}>Till hantverkarpanelen</button>
      </div>
    )
  }

  return (
    <div className="project-page">
      <h1>{isEditing ? 'Redigera din profil' : 'Bli hantverkarpartner'}</h1>
      <p>
        {isEditing
          ? 'Uppdatera era uppgifter nedan.'
          : 'Registrera ditt företag för att få tillgång till projektförfrågningar från privatpersoner.'}
      </p>

      <form className="contractor-form" onSubmit={handleSubmit}>
        <label>
          Företagsnamn
          <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        </label>

        <label>
          Organisationsnummer
          <div className="verify-row">
            <input
              type="text"
              required
              placeholder="XXXXXX-XXXX"
              value={orgNumber}
              onChange={(e) => handleOrgNumberChange(e.target.value)}
            />
            <button
              type="button"
              className="diy-decline"
              onClick={handleVerify}
              disabled={!orgNumber || verifyStatus === 'checking'}
            >
              {verifyStatus === 'checking' ? 'Kollar...' : 'Verifiera'}
            </button>
          </div>
          {verifyStatus === 'verified' && (
            <p className="verify-success">✓ Verifierat{verifiedName ? `: ${verifiedName}` : ''}</p>
          )}
          {verifyStatus === 'failed' && (
            <p className="verify-error">✗ Kunde inte verifiera organisationsnumret. Kontrollera att det är korrekt.</p>
          )}
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

        <button
          type="submit"
          className="main-button"
          disabled={submitting || tradeTypes.length === 0 || verifyStatus !== 'verified'}
        >
          {submitting ? 'Sparar...' : isEditing ? 'Spara ändringar' : 'Registrera företag'}
        </button>
        {verifyStatus !== 'verified' && (
          <p className="save-hint">Verifiera organisationsnumret innan du kan {isEditing ? 'spara' : 'registrera'}.</p>
        )}
      </form>
    </div>
  )
}
export default BecomeContractorPage