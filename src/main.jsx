import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Loader'ı sayfa yüklendiğinde gizle
const loader = document.getElementById('page-loader')
if (loader) {
  loader.classList.add('hidden')
  loader.addEventListener('transitionend', () => loader.remove(), { once: true })
}
