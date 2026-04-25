import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EmApp from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmApp />
  </StrictMode>
)
