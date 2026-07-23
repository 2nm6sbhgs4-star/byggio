import { Link } from 'react-router-dom'
import { projects } from './projects'

function ProjectCards() {
  return (
    <section className="projects" id="projects">
      <h2>Vad vill du bygga idag?</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <Link to={`/${project.slug}`} className="project-card" key={project.slug}>
            {project.icon.startsWith('<svg') ? (
              <div className="icon" dangerouslySetInnerHTML={{ __html: project.icon }} />
            ) : (
              <div className="icon">{project.icon}</div>
            )}
            <h3>{project.title}</h3>
            <p>{project.text}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
export default ProjectCards