import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import { Analytics } from '@vercel/analytics/react'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Respeita "reduzir movimento" do sistema */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
    {/* Contador de visitas (Vercel Web Analytics) */}
    <Analytics />
  </StrictMode>,
)
