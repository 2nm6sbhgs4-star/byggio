import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">Byggio</Link>
      <button className="nav-button">Logga in</button>
    </nav>
  )
}
export default Navbar