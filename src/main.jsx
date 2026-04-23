import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CharacterProvider } from './contexts/CharacterContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CharacterProvider>
      <App />
    </CharacterProvider>
  </StrictMode>,
)