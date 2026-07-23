import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ADSENSE_CLIENT_ID = 'ca-pub-2770816718754673'

function loadAdSenseScript() {
  if (document.getElementById('adsense-script')) return // redan laddat

  const script = document.createElement('script')
  script.id = 'adsense-script'
  script.async = true
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('byggio-cookie-consent')
    if (!consent) {
      setVisible(true)
    } else if (consent === 'accepted') {
      loadAdSenseScript()
    }
  }, [])

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem('byggio-cookie-consent', accepted ? 'accepted' : 'declined')
    setVisible(false)
    if (accepted) loadAdSenseScript()
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