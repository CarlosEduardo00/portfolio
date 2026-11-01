import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import './index.css'
import { applyDesign } from './design'

applyDesign()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Respeita "reduzir movimento" do sistema */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
