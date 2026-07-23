import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('byggio-cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem('byggio-cookie-consent', accepted ? 'accepted' : 'declined')
    setVisible(false)
    // När AdSense är godkänt: ladda in annonsskriptet här dynamiskt om accepted === true
  }

  if (!visible) return null

  return (
    <div className="cookie-banner">
      <p>
        Vi använder cookies för annonsering via Google AdSense.{' '}
        <Link to="/integritetspolicy">Läs mer i vår integritetspolicy</Link>.
      </p>
      <div className="cookie-buttons">
        <button className="cookie-decline" onClick={() => handleChoice(false)}>Avböj</button>
        <button className="cookie-accept" onClick={() => handleChoice(true)}>Acceptera</button>
      </div>
    </div>
  )
}
export default CookieConsent