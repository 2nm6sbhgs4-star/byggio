import { useParams, Link } from 'react-router-dom'
import { projects } from './projects'
import { calculators } from './calculators'
import Calculator from './Calculator'

function ProjectPage() {
  const { projectId } = useParams()
  const project = projects.find((p) => p.slug === projectId)

  if (!project) {
    return (
      <div className="project-page">
        <p>Projektet hittades inte.</p>
        <Link to="/">Tillbaka till startsidan</Link>
      </div>
    )
  }

  const calcConfig = calculators[project.slug]

  return (
    <div className="project-page">
      <Link to="/" className="back-link">← Tillbaka</Link>
      <div className="icon">{project.icon}</div>
      <h1>{project.title}</h1>
      <p>{project.text}</p>

      {calcConfig ? (
        <Calculator config={calcConfig} projectSlug={project.slug} projectTitle={project.title} />
      ) : (
        <div className="coming-soon">Beräkningsverktyg kommer snart för {project.title}.</div>
      )}
    </div>
  )
}
export default ProjectPage