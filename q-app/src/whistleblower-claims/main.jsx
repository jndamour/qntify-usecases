import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import WBApp from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WBApp />
  </StrictMode>
)
