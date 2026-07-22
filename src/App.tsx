import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import ProjectCards from './ProjectCards'
import ProjectPage from './ProjectPage'

function Home() {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Bygg smartare med <span>Byggio</span></h1>
          <p>Din digitala byggassistent som hjälper dig planera, beräkna och genomföra projekt.</p>
          <button className="main-button" onClick={scrollToProjects}>Starta ett projekt</button>
        </div>
      </section>
      <ProjectCards />
    </>
  )
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:projectId" element={<ProjectPage />} />
      </Routes>
    </div>
  )
}
export default App