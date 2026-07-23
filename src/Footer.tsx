import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Byggio</span>
      <Link to="/integritetspolicy">Integritetspolicy</Link>
    </footer>
  )
}
export default Footer