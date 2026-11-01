import { useEffect, useRef } from 'react'
import { ENEMY_A, ENEMY_B, SHIP, drawSprite } from './sprites'

type Enemy = { col: number; row: number; alive: boolean; enter: number }
type Laser = { x: number; y: number }
type Bit = { x: number; y: number; vx: number; vy: number; life: number; size: number }
type Burst = { x: number; y: number; t: number }

const BURST_TIME = 0.42 // duração da micro explosão do clique (s)

const LASER_SPEED = 760
const TOP = 64 // altura da primeira fileira de inimigos
const PLAYER_IDLE = 2.5 // sem mexer o mouse por esse tempo, a nave joga sozinha
const MAX_BANK = 0.32 // inclinação máxima nas curvas (radianos)

// Mini Galaga dentro de uma caixa (curiosidade na seção de missões).
// Com o cursor dentro da caixa, a nave segue o mouse (até a formação de inimigos) e cada clique atira.
// Com o cursor fora, parado ou no celular, ela joga sozinha.
// Movimento com física de mola: aceleração, inércia, inclinação nas curvas e propulsor.
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
    const bits: Bit[] = [] // explosões
    const trail: Bit[] = [] // rastro do propulsor
    const bursts: Burst[] = [] // micro explosões dos cliques

    // estado físico da nave
    const ship = { x: 0, y: 0, vx: 0, vy: 0, bank: 0, recoil: 0, flash: 0 }
    let baseY = 0
    let client: { x: number; y: number } | null = null // posição do cursor na janela
    let lastPointer = -99
    let lockedTarget: Enemy | null = null

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
    const enemyPos = (e: Enemy, at = t) => {
      const sp = spacing()
      const startX = w / 2 - ((cols - 1) * sp) / 2
      const sway = Math.sin(at * 0.7) * Math.min(60, w * 0.05)
      const bob = Math.sin(at * 2 + e.col * 0.6) * 3
      const enterOffset = Math.max(0, e.enter) * -260
      return { x: startX + e.col * sp + sway, y: TOP + e.row * 34 + bob + enterOffset }
    }

    const spawn = () => {
      enemies = []
      lockedTarget = null
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) enemies.push({ col: c, row: r, alive: true, enter: 1 + (r * cols + c) * 0.04 })
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const r = section.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      px = w < 640 ? 2 : 3
      cols = Math.max(5, Math.min(10, Math.floor(w / 110)))
      baseY = h - 56
      if (!ship.x) {
        ship.x = w / 2
        ship.y = baseY
      }
      spawn()
      enemies.forEach((e) => (e.enter = 0))
      if (reduce) draw()
    }

    const fire = () => {
      lasers.push({ x: ship.x, y: ship.y - 6 })
      ship.recoil = 1
      ship.flash = 1
    }

    const clickBurst = (x: number, y: number) => {
      bursts.push({ x, y, t: 0 })
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 90 + Math.random() * 160
        bits.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.55 + Math.random() * 0.25, size: Math.max(1.5, px * 0.67) })
      }
    }

    const explode = (x: number, y: number) => {
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.3
        const s = 60 + Math.random() * 140
        bits.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, size: px })
      }
    }

    // Inimigo vivo mais perto; mantém o alvo atual enquanto ele existir (evita a nave "tremer")
    const pickTarget = (alive: Enemy[]) => {
      if (lockedTarget && lockedTarget.alive) return lockedTarget
      lockedTarget = alive.reduce((a, b) => (Math.abs(enemyPos(a).x - ship.x) < Math.abs(enemyPos(b).x - ship.x) ? a : b))
      return lockedTarget
    }

    const update = (dt: number) => {
      t += dt
      enemies.forEach((e) => (e.enter = Math.max(-1, e.enter - dt * 1.6)))
      const alive = enemies.filter((e) => e.alive && e.enter <= 0)
      const shipH = SHIP.length * px

      // cursor relativo à caixa (recalculado todo quadro: acompanha a rolagem)
      const r = section.getBoundingClientRect()
      const inside = !!client && client.x >= r.left && client.x <= r.right && client.y >= r.top && client.y <= r.bottom
      const local = inside && client ? { x: client.x - r.left, y: client.y - r.top } : null

      const auto = !local || t - lastPointer > PLAYER_IDLE

      // ---- alvo do movimento ----
      let goalX = w / 2
      let goalY = baseY
      let aligned = false
      // limite de cima: logo abaixo da formação de inimigos
      const minY = TOP + rows * 34 + ENEMY_A.length * px + 40
      if (!auto && local) {
        goalX = local.x
        goalY = Math.min(baseY, Math.max(minY, local.y - shipH / 2))
      } else if (alive.length) {
        const target = pickTarget(alive)
        const p = enemyPos(target)
        // mira na frente: onde o inimigo vai estar quando o tiro chegar
        const travel = (ship.y - p.y) / LASER_SPEED
        goalX = enemyPos(target, t + travel).x
        goalY = baseY + Math.sin(t * 1.3) * 6 // leve flutuação
        aligned = Math.abs(goalX - ship.x) < 6
      }

      // ---- física de mola com amortecimento ----
      const k = auto ? 38 : 95
      const c = auto ? 11 : 17
      ship.vx += ((goalX - ship.x) * k - ship.vx * c) * dt
      ship.vy += ((goalY - ship.y) * k * 0.6 - ship.vy * c) * dt
      ship.x += ship.vx * dt
      ship.y += ship.vy * dt
      ship.x = Math.max(20, Math.min(w - 20, ship.x))
      // inclina na direção do movimento, suavizado
      const targetBank = Math.max(-MAX_BANK, Math.min(MAX_BANK, ship.vx / 900))
      ship.bank += (targetBank - ship.bank) * Math.min(1, dt * 10)
      ship.recoil = Math.max(0, ship.recoil - dt * 8)
      ship.flash = Math.max(0, ship.flash - dt * 12)

      // rastro do propulsor (mais forte quanto maior a velocidade)
      const speed = Math.hypot(ship.vx, ship.vy)
      if (Math.random() < 0.5 + Math.min(0.5, speed / 600)) {
        trail.push({
          x: ship.x + (Math.random() - 0.5) * px * 2,
          y: ship.y + SHIP.length * px + 2,
          vx: -ship.vx * 0.15 + (Math.random() - 0.5) * 20,
          vy: 60 + Math.random() * 60,
          life: 0.6 + Math.min(0.4, speed / 900),
          size: px * (Math.random() < 0.3 ? 1 : 0.67),
        })
      }

      // ---- tiros ----
      fireCd -= dt
      const canAutoFire = auto ? aligned || fireCd < -0.6 : true
      if (fireCd <= 0 && alive.length && canAutoFire) {
        fire()
        fireCd = auto ? 0.45 : 0.6
      }

      updateEffects(dt)
    }

    const updateEffects = (dt: number) => {
      const alive = enemies.filter((e) => e.alive && e.enter <= 0)
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

      for (let i = bursts.length - 1; i >= 0; i--) {
        bursts[i].t += dt
        if (bursts[i].t > BURST_TIME) bursts.splice(i, 1)
      }

      for (const list of [bits, trail]) {
        for (let i = list.length - 1; i >= 0; i--) {
          const b = list[i]
          b.x += b.vx * dt
          b.y += b.vy * dt
          b.vx *= 0.95
          b.vy *= 0.95
          b.life -= dt * (list === bits ? 1.8 : 2.4)
          if (b.life <= 0) list.splice(i, 1)
        }
      }

      if (!enemies.some((e) => e.alive)) {
        respawnIn += dt
        if (respawnIn > 1.4) {
          respawnIn = 0
          spawn()
        }
      }
    }

    const drawShip = () => {
      const shipH = SHIP.length * px
      ctx.save()
      ctx.translate(ship.x, ship.y + ship.recoil * 3 + shipH / 2)
      ctx.rotate(ship.bank)
      // ao inclinar, a nave "afina" um pouco (efeito de curva)
      ctx.scale(1 - Math.abs(ship.bank) * 0.35, 1)
      // propulsor: chama que pisca, maior em aceleração
      const thrust = 0.6 + Math.min(1, Math.abs(ship.vy) / 300 + Math.abs(ship.vx) / 900)
      const flame = (2 + Math.random() * 2) * thrust * px
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.fillRect(-px / 2, shipH / 2, px, flame)
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.fillRect(-px * 1.5, shipH / 2, px * 3, flame * 0.55)
      drawSprite(ctx, SHIP, 0, -shipH / 2, px, '#ffffff', '#e9a46a')
      // clarão no bico ao atirar
      if (ship.flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${ship.flash})`
        ctx.beginPath()
        ctx.arc(0, -shipH / 2 - 2, 4 + ship.flash * 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
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
      for (const l of lasers) {
        ctx.fillStyle = 'rgba(255,255,255,0.25)'
        ctx.fillRect(l.x - 2, l.y, 4, 22) // brilho
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(l.x - 1, l.y, 2, 12)
      }
      for (const b of trail) {
        ctx.fillStyle = `rgba(255,255,255,${b.life * 0.5})`
        ctx.fillRect(b.x, b.y, b.size, b.size)
      }
      for (const b of bits) {
        ctx.fillStyle = `rgba(255,255,255,${b.life})`
        ctx.fillRect(b.x, b.y, b.size, b.size)
      }
      for (const b of bursts) {
        const p = b.t / BURST_TIME
        const ease = 1 - (1 - p) ** 3
        ctx.strokeStyle = `rgba(255,255,255,${(1 - p) * 0.9})`
        ctx.lineWidth = 2 * (1 - p) + 0.5
        ctx.beginPath()
        ctx.arc(b.x, b.y, 3 + ease * 26, 0, Math.PI * 2)
        ctx.stroke()
        if (p < 0.35) {
          const f = 1 - p / 0.35
          ctx.fillStyle = `rgba(255,255,255,${f})`
          ctx.beginPath()
          ctx.arc(b.x, b.y, 2 + f * 5, 0, Math.PI * 2)
          ctx.fill()
          // cruz de brilho estilo pixel
          ctx.fillRect(b.x - 9 * f, b.y - 1, 18 * f, 2)
          ctx.fillRect(b.x - 1, b.y - 9 * f, 2, 18 * f)
        }
      }
      drawShip()
      // placar
      ctx.font = '11px Silkscreen, monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.textAlign = 'left'
      ctx.fillText(`SCORE ${String(score).padStart(6, '0')}`, 18, 30)
      ctx.textAlign = 'right'
      ctx.fillText(`HI ${String(hi).padStart(6, '0')}`, w - 18, 30)
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033)
      last = now
      if (visible) {
        update(dt)
        draw()
      }
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return // no celular a nave joga sozinha
      client = { x: e.clientX, y: e.clientY }
      lastPointer = t
    }
    const onDown = (e: PointerEvent) => {
      const r = section.getBoundingClientRect()
      if (e.clientY < r.top || e.clientY > r.bottom || e.clientX < r.left || e.clientX > r.right) return
      clickBurst(e.clientX - r.left, e.clientY - r.top)
      if ((e.target as Element).closest('a,button,input')) return
      if (e.pointerType !== 'touch') client = { x: e.clientX, y: e.clientY }
      lastPointer = t
      fire()
    }
    // rolar a página conta como "mexer": a nave continua seguindo o cursor
    const onScroll = () => {
      if (client) lastPointer = t
    }
    // mouse saiu da janela: volta a jogar sozinha
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) client = null
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      last = performance.now()
    })
    io.observe(section)
    const ro = new ResizeObserver(resize)
    ro.observe(section)
    resize()
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerout', onOut)
    if (!reduce) raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerout', onOut)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />
}
