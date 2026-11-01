import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

type Star = { x: number; y: number; z: number; tw: number }
type Meteor = { x: number; y: number; vx: number; vy: number; life: number }

// Fundo fixo: campo de estrelas caindo (como no Galaga), estrelas cadentes e um brilho que segue o mouse.
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const sx = useSpring(mx, { stiffness: 120, damping: 25 })
  const sy = useSpring(my, { stiffness: 120, damping: 25 })
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, rgb(255 255 255 / 0.05), transparent 70%)`

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0
    let h = 0
    let stars: Star[] = []
    const meteors: Meteor[] = []
    let parallax = 0
    let targetParallax = 0
    let raf = 0
    let last = performance.now()

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 5200)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() < 0.6 ? 1 : Math.random() < 0.7 ? 2 : 3, // camada: 1 longe, 3 perto
        tw: Math.random() * Math.PI * 2,
      }))
      if (reduce) draw(0)
    }

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h)
      parallax += (targetParallax - parallax) * 0.05
      for (const s of stars) {
        s.y += s.z * s.z * 9 * dt
        s.tw += dt * 2
        if (s.y > h) {
          s.y = -2
          s.x = Math.random() * w
        }
        const size = s.z === 3 ? 1.6 : s.z === 2 ? 1.1 : 0.7
        const alpha = (s.z === 3 ? 0.9 : s.z === 2 ? 0.6 : 0.35) * (0.75 + Math.sin(s.tw) * 0.25)
        ctx.fillStyle = `rgba(255,255,255,${alpha})`
        const x = (((s.x + parallax * s.z * 6) % w) + w) % w
        ctx.fillRect(x, s.y, size, size * (s.z === 3 ? 2.2 : 1))
      }
      // estrela cadente de vez em quando
      if (!reduce && Math.random() < dt * 0.12) {
        meteors.push({ x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.4, vx: -520, vy: 260, life: 1 })
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx * dt
        m.y += m.vy * dt
        m.life -= dt * 1.1
        if (m.life <= 0) {
          meteors.splice(i, 1)
          continue
        }
        const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.18, m.y - m.vy * 0.18)
        g.addColorStop(0, `rgba(255,255,255,${m.life * 0.8})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 0.18, m.y - m.vy * 0.18)
        ctx.stroke()
      }
    }

    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05)
      last = t
      draw(dt)
      raf = requestAnimationFrame(loop)
    }

    const move = (e: PointerEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      targetParallax = (e.clientX / window.innerWidth - 0.5) * -4
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move)
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
    }
  }, [mx, my])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink" aria-hidden>
      <canvas ref={canvasRef} className="absolute inset-0" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      {/* vinheta para dar profundidade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(0_0_0/0.7)_100%)]" />
    </div>
  )
}
