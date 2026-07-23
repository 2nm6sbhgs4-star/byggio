import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getContractorProfile, type ContractorProfile } from './contractors'
import { getMatchingRequests, type ProjectRequest } from './projectRequests'

function ContractorDashboardPage() {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [requests, setRequests] = useState<ProjectRequest[]>([])
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!user) { setChecking(false); return }
    getContractorProfile(user.uid).then(async (p) => {
      setProfile(p)
      if (p) {
        const matches = await getMatchingRequests(p.postnummerPrefix, p.tradeTypes)
        setRequests(matches)
      }
      setChecking(false)
    })
  }, [user])

  if (loading || checking) return <div className="project-page"><p>Laddar...</p></div>

  if (!user) {
    return (
      <div className="project-page">
        <p>Du måste vara inloggad för att se hantverkarpanelen.</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="project-page">
        <h1>Hantverkarpanel</h1>
        <p>Du är inte registrerad som hantverkarpartner än.</p>
        <Link to="/bli-hantverkare" className="main-button">Registrera ditt företag</Link>
      </div>
    )
  }

  return (
    <div className="project-page">
      <h1>Hantverkarpanel</h1>
      <p>Förfrågningar som matchar {profile.companyName} (postnummerregion {profile.postnummerPrefix}xx)</p>

      {requests.length === 0 && <p className="save-hint">Inga matchande förfrågningar just nu.</p>}

      <div className="saved-list">
        {requests.map((r) => (
          <div className="saved-card request-card" key={r.id}>
            <div>
              <h3>{r.projectTitle}{r.variantLabel ? ` – ${r.variantLabel}` : ''}</h3>
              <p className="saved-details">
                {Object.entries(r.inputValues)
                  .filter(([, v]) => v)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' · ')}
              </p>
              {r.message && <p className="saved-details">"{r.message}"</p>}
              <p className="saved-details">
                {r.name} · {r.phone} · {r.postnummer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ContractorDashboardPage