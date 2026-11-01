import { useEffect, useRef } from 'react'

export type CloudItem = { name: string; src: string }

type Vec = [number, number, number]
type Mat = number[] // 3x3 em ordem de linhas

const ID: Mat = [1, 0, 0, 0, 1, 0, 0, 0, 1]
const mul = (a: Mat, b: Mat): Mat => {
  const r = new Array(9).fill(0)
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) r[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j]
  return r
}
const apply = (m: Mat, v: Vec): Vec => [
  m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
  m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
  m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
]
// rotação de ângulo `a` em torno de um eixo unitário (fórmula de Rodrigues)
const axisAngle = ([x, y, z]: Vec, a: number): Mat => {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const t = 1 - c
  return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c]
}
// mantém a matriz ortonormal (evita deformar com o acúmulo de rotações)
const orthonormalize = (m: Mat): Mat => {
  const norm = (v: Vec): Vec => {
    const l = Math.hypot(...v) || 1
    return [v[0] / l, v[1] / l, v[2] / l]
  }
  const a = norm([m[0], m[1], m[2]])
  const bRaw: Vec = [m[3], m[4], m[5]]
  const d = a[0] * bRaw[0] + a[1] * bRaw[1] + a[2] * bRaw[2]
  const b = norm([bRaw[0] - d * a[0], bRaw[1] - d * a[1], bRaw[2] - d * a[2]])
  const c: Vec = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  return [...a, ...b, ...c]
}

const DRAG = 0.0075 // radianos por pixel arrastado
const FRICTION = 2.2 // quanto maior, mais rápido a inércia acaba
const AUTO: [number, number] = [0.06, 0.22] // giro automático (rad/s em x e y)

// Nuvem 3D de tecnologias: arraste para girar (com inércia), clique num ícone para trazê-lo à frente.
export default function ArsenalCloud({ items, max = 420 }: { items: CloudItem[]; max?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // pontos na esfera (espiral de Fibonacci)
    const n = items.length
    const points: Vec[] = items.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * Math.PI * (3 - Math.sqrt(5))
      return [Math.cos(phi) * r, y, Math.sin(phi) * r]
    })
    const imgs = items.map((it) => {
      const img = new Image()
      img.src = it.src
      return img
    })
    const hoverAmt = new Array(n).fill(0)

    let R: Mat = ID
    let size = max
    let wx = AUTO[0] // velocidade angular atual (rad/s)
    let wy = AUTO[1]
    let dragging = false
    let last = { x: 0, y: 0, t: 0 }
    let down = { x: 0, y: 0, t: 0 }
    let pointer: { x: number; y: number } | null = null
    let focus = -1
    let focusHold = 0
    let hovered = -1
    let raf = 0
    let prev = performance.now()

    const resize = () => {
      const parent = canvas.parentElement!
      size = Math.min(max, parent.clientWidth)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const project = (i: number) => {
      const v = apply(R, points[i])
      const radius = size * 0.36
      const depth = (v[2] + 2) / 3 // 0.33 (fundo) a 1 (frente)
      return { x: size / 2 + v[0] * radius, y: size / 2 + v[1] * radius, z: v[2], depth, v }
    }

    const iconAt = (x: number, y: number) => {
      let best = -1
      let bestZ = -2
      for (let i = 0; i < n; i++) {
        const p = project(i)
        const r = 20 * p.depth * 1.2
        if ((x - p.x) ** 2 + (y - p.y) ** 2 < r * r && p.z > bestZ) {
          best = i
          bestZ = p.z
        }
      }
      return best
    }

    const rotate = (ax: number, ay: number) => {
      // ax: em torno do eixo x da tela; ay: em torno do eixo y da tela
      if (ax) R = mul(axisAngle([1, 0, 0], ax), R)
      if (ay) R = mul(axisAngle([0, 1, 0], ay), R)
    }

    const frame = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.033)
      prev = now

      if (focus >= 0) {
        // gira suavemente até o ícone escolhido ficar de frente
        const v = apply(R, points[focus])
        const angle = Math.acos(Math.max(-1, Math.min(1, v[2])))
        if (angle > 0.002) {
          const l = Math.hypot(v[1], v[0]) || 1
          R = mul(axisAngle([v[1] / l, -v[0] / l, 0], -angle * Math.min(1, dt * 5)), R)
        } else if ((focusHold -= dt) <= 0) {
          focus = -1
        }
        wx = wy = 0
      } else if (!dragging) {
        rotate(-wx * dt, wy * dt)
        // inércia: desacelera e volta aos poucos para o giro automático
        const decay = Math.exp(-FRICTION * dt)
        const auto = reduce ? [0, 0] : pointer ? [AUTO[0] + ((pointer.y - size / 2) / size) * 0.5, AUTO[1] + ((pointer.x - size / 2) / size) * 0.9] : AUTO
        wx = auto[0] + (wx - auto[0]) * decay
        wy = auto[1] + (wy - auto[1]) * decay
      }
      R = orthonormalize(R)

      hovered = pointer && !dragging ? iconAt(pointer.x, pointer.y) : -1
      ctx.clearRect(0, 0, size, size)
      const order = points.map((_, i) => project(i)).map((p, i) => ({ ...p, i })).sort((a, b) => a.z - b.z)
      for (const p of order) {
        const target = p.i === hovered || p.i === focus ? 1 : 0
        hoverAmt[p.i] += (target - hoverAmt[p.i]) * Math.min(1, dt * 12)
        const s = 34 * p.depth * (1 + hoverAmt[p.i] * 0.35)
        ctx.globalAlpha = Math.max(0.12, Math.min(1, (p.z + 1.1) / 1.6))
        const img = imgs[p.i]
        if (img.complete && img.naturalWidth) ctx.drawImage(img, p.x - s / 2, p.y - s / 2, s, s)
        if (hoverAmt[p.i] > 0.05) {
          ctx.globalAlpha = hoverAmt[p.i]
          ctx.font = '600 12px "JetBrains Mono", monospace'
          ctx.textAlign = 'center'
          const label = items[p.i].name
          const tw = ctx.measureText(label).width + 16
          ctx.fillStyle = 'rgba(0,0,0,0.85)'
          ctx.strokeStyle = 'rgba(255,255,255,0.35)'
          ctx.beginPath()
          ctx.roundRect(p.x - tw / 2, p.y + s / 2 + 6, tw, 22, 11)
          ctx.fill()
          ctx.stroke()
          ctx.fillStyle = '#fff'
          ctx.fillText(label, p.x, p.y + s / 2 + 21)
        }
      }
      ctx.globalAlpha = 1
      canvas.style.cursor = dragging ? 'grabbing' : hovered >= 0 ? 'pointer' : 'grab'
      raf = requestAnimationFrame(frame)
    }

    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId)
      const p = pos(e)
      dragging = true
      focus = -1
      wx = wy = 0
      last = down = { ...p, t: performance.now() }
    }
    const onMove = (e: PointerEvent) => {
      const p = pos(e)
      pointer = p
      if (!dragging) return
      const now = performance.now()
      const dx = p.x - last.x
      const dy = p.y - last.y
      rotate(-dy * DRAG, dx * DRAG)
      // velocidade suavizada para a inércia ao soltar
      const dts = Math.max(0.001, (now - last.t) / 1000)
      wx += ((dy * DRAG) / dts - wx) * 0.4
      wy += ((dx * DRAG) / dts - wy) * 0.4
      last = { ...p, t: now }
    }
    const onUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      const p = pos(e)
      const still = Math.hypot(p.x - down.x, p.y - down.y) < 6 && performance.now() - down.t < 300
      if (still) {
        const i = iconAt(p.x, p.y)
        if (i >= 0) {
          focus = i
          focusHold = 1.6
        }
      }
      // se parou o mouse antes de soltar, não joga a esfera
      if (performance.now() - last.t > 80) wx = wy = 0
      const cap = 6
      wx = Math.max(-cap, Math.min(cap, wx))
      wy = Math.max(-cap, Math.min(cap, wy))
    }
    const onLeave = () => (pointer = null)

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas.parentElement!)
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    canvas.addEventListener('pointerleave', onLeave)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointerleave', onLeave)
    }
  }, [items, max])

  return (
    <canvas
      ref={ref}
      className="touch-none select-none"
      role="img"
      aria-label={`Nuvem 3D de tecnologias: ${items.map((i) => i.name).join(', ')}. Arraste para girar.`}
    />
  )
}
