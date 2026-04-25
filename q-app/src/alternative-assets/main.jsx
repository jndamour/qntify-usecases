import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AltApp from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AltApp />
  </StrictMode>
)
