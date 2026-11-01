import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, useState, type PointerEvent, type ReactNode } from 'react'
import { ArrowUpRight, Lock, RotateCw, Sparkles } from 'lucide-react'
import { projects, type Project } from '../data/profile'
import { GithubIcon, Section } from './helpers'
import { BorderBeam } from '@/components/ui/border-beam'

const filters = ['Todos', 'Web', 'Python', 'Back-end', 'Front-end'] as const

const effects = [
  { id: 'holo', label: 'Holograma' },
  { id: 'radar', label: 'Radar' },
  { id: 'flip', label: 'Flip' },
  { id: 'magnet', label: 'Magnético' },
] as const
type Effect = (typeof effects)[number]['id']

// Molas suaves usadas em todos os efeitos
const SOFT = { stiffness: 110, damping: 20, mass: 0.9 }
const LIFT = { stiffness: 220, damping: 26 }

// ---------- conteúdo do card ----------

function Links({ p }: { p: Project }) {
  return (
    <div className="flex shrink-0 gap-2">
      {p.repo ? (
        <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`Código de ${p.name}`} className="rounded-full border border-line p-2 text-white/60 transition duration-300 hover:scale-110 hover:border-white/40 hover:text-white">
          <GithubIcon className="size-4" />
        </a>
      ) : (
        <span title="Repositório privado" className="rounded-full border border-line p-2 text-white/30">
          <Lock className="size-4" />
        </span>
      )}
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer" aria-label={`Abrir ${p.name}`} className="rounded-full border border-line p-2 text-white/60 transition duration-300 hover:rotate-45 hover:border-white/40 hover:text-white">
          <ArrowUpRight className="size-4" />
        </a>
      )}
    </div>
  )
}

function Meta({ p }: { p: Project }) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-2 whitespace-nowrap font-mono text-xs text-white/40">
      <span className="size-2 rounded-full" style={{ background: p.featured ? '#fff' : '#737373', boxShadow: p.featured ? '0 0 10px #fff' : 'none' }} />
      {p.category} · {p.year}
      {p.featured && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-white">
          <Sparkles className="size-3" /> missão principal
        </span>
      )}
    </div>
  )
}

function Stack({ p, active }: { p: Project; active?: boolean }) {
  return (
    <div className="relative mt-5 flex flex-wrap gap-1.5">
      {p.stack.map((s, i) => (
        <motion.span
          key={s}
          animate={active ? { y: -2, borderColor: 'rgba(255,255,255,0.3)' } : { y: 0, borderColor: 'rgba(255,255,255,0.1)' }}
          transition={{ ...LIFT, delay: active ? i * 0.025 : 0 }}
          className="rounded-md border bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-white/60"
        >
          {s}
        </motion.span>
      ))}
    </div>
  )
}

function Highlights({ p }: { p: Project }) {
  if (!p.highlights) return null
  return (
    <ul className="relative mt-4 space-y-1.5 text-sm text-white/55">
      {p.highlights.map((h) => (
        <li key={h} className="flex items-center gap-2">
          <span className="text-white">▹</span> {h}
        </li>
      ))}
    </ul>
  )
}

function FullContent({ p, active, depth }: { p: Project; active: boolean; depth?: (z: number) => object }) {
  const z = depth ?? (() => ({}))
  return (
    <>
      <div className="relative flex items-start justify-between gap-3" style={z(40)}>
        <div>
          <Meta p={p} />
          <h3 className={`font-semibold tracking-tight ${p.featured ? 'text-2xl' : 'text-xl'}`}>{p.name}</h3>
          <p className="mt-1 text-sm text-white/50">{p.tagline}</p>
        </div>
        <Links p={p} />
      </div>
      <p className="relative mt-4 flex-1 text-white/65" style={z(25)}>
        {p.description}
      </p>
      <Highlights p={p} />
      <div style={z(30)}>
        <Stack p={p} active={active} />
      </div>
    </>
  )
}

function Beams({ p, index }: { p: Project; index: number }) {
  if (!p.featured) return null
  return (
    <>
      <BorderBeam duration={10} delay={index * 2} size={160} colorFrom="#ffffff" colorTo="#525252" />
      <BorderBeam duration={10} delay={index * 2 + 5} size={160} colorFrom="#a3a3a3" colorTo="#ffffff" />
    </>
  )
}

// moldura com borda luminosa que segue o cursor (compartilhada pelos efeitos)
function Shell({ children, px, py, active, className = '' }: { children: ReactNode; px: MotionValue<string>; py: MotionValue<string>; active: boolean; className?: string }) {
  const border = useMotionTemplate`radial-gradient(320px circle at ${px} ${py}, rgb(255 255 255 / 0.75), transparent 60%)`
  return (
    <div className={`relative h-full rounded-2xl p-px ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-line" />
      <motion.div className="absolute inset-0 rounded-2xl" style={{ background: border }} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.5 }} />
      {children}
    </div>
  )
}

// ---------- efeitos ----------

type CardProps = { p: Project; index: number; mx: MotionValue<number>; my: MotionValue<number>; active: boolean }

function HoloCard({ p, index, mx, my, active }: CardProps) {
  const rx = useSpring(useTransform(my, [0, 1], [6, -6]), SOFT)
  const ry = useSpring(useTransform(mx, [0, 1], [-6, 6]), SOFT)
  const px = useTransform(mx, (v) => `${v * 100}%`)
  const py = useTransform(my, (v) => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(420px circle at ${px} ${py}, rgb(255 255 255 / 0.09), transparent 60%)`
  // faixa de reflexo que atravessa o card conforme o mouse anda
  const sheenX = useSpring(useTransform(mx, [0, 1], ['-60%', '160%']), SOFT)
  return (
    <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} animate={{ y: active ? -8 : 0, scale: active ? 1.015 : 1 }} transition={LIFT} className="h-full">
      <Shell px={px} py={py} active={active}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-panel p-6" style={{ transformStyle: 'preserve-3d' }}>
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent"
            style={{ left: sheenX }}
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          <Beams p={p} index={index} />
          <FullContent p={p} active={active} depth={(z) => ({ transform: `translateZ(${z}px)` })} />
        </div>
      </Shell>
    </motion.div>
  )
}

function RadarCard({ p, index, mx, my, active }: CardProps) {
  const px = useTransform(mx, (v) => `${v * 100}%`)
  const py = useTransform(my, (v) => `${v * 100}%`)
  const corner = (pos: string, rot: number) => (
    <motion.span
      className={`pointer-events-none absolute z-10 size-4 border-l-2 border-t-2 border-white ${pos}`}
      style={{ rotate: rot }}
      initial={false}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.8 }}
      transition={LIFT}
    />
  )
  return (
    <motion.div animate={{ y: active ? -4 : 0 }} transition={LIFT} className="h-full">
      <Shell px={px} py={py} active={active}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-panel p-6">
          {/* grade de pontos e linha de varredura */}
          <motion.div
            className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1px)] [background-size:14px_14px]"
            animate={{ opacity: active ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <AnimatePresence>
            {active && (
              <motion.div
                key="scan"
                className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent"
                initial={{ top: '-20%', opacity: 0 }}
                animate={{ top: ['-20%', '110%'], opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ top: { duration: 1.8, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.3 } }}
              />
            )}
          </AnimatePresence>
          {corner('left-2 top-2', 0)}
          {corner('right-2 top-2', 90)}
          {corner('right-2 bottom-2', 180)}
          {corner('left-2 bottom-2', 270)}
          <Beams p={p} index={index} />
          <FullContent p={p} active={active} />
        </div>
      </Shell>
    </motion.div>
  )
}

function FlipCard({ p, index, mx, my, active }: CardProps) {
  const px = useTransform(mx, (v) => `${v * 100}%`)
  const py = useTransform(my, (v) => `${v * 100}%`)
  const face = 'col-start-1 row-start-1 flex h-full flex-col overflow-hidden rounded-2xl bg-panel p-6 [backface-visibility:hidden]'
  return (
    <Shell px={px} py={py} active={active}>
      <motion.div
        className="relative grid h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: active ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 70, damping: 15, mass: 1 }}
      >
        {/* frente */}
        <div className={face}>
          <Beams p={p} index={index} />
          <Meta p={p} />
          <h3 className={`font-semibold tracking-tight ${p.featured ? 'text-2xl' : 'text-xl'}`}>{p.name}</h3>
          <p className="mt-1 text-sm text-white/50">{p.tagline}</p>
          <p className="mt-4 flex-1 text-white/65">{p.description}</p>
          <p className="mt-5 flex items-center gap-2 font-mono text-xs text-white/35">
            <RotateCw className="size-3.5" /> passe o mouse para virar
          </p>
        </div>
        {/* verso */}
        <div className={`${face} [transform:rotateY(180deg)]`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-white/40">ficha da missão</p>
              <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
            </div>
            <Links p={p} />
          </div>
          {p.highlights ? <Highlights p={p} /> : <p className="mt-4 text-sm text-white/55">{p.tagline}</p>}
          <div className="flex-1" />
          <Stack p={p} active={active} />
        </div>
      </motion.div>
    </Shell>
  )
}

function MagnetCard({ p, index, mx, my, active }: CardProps) {
  const x = useSpring(useTransform(mx, [0, 1], [-10, 10]), SOFT)
  const y = useSpring(useTransform(my, [0, 1], [-10, 10]), SOFT)
  const ix = useSpring(useTransform(mx, [0, 1], [6, -6]), SOFT)
  const iy = useSpring(useTransform(my, [0, 1], [6, -6]), SOFT)
  const px = useTransform(mx, (v) => `${v * 100}%`)
  const py = useTransform(my, (v) => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(260px circle at ${px} ${py}, rgb(255 255 255 / 0.12), transparent 65%)`
  return (
    <motion.div style={{ x, y }} animate={{ scale: active ? 1.02 : 1 }} transition={LIFT} className="h-full">
      <Shell px={px} py={py} active={active}>
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-panel p-6">
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} animate={{ opacity: active ? 1 : 0 }} transition={{ duration: 0.5 }} />
          <Beams p={p} index={index} />
          <motion.div style={{ x: ix, y: iy }} className="relative flex h-full flex-col">
            <FullContent p={p} active={active} />
          </motion.div>
        </div>
      </Shell>
    </motion.div>
  )
}

const CARDS: Record<Effect, (props: CardProps) => ReactNode> = { holo: HoloCard, radar: RadarCard, flip: FlipCard, magnet: MagnetCard }

function ProjectCard({ p, index, effect }: { p: Project; index: number; effect: Effect }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const [active, setActive] = useState(false)
  const Card = CARDS[effect]

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const leave = () => {
    setActive(false)
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 36, scale: 0.97, filter: 'blur(8px)' }}
      // ao terminar, o filtro sai de vez: com qualquer filtro ativo o navegador achata o 3D e suaviza o texto
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)', transition: { duration: 0.3 } }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 18, mass: 0.9, delay: index * 0.07, layout: { type: 'spring', stiffness: 160, damping: 26 } }}
      className={`[perspective:1200px] ${p.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
      onPointerEnter={(e) => e.pointerType !== 'touch' && setActive(true)}
      onPointerMove={onMove}
      onPointerLeave={leave}
      // no celular, tocar alterna o efeito (útil para o Flip)
      onClick={(e) => {
        if ((e.target as Element).closest('a')) return
        if (window.matchMedia('(hover: none)').matches) setActive((a) => !a)
      }}
    >
      <Card p={p} index={index} mx={mx} my={my} active={active} />
    </motion.div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos')
  const [effect, setEffect] = useState<Effect>(() => {
    try {
      const saved = localStorage.getItem('card-effect') as Effect | null
      if (saved && effects.some((e) => e.id === saved)) return saved
    } catch {}
    return 'holo'
  })
  useEffect(() => {
    try {
      localStorage.setItem('card-effect', effect)
    } catch {}
  }, [effect])
  const list = projects.filter((p) => filter === 'Todos' || p.category === filter)

  return (
    <Section id="projetos" eyebrow="missões" title={<>Missões <span className="text-gradient">concluídas</span></>}>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className="relative rounded-full px-4 py-2 text-sm transition-colors">
              {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span className={`relative ${filter === f ? 'font-medium text-ink' : 'text-white/60 hover:text-white'}`}>{f}</span>
            </button>
          ))}
        </div>
        {/* seletor do efeito dos cards */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-white/35">efeito</span>
          <div className="flex rounded-full border border-line p-1">
            {effects.map((e) => (
              <button key={e.id} onClick={() => setEffect(e.id)} className="relative rounded-full px-3 py-1.5 text-xs transition-colors" aria-pressed={effect === e.id}>
                {effect === e.id && <motion.span layoutId="effect-pill" className="absolute inset-0 rounded-full bg-white/15" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span className={`relative ${effect === e.id ? 'text-white' : 'text-white/50 hover:text-white'}`}>{e.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProjectCard key={p.name} p={p} index={i} effect={effect} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
