import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

function Navbar() {
  const { user, loading, loginWithGoogle, logout } = useAuth()

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Byggio</Link>
      <div className="navbar-right">
        <Link to="/feedback" className="feedback-link">💬 Ge feedback</Link>
        {!loading && (
          user ? (
            <div className="user-menu">
              {user.photoURL && <img src={user.photoURL} alt="" className="user-avatar" />}
              <span className="user-name">{user.displayName}</span>
              <Link to="/mina-projekt" className="nav-link">Mina projekt</Link>
              <Link to="/bli-hantverkare" className="nav-link">Bli hantverkarpartner</Link>
              <Link to="/hantverkarpanel" className="nav-link">Hantverkarpanel</Link>
              <button className="nav-button" onClick={logout}>Logga ut</button>
            </div>
          ) : (
            <button className="nav-button" onClick={loginWithGoogle}>Logga in</button>
          )
        )}
      </div>
    </nav>
  )
}
export default Navbar