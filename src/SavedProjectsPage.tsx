import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import { getUserProjects, deleteSavedProject, type SavedProject } from './savedProjects'

function SavedProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getUserProjects(user.uid).then((data) => {
      setProjects(data)
      setLoading(false)
    })
  }, [user])

  const handleDelete = async (id: string) => {
    await deleteSavedProject(id)
    setProjects(projects.filter((p) => p.id !== id))
  }

  if (!user) {
    return (
      <div className="project-page">
        <p>Du måste vara inloggad för att se dina sparade projekt.</p>
      </div>
    )
  }

  return (
    <div className="project-page">
      <h1>Mina sparade projekt</h1>
      {loading && <p>Laddar...</p>}
      {!loading && projects.length === 0 && <p>Du har inga sparade projekt än.</p>}
      <div className="saved-list">
        {projects.map((p) => (
          <div className="saved-card" key={p.id}>
            <div>
              <h3>{p.projectTitle}{p.variantLabel ? ` – ${p.variantLabel}` : ''}</h3>
              <p className="saved-details">
                {Object.entries(p.inputValues)
                  .filter(([, v]) => v)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' · ')}
              </p>
            </div>
            <div className="saved-actions">
              <Link to={`/${p.projectSlug}`} className="cookie-decline">Öppna</Link>
              <button className="cookie-decline" onClick={() => handleDelete(p.id)}>Ta bort</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default SavedProjectsPage