import { motion } from 'motion/react'
import { profile } from '../data/profile'
import { ease } from './helpers'

// Palavra que sobe de dentro de uma "máscara", letra por letra
function MaskedWord({ text, delay, className = '' }: { text: string; delay: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.08em] align-bottom ${className}`}>
      {text.split('').map((l, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: delay + i * 0.035, ease }}
        >
          {l}
        </motion.span>
      ))}
    </span>
  )
}

// Níveis na ordem de senioridade que o Carlos definiu (Java > Python > JavaScript > Astro)
const levels: [string, number][] = [
  ['Java / Spring', 5],
  ['Python', 4],
  ['JavaScript', 3],
  ['Astro', 2],
]

// Topo em forma de "seleção de jogador": PLAYER 1, nome em caixa alta, ficha com foto e níveis, PRESS START piscando
export default function Hero() {
  const [first, ...rest] = profile.name.split(' ')
  const years = new Date().getFullYear() - profile.since
  const stats = [
    ['XP', `+${years} anos`],
    ['BASE', profile.location],
    ['FUNÇÃO', 'QA · Java'],
  ]
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="pixel text-xs text-accent">
        PLAYER 1 <span className="blink">▮</span>
      </motion.p>
      <h1 className="mt-5 font-serif text-[clamp(2.6rem,14vw,8rem)] font-bold uppercase leading-[0.9] tracking-wide lg:text-9xl" aria-label={profile.name}>
        <span aria-hidden>
          <MaskedWord text={first} delay={0.2} /> <MaskedWord text={rest.join(' ')} delay={0.45} className="text-accent" />
        </span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-4 max-w-xs font-mono text-xs uppercase tracking-[0.2em] text-muted sm:max-w-none sm:text-sm"
      >
        classe: java developer · qa engineer
      </motion.p>

      {/* ficha do personagem */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 1, ease }}
        className="hud-corners relative mt-10 grid w-full max-w-3xl gap-6 border border-line bg-panel/80 p-4 text-left backdrop-blur sm:mt-12 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center sm:p-6"
      >
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[15rem] overflow-hidden border border-line bg-ink">
          <img
            src="/carlos.webp"
            alt="Foto de Carlos Silva"
            width={1023}
            height={1537}
            fetchPriority="high"
            className="size-full object-cover object-[50%_25%]"
          />
          <span className="pixel absolute inset-x-0 bottom-0 bg-ink/85 py-1.5 text-center text-[10px] text-accent">P1 · CARLINHOS</span>
        </div>
        <div className="min-w-0">
          <p className="pixel text-[11px] text-muted">STATUS</p>
          <ul className="mt-3 space-y-3">
            {levels.map(([name, lv], i) => (
              <li key={name} className="grid grid-cols-[6.9rem_1fr_auto] items-center gap-2 font-mono text-xs sm:grid-cols-[7.5rem_1fr_auto] sm:gap-3 sm:text-[13px]">
                <span className="truncate">{name}</span>
                <span className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, b) => (
                    <motion.span
                      key={b}
                      initial={{ opacity: 0.15 }}
                      animate={{ opacity: b < lv ? 1 : 0.15 }}
                      transition={{ delay: 1.3 + i * 0.12 + b * 0.06 }}
                      className={`h-2.5 flex-1 sm:h-3 ${b < lv ? 'bg-accent' : 'bg-white/20'}`}
                    />
                  ))}
                </span>
                <span className="pixel text-[10px] text-muted">LV{lv}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4 font-mono text-[11px] sm:text-xs">
            {stats.map(([k, v]) => (
              <div key={k} className="min-w-0">
                <dt className="pixel text-[10px] text-muted">{k}</dt>
                <dd className="mt-1 truncate text-cream">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      <motion.a
        href="#sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="pixel mt-10 inline-flex min-h-11 items-center px-4 text-sm text-cream transition hover:text-accent sm:mt-12"
      >
        <span className="blink mr-2">▶</span> PRESS START
      </motion.a>
    </section>
  )
}
