import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getContractorProfile, type ContractorProfile } from './contractors'
import { getMatchingRequests, type ProjectRequest } from './projectRequests'
import { projects } from './projects'

function timeAgo(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) return 'Just nu'
  if (diffHours < 24) return `${diffHours} tim sedan`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} dag${diffDays > 1 ? 'ar' : ''} sedan`
}

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

  if (loading || checking) return <div className="dashboard"><p>Laddar...</p></div>

  if (!user) {
    return (
      <div className="dashboard">
        <p>Du måste vara inloggad för att se hantverkarpanelen.</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="dashboard dashboard-empty">
        <h1>Hantverkarpanel</h1>
        <p>Du är inte registrerad som hantverkarpartner än.</p>
        <Link to="/bli-hantverkare" className="main-button">Registrera ditt företag</Link>
      </div>
    )
  }

  const newCount = requests.filter((r) => {
    const created = r.createdAt?.toDate?.() ?? new Date()
    return Date.now() - created.getTime() < 1000 * 60 * 60 * 24
  }).length

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Hantverkarpanel</h1>
          <p className="dashboard-subtitle">{profile.companyName} · postnummerregion {profile.postnummerPrefix}xx</p>
        </div>
        <Link to="/bli-hantverkare" className="dashboard-edit-link">Redigera profil</Link>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <span className="stat-number">{requests.length}</span>
          <span className="stat-label">Öppna förfrågningar</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{newCount}</span>
          <span className="stat-label">Nya senaste 24h</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{profile.tradeTypes.length}</span>
          <span className="stat-label">Projekttyper ni tar</span>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="dashboard-empty-state">
          <p>Inga matchande förfrågningar just nu. Vi meddelar er så fort en ny dyker upp i ert område.</p>
        </div>
      ) : (
        <div className="request-list">
          {requests.map((r) => {
            const projectMeta = projects.find((p) => p.slug === r.projectSlug)
            const created = r.createdAt?.toDate?.() ?? new Date()
            const isNew = Date.now() - created.getTime() < 1000 * 60 * 60 * 24
            return (
              <div className="request-card" key={r.id}>
                <div className="request-card-icon">{projectMeta?.icon ?? '🔧'}</div>
                <div className="request-card-body">
                  <div className="request-card-top">
                    <h3>{r.projectTitle}{r.variantLabel ? ` – ${r.variantLabel}` : ''}</h3>
                    {isNew && <span className="request-badge">Ny</span>}
                  </div>
                  <p className="saved-details">
                    {Object.entries(r.inputValues)
                      .filter(([, v]) => v)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(' · ')}
                  </p>
                  {r.message && <p className="request-message">"{r.message}"</p>}
                  <div className="request-card-footer">
                    <span>{r.name} · {r.phone} · {r.postnummer}</span>
                    <span className="request-time">{timeAgo(created)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default ContractorDashboardPage