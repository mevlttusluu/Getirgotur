import { useState } from 'react'
import '../login.css'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Buraya gerçek giriş isteğini (API) ekleyebilirsin
      onLogin({ email, password })
    } catch (err) {
      setError('Giriş yapılamadı, lütfen bilgilerinizi kontrol edin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <img src="/logo.jpeg" alt="Getirgötür" />
        </div>
        <h1 className="login-title">Getirgötür’e Hoş Geldin</h1>
        <p className="login-subtitle">Devam etmek için hesabına giriş yap.</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            E‑posta
            <input
              type="email"
              className="login-input"
              placeholder="ornek@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-label">
            Şifre
            <input
              type="password"
              className="login-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <button className="login-secondary-button" type="button">
          Şifremi unuttum
        </button>
      </div>
    </div>
  )
}