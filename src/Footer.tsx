import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Byggio</span>
      <div className="footer-links">
        <Link to="/feedback">Feedback</Link>
        <Link to="/integritetspolicy">Integritetspolicy</Link>
      </div>
    </footer>
  )
}
export default Footer