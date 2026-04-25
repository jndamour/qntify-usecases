import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AboutApp from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AboutApp />
  </StrictMode>
)
