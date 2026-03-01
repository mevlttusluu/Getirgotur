const CATEGORIES = [
  { name: 'Atıştırmalık', icon: '🥜', color: '#fef3c7' },
  { name: 'Su & İçecek', icon: '🥤', color: '#dbeafe' },
  { name: 'Meyve & Sebze', icon: '🥬', color: '#dcfce7' },
  { name: 'Süt Ürünleri', icon: '🥛', color: '#fef9c3' },
  { name: 'Kahvaltılık', icon: '🍳', color: '#fce7f3' },
  { name: 'Dondurma', icon: '🍦', color: '#e0e7ff' },
  { name: 'Temel Gıda', icon: '🛒', color: '#f3e8ff' },
  { name: 'Pratik Yemek', icon: '🍱', color: '#ffedd5' },
  { name: 'Et, Tavuk & Balık', icon: '🍗', color: '#fee2e2' },
]

export default function HomePage() {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <img src="/logo.jpeg" alt="Getirgötür" />
          <span className="landing-logo-text">Getirgötür</span>
        </div>

        <nav className="landing-nav">
          <a href="#categories">Kategoriler</a>
          <a href="#how-it-works">Nasıl Çalışır?</a>
          <a href="#contact">İletişim</a>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero hero--with-login">
          <div className="hero-brand">
            <div className="hero-logo-ring">
              <img src="/logo.jpeg" alt="" />
            </div>
            <p className="hero-tagline">bi mutluluk</p>
            <h1 className="hero-headline">Dakikalar içinde kapında</h1>
            <p className="hero-desc">
              Market, restoran, atıştırmalık — hepsi tek uygulamada.
              Bölgenizdeki en iyi işletmelerle çalışıyoruz.
            </p>
          </div>

          <div className="login-panel">
            <div className="login-panel-header">Giriş yap veya kayıt ol</div>
            <form
              className="login-panel-body"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="login-panel-input-row">
                <button type="button" className="login-panel-country">
                  <span className="login-panel-flag">🇹🇷</span>
                  <span className="login-panel-code">+90</span>
                </button>
                <input
                  type="tel"
                  className="login-panel-input"
                  placeholder="Telefon Numarası"
                />
              </div>
              <button type="submit" className="login-panel-submit">
                Telefon numarası ile devam et
              </button>
            </form>
          </div>
        </section>

        <section id="categories" className="categories">
          <h2 className="categories-title">Kategoriler</h2>
          <div className="categories-strip">
            {CATEGORIES.map(({ name, icon, color }) => (
              <button
                key={name}
                className="category-card"
                type="button"
                style={{ '--cat-bg': color }}
              >
                <div className="category-icon">
                  <span className="category-emoji">{icon}</span>
                </div>
                <span className="category-name">{name}</span>
              </button>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="how-it-works">
          <h2>Nasıl Çalışır?</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">1</span>
              <h3>Adresini gir</h3>
              <p>Konumunu seç, yakındaki işletmeleri keşfet.</p>
            </div>
            <div className="step-card">
              <span className="step-num">2</span>
              <h3>Ürünleri seç</h3>
              <p>Binlerce ürün arasından sepetini oluştur.</p>
            </div>
            <div className="step-card">
              <span className="step-num">3</span>
              <h3>Siparişini takip et</h3>
              <p>Anlık takip ile siparişin dakikalar içinde kapında.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-card">
            <h2>İş ortağımız olmak ister misin?</h2>
            <p>
              Restoranın, marketin veya kurye ekibin mi var?
              Getirgötür ile daha fazla müşteriye ulaş.
            </p>
            <button className="contact-button" type="button">
              Başvuru Yap
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} Getirgötür</span>
        <div className="landing-footer-links">
          <a href="#">KVKK</a>
          <a href="#">Gizlilik</a>
          <a href="#">Kullanım Koşulları</a>
        </div>
      </footer>
    </div>
  )
}