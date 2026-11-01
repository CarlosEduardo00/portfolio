import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Type, X } from 'lucide-react'

// Seletor temporário para comparar combinações de fonte no site de verdade.
// Aparece só com ?fontes no endereço (ex.: portfolio-rho-pearl.vercel.app/?fontes).
// Depois da escolha, a combinação vira padrão em index.css e este arquivo pode sair.

export const combos = [
  { id: 'atual', name: 'Atual', serif: 'Instrument Serif', sans: 'Manrope', mono: 'JetBrains Mono', note: 'editorial, condensada, igual à referência' },
  { id: 'fraunces', name: 'Calorosa', serif: 'Fraunces', sans: 'Inter', mono: 'IBM Plex Mono', note: 'serifa macia, itálico bem expressivo' },
  { id: 'playfair', name: 'Clássica', serif: 'Playfair Display', sans: 'DM Sans', mono: 'DM Mono', note: 'alto contraste, cara de revista' },
  { id: 'dmserif', name: 'Coesa', serif: 'DM Serif Display', sans: 'DM Sans', mono: 'DM Mono', note: 'mesma família, limpa e direta' },
  { id: 'cormorant', name: 'Sofisticada', serif: 'Cormorant Garamond', sans: 'Manrope', mono: 'JetBrains Mono', note: 'fina e elegante' },
  { id: 'newsreader', name: 'Moderna', serif: 'Newsreader', sans: 'Geist', mono: 'Geist Mono', note: 'serifa de leitura + sans atual' },
] as const

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Playfair+Display:ital@0;1&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&family=DM+Serif+Display:ital@0;1&family=Cormorant+Garamond:ital,wght@0,500;1,500&family=Newsreader:ital,opsz@0,6..72;1,6..72&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&family=Silkscreen&display=swap'

const read = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {}
}

export default function FontLab() {
  const enabled = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('fontes')
  const [open, setOpen] = useState(true)
  const [font, setFont] = useState(() => read('font-lab') || 'atual')
  const [pixel, setPixel] = useState(() => read('font-lab-pixel') === '1')

  // carrega as fontes extras só quando o seletor está ativo
  useEffect(() => {
    if (!enabled || document.getElementById('font-lab-css')) return
    const link = document.createElement('link')
    link.id = 'font-lab-css'
    link.rel = 'stylesheet'
    link.href = FONTS_URL
    document.head.appendChild(link)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    document.documentElement.dataset.font = font
    document.documentElement.toggleAttribute('data-pixel', pixel)
    write('font-lab', font)
    write('font-lab-pixel', pixel ? '1' : '0')
  }, [enabled, font, pixel])

  if (!enabled) return null

  return (
    <div className="fixed bottom-4 right-4 z-[70] w-[min(20rem,calc(100vw-2rem))]">
      <AnimatePresence initial={false} mode="wait">
        {open ? (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-2xl border border-line bg-panel/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[11px] text-muted">
              <span>
                <span className="text-accent">~/</span>fontes · escolha uma
              </span>
              <button onClick={() => setOpen(false)} aria-label="Minimizar" className="hover:text-cream">
                <X className="size-3.5" />
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2">
              {combos.map((c, i) => (
                <li key={c.id}>
                  <button
                    onClick={() => setFont(c.id)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${font === c.id ? 'border-accent/60 bg-accent/10' : 'border-transparent hover:bg-white/5'}`}
                  >
                    <span className="block text-2xl leading-tight" style={{ fontFamily: `'${c.serif}', serif` }}>
                      Carlos <em className="text-accent">Silva.</em>
                    </span>
                    <span className="mt-0.5 block text-[12px] text-cream/80" style={{ fontFamily: `'${c.sans}', sans-serif` }}>
                      <span className="text-accent">{i + 1}.</span> {c.name}: {c.serif} + {c.sans}
                    </span>
                    <span className="block text-[10.5px] text-muted" style={{ fontFamily: `'${c.mono}', monospace` }}>
                      {c.mono} · {c.note}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <label className="flex cursor-pointer items-center justify-between gap-3 border-t border-line px-4 py-3 text-[12px]">
              <span>
                <span style={{ fontFamily: "'Silkscreen', monospace" }}>Toque gamer</span>
                <span className="block font-mono text-[10.5px] text-muted">fonte pixelada só no bloco de games</span>
              </span>
              <input type="checkbox" checked={pixel} onChange={(e) => setPixel(e.target.checked)} className="size-4 accent-[#e9a46a]" />
            </label>
          </motion.div>
        ) : (
          <motion.button
            key="fab"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="ml-auto flex items-center gap-2 rounded-full border border-accent/50 bg-panel px-4 py-2 font-mono text-xs shadow-xl"
          >
            <Type className="size-3.5 text-accent" /> fontes
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
