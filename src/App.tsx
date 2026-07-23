import { Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import ProjectCards from './ProjectCards'
import ProjectPage from './ProjectPage'
import PrivacyPage from './PrivacyPage'
import CookieConsent from './CookieConsent'
import Footer from './Footer'

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
        <Route path="/integritetspolicy" element={<PrivacyPage />} />
        <Route path="/:projectId" element={<ProjectPage />} />
      </Routes>
      <Footer />
      <CookieConsent />
    </div>
  )
}
export default App