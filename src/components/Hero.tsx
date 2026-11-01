import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { profile } from '../data/profile'
import { GithubIcon, ease } from './helpers'
import { design } from '../design'
import { stack } from '../data/profile'

// Palavra que sobe de dentro de uma "máscara", letra por letra
function MaskedWord({ text, delay, className = '' }: { text: string; delay: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden pb-[0.12em] align-bottom ${className}`}>
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

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2800)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className="lowercase"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function HeroEditorial() {
  const [first, ...rest] = profile.name.split(' ')
  const last = rest.join(' ')
  const years = new Date().getFullYear() - profile.since

  // o nome acompanha o mouse bem de leve (parallax)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })
  const nameX = useTransform(sx, (v) => v * 14)
  const nameY = useTransform(sy, (v) => v * 8)

  const info = [
    ['localização', profile.location],
    ['foco', profile.focus],
    ['experiência', `+${years} anos`],
  ]

  return (
    <section
      className="relative flex min-h-svh flex-col pt-14"
      onPointerMove={(e) => {
        if (e.pointerType === 'touch') return
        mx.set(e.clientX / window.innerWidth - 0.5)
        my.set(e.clientY / window.innerHeight - 0.5)
      }}
    >
      {/* brilho quente bem suave atrás do nome */}
      <div aria-hidden className="pointer-events-none absolute left-[10%] top-1/3 size-[38rem] -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[120px]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 sm:px-6">
        <motion.h1 style={{ x: nameX, y: nameY }} className="font-serif text-[19vw] leading-[0.9] tracking-tight sm:text-[8.5rem] lg:text-[10.5rem]" aria-label={profile.name}>
          <span aria-hidden>
            <MaskedWord text={first} delay={0.15} /> <MaskedWord text={last} delay={0.4} className="italic text-accent" />
            <MaskedWord text="." delay={0.4 + last.length * 0.035} className="text-accent" />
          </span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease }}
          className="mt-6 h-px origin-left bg-line"
        />

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease }}
          className="mt-5 self-end text-right font-serif text-2xl sm:text-3xl"
        >
          {profile.tagline[0]} <em className="text-accent">{profile.tagline[1]}</em>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3, ease }}
        className="relative mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6"
      >
        <dl className="grid grid-cols-3 overflow-hidden rounded-xl border border-line bg-panel/60">
          {info.map(([k, v], i) => (
            <div key={k} className={`px-4 py-3 sm:px-5 ${i ? 'border-l border-line' : ''}`}>
              <dt className="font-mono text-[10px] text-muted sm:text-[11px]">{k}</dt>
              <dd className="mt-1 font-serif text-lg leading-tight sm:text-xl">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-muted">
          <span className="flex items-center gap-2">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
            </span>
            <RotatingRole />
          </span>
          <a href="#sobre" className="group flex items-center gap-2 transition hover:text-cream">
            <span className="grid size-6 place-items-center rounded-full border border-line transition group-hover:border-accent/60">
              <motion.span animate={{ y: [0, 3, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                <ArrowDown className="size-3" />
              </motion.span>
            </span>
            role para ver
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ---------- Variante B: Bold ----------
// Nome enorme em grotesca à esquerda, foto colorida inclinada com etiquetas à direita, faixa de tecnologias rolando embaixo
function HeroBold() {
  const [first, ...rest] = profile.name.split(' ')
  const words = Object.values(stack).flat()
  const stickers = [
    { t: 'java + spring', c: 'left-[-2%] top-[12%] sm:left-[-8%]', d: 0 },
    { t: 'qa engineer', c: 'right-[-2%] top-[44%] sm:right-[-6%]', d: 0.6 },
    { t: `${profile.age} anos · ${profile.location.toLowerCase()}`, c: 'left-[4%] bottom-[-4%]', d: 1.2 },
  ]
  return (
    <section className="relative flex min-h-svh flex-col pt-14">
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 font-mono text-[11px] text-muted"
          >
            <span className="size-1.5 rounded-full bg-accent" /> aberto a novas oportunidades
          </motion.p>
          <h1 className="font-serif text-[22vw] leading-[0.82] sm:text-[9rem] lg:text-[8.5rem]" aria-label={profile.name}>
            <span aria-hidden className="block">
              <MaskedWord text={first} delay={0.1} />
            </span>
            <span aria-hidden className="block text-accent">
              <MaskedWord text={rest.join(' ')} delay={0.3} />
            </span>
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-8 font-mono text-sm text-muted">
            → <RotatingRole />
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease }}
            className="mt-3 max-w-md text-lg leading-relaxed text-cream/75"
          >
            {profile.headline}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.15, ease }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#projetos" className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition hover:brightness-110">
              Ver missões <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold transition hover:border-cream/40">
              <GithubIcon className="size-4" /> GitHub
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: -10, y: 40 }}
          animate={{ opacity: 1, rotate: -3, y: 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14, delay: 0.3 }}
          whileHover={{ rotate: 0, scale: 1.02 }}
          className="relative mx-auto w-[min(100%,24rem)]"
        >
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2rem] bg-accent/80" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-panel">
            <img src="/carlos.webp" alt="Foto de Carlos Silva" width={1023} height={1537} className="size-full object-cover object-[50%_30%]" />
          </div>
          {stickers.map((st) => (
            <motion.span
              key={st.t}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: st.d }}
              className={`absolute ${st.c} rounded-full border border-line bg-ink px-3 py-1.5 font-mono text-[11px] shadow-xl`}
            >
              {st.t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* faixa de tecnologias rolando */}
      <div className="overflow-hidden border-y border-line bg-panel/60 py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div className="flex w-max gap-8 font-serif text-2xl" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
          {[...words, ...words].map((w, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              {w} <span className="text-base text-accent">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ---------- Variante C: Arcade ----------
// Tela de "seleção de jogador": PLAYER 1, nome em caixa alta, ficha com foto e níveis, PRESS START piscando
// Níveis seguem a ordem de senioridade que o Carlos definiu (Java > Python > JavaScript > Astro)
const levels: [string, number][] = [
  ['Java / Spring', 5],
  ['Python', 4],
  ['JavaScript', 3],
  ['Astro', 2],
]

function HeroArcade() {
  const [first, ...rest] = profile.name.split(' ')
  const years = new Date().getFullYear() - profile.since
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="pixel text-xs text-accent">
        PLAYER 1 <span className="blink">▮</span>
      </motion.p>
      <h1 className="mt-5 font-serif text-[15vw] font-bold uppercase leading-[0.9] tracking-wide sm:text-8xl lg:text-9xl" aria-label={profile.name}>
        <span aria-hidden>
          <MaskedWord text={first} delay={0.2} /> <MaskedWord text={rest.join(' ')} delay={0.45} className="text-accent" />
        </span>
      </h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-muted sm:text-sm">
        classe: java developer · qa engineer
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 1, ease }}
        className="hud-corners relative mt-12 grid w-full max-w-2xl gap-6 border border-line bg-panel/80 p-6 text-left backdrop-blur sm:grid-cols-[9rem_1fr]"
      >
        <div className="relative mx-auto aspect-square w-36 overflow-hidden border border-line sm:w-full">
          <img src="/carlos.webp" alt="Foto de Carlos Silva" width={1023} height={1537} className="size-full object-cover object-[50%_28%]" />
          <span className="pixel absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-center text-[10px] text-accent">P1 · CARLINHOS</span>
        </div>
        <div>
          <p className="pixel text-[11px] text-muted">STATUS</p>
          <ul className="mt-3 space-y-2.5">
            {levels.map(([name, lv], i) => (
              <li key={name} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 font-mono text-xs sm:grid-cols-[7.5rem_1fr_auto]">
                <span>{name}</span>
                <span className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, b) => (
                    <motion.span
                      key={b}
                      initial={{ opacity: 0.15 }}
                      animate={{ opacity: b < lv ? 1 : 0.15 }}
                      transition={{ delay: 1.3 + i * 0.12 + b * 0.06 }}
                      className={`h-2.5 flex-1 ${b < lv ? 'bg-accent' : 'bg-white/20'}`}
                    />
                  ))}
                </span>
                <span className="pixel text-[10px] text-muted">LV{lv}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3 font-mono text-[11px] text-muted">
            <span>
              XP <b className="text-cream">+{years} anos</b>
            </span>
            <span>
              BASE <b className="text-cream">{profile.location}</b>
            </span>
            <span>
              FUNÇÃO <b className="text-cream">QA</b>
            </span>
          </p>
        </div>
      </motion.div>

      <motion.a href="#sobre" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }} className="pixel mt-12 text-sm text-cream transition hover:text-accent">
        <span className="blink">▶</span> PRESS START
      </motion.a>
    </section>
  )
}

export default function Hero() {
  if (design === 'b') return <HeroBold />
  if (design === 'c') return <HeroArcade />
  return <HeroEditorial />
}
