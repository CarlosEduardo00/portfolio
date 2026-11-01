import { useEffect, useRef } from 'react'
import { ENEMY_A, ENEMY_B, SHIP, drawSprite } from './sprites'

type Enemy = { col: number; row: number; alive: boolean; enter: number }
type Laser = { x: number; y: number }
type Bit = { x: number; y: number; vx: number; vy: number; life: number }

const LASER_SPEED = 760
const AUTO_FIRE = 0.62 // segundos entre tiros automáticos
const PLAYER_IDLE = 2.5 // sem mexer o mouse por esse tempo, a nave joga sozinha

// Mini Galaga do topo: a nave segue o mouse (ou joga sozinha) e atira na formação de inimigos.
export default function GalagaField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const section = canvas.parentElement!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let px = 3
    let cols = 8
    const rows = 3
    let enemies: Enemy[] = []
    const lasers: Laser[] = []
    const bits: Bit[] = []
    let shipX = 0
    let targetX: number | null = null
    let lastPointer = -99
    let fireCd = 1.2
    let respawnIn = 0
    let score = 0
    let hi = 0
    try {
      hi = Number(localStorage.getItem('galaga-hi') || 0)
    } catch {}
    let t = 0
    let last = performance.now()
    let raf = 0
    let visible = true

    const spacing = () => Math.min(64, (w - 80) / cols)
    const enemyPos = (e: Enemy) => {
      const sp = spacing()
      const startX = w / 2 - ((cols - 1) * sp) / 2
      const sway = Math.sin(t * 0.7) * Math.min(60, w * 0.05)
      const bob = Math.sin(t * 2 + e.col * 0.6) * 3
      const enterOffset = Math.max(0, e.enter) * -260
      return { x: startX + e.col * sp + sway, y: 96 + e.row * 34 + bob + enterOffset }
    }

    const spawn = () => {
      enemies = []
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) enemies.push({ col: c, row: r, alive: true, enter: 1 + (r * cols + c) * 0.04 })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = section.getBoundingClientRect()
      w = window.innerWidth
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      px = w < 640 ? 2 : 3
      cols = Math.max(5, Math.min(10, Math.floor(w / 110)))
      if (!shipX) shipX = w / 2
      spawn()
      enemies.forEach((e) => (e.enter = 0))
      if (reduce) draw()
    }

    const fire = () => lasers.push({ x: shipX, y: h - 62 })

    const explode = (x: number, y: number) => {
      for (let i = 0; i < 14; i++) {
        const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.3
        const s = 60 + Math.random() * 120
        bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 })
      }
    }

    const update = (dt: number) => {
      t += dt
      enemies.forEach((e) => (e.enter = Math.max(-1, e.enter - dt * 1.6)))

      // alvo da nave: mouse (se usado recentemente) ou o inimigo vivo mais próximo
      const alive = enemies.filter((e) => e.alive && e.enter <= 0)
      const auto = t - lastPointer > PLAYER_IDLE || targetX === null
      let goal = targetX ?? w / 2
      if (auto && alive.length) {
        const near = alive.reduce((a, b) => (Math.abs(enemyPos(a).x - shipX) < Math.abs(enemyPos(b).x - shipX) ? a : b))
        goal = enemyPos(near).x
      }
      shipX += (goal - shipX) * Math.min(1, dt * (auto ? 3 : 9))

      fireCd -= dt
      if (fireCd <= 0 && alive.length) {
        fire()
        fireCd = AUTO_FIRE
      }

      for (let i = lasers.length - 1; i >= 0; i--) {
        const l = lasers[i]
        l.y -= LASER_SPEED * dt
        let hit = false
        for (const e of alive) {
          if (!e.alive) continue
          const p = enemyPos(e)
          const ew = ENEMY_A[0].length * px
          const eh = ENEMY_A.length * px
          if (l.x > p.x - ew / 2 && l.x < p.x + ew / 2 && l.y < p.y + eh && l.y > p.y) {
            e.alive = false
            hit = true
            score += e.row === 0 ? 150 : 80
            if (score > hi) {
              hi = score
              try {
                localStorage.setItem('galaga-hi', String(hi))
              } catch {}
            }
            explode(p.x, p.y + eh / 2)
            break
          }
        }
        if (hit || l.y < 60) lasers.splice(i, 1)
      }

      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i]
        b.x += b.vx * dt
        b.y += b.vy * dt
        b.vx *= 0.96
        b.vy *= 0.96
        b.life -= dt * 1.8
        if (b.life <= 0) bits.splice(i, 1)
      }

      if (!enemies.some((e) => e.alive)) {
        respawnIn += dt
        if (respawnIn > 1.4) {
          respawnIn = 0
          spawn()
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const frame = Math.floor(t * 2.5) % 2 === 0 ? ENEMY_A : ENEMY_B
      ctx.globalAlpha = 0.55
      for (const e of enemies) {
        if (!e.alive) continue
        const p = enemyPos(e)
        drawSprite(ctx, frame, p.x, p.y, px, e.row === 0 ? '#ffffff' : '#bdbdbd', '#4a4a4a')
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = '#ffffff'
      for (const l of lasers) ctx.fillRect(l.x - 1, l.y, 2, 12)
      for (const b of bits) {
        ctx.fillStyle = `rgba(255,255,255,${b.life})`
        ctx.fillRect(b.x, b.y, px, px)
      }
      drawSprite(ctx, SHIP, shipX, h - 52, px, '#ffffff', '#7a7a7a')
      // placar
      ctx.font = '600 11px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.textAlign = 'left'
      ctx.fillText(`SCORE ${String(score).padStart(6, '0')}`, 20, 84)
      ctx.textAlign = 'right'
      ctx.fillText(`HI ${String(hi).padStart(6, '0')}`, w - 20, 84)
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (visible) {
        update(dt)
        draw()
      }
      raf = requestAnimationFrame(loop)
    }

    const inside = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      return e.clientY >= r.top && e.clientY <= r.bottom
    }
    const onMove = (e: PointerEvent) => {
      if (!inside(e)) return
      targetX = e.clientX
      lastPointer = t
    }
    const onDown = (e: PointerEvent) => {
      if (!inside(e) || (e.target as Element).closest('a,button,input')) return
      targetX = e.clientX
      lastPointer = t
      fire()
    }

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting))
    io.observe(section)
    const ro = new ResizeObserver(resize)
    ro.observe(section)
    resize()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2" />
}
