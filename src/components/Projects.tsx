import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useState, type PointerEvent } from 'react'
import { ArrowUpRight, Lock } from 'lucide-react'
import { projects, type Project } from '../data/profile'
import { GithubIcon, Reveal, Section, ease } from './helpers'
import ArcadeBox from './space/ArcadeBox'

const filters = ['todos', 'web', 'python', 'back-end', 'front-end'] as const
type Filter = (typeof filters)[number]

const kind: Record<Project['category'], string> = {
  Web: 'aplicação web',
  Python: 'python',
  'Back-end': 'back-end',
  'Front-end': 'front-end',
}

const SOFT = { stiffness: 110, damping: 20, mass: 0.9 }
const LIFT = { stiffness: 220, damping: 26 }

function Links({ p }: { p: Project }) {
  return (
    <div className="flex items-center gap-4 font-mono text-[11px]">
      {p.repo ? (
        <a href={p.repo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-muted transition hover:text-accent">
          <GithubIcon className="size-3.5" /> repositório
        </a>
      ) : (
        <span className="flex items-center gap-1.5 text-muted/60" title="Repositório privado">
          <Lock className="size-3.5" /> privado
        </span>
      )}
      {p.live && (
        <a href={p.live} target="_blank" rel="noreferrer" className="group/l flex items-center gap-1 text-muted transition hover:text-accent">
          <ArrowUpRight className="size-3.5 transition-transform group-hover/l:-translate-y-0.5 group-hover/l:translate-x-0.5" /> {p.live.includes('releases') ? 'download' : 'demo'}
        </a>
      )}
    </div>
  )
}

function Tags({ items, active }: { items: string[]; active?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s, i) => (
        <motion.span
          key={s}
          animate={active ? { y: -2, borderColor: 'rgba(233,164,106,0.45)' } : { y: 0, borderColor: 'rgba(255,255,255,0.09)' }}
          transition={{ ...LIFT, delay: active ? i * 0.02 : 0 }}
          className="rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] text-muted"
        >
          {s.toLowerCase()}
        </motion.span>
      ))}
    </div>
  )
}

// Moldura de seleção que "respira", como escolher um item num jogo
function SelectFrame({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="select"
          aria-hidden
          className="pointer-events-none absolute -inset-[6px] rounded-[20px]"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        >
          <motion.div
            className="absolute inset-0 rounded-[20px] border border-accent/70"
            animate={{
              opacity: [0.6, 1, 0.6],
              boxShadow: ['0 0 12px 0 rgb(233 164 106 / 0.10)', '0 0 26px 2px rgb(233 164 106 / 0.25)', '0 0 12px 0 rgb(233 164 106 / 0.10)'],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Capa do card: grade de pontos e o nome enorme em itálico, que desliza com o mouse
function Cover({ p, index, mx, active }: { p: Project; index: number; mx: MotionValue<number>; active: boolean }) {
  const x = useSpring(useTransform(mx, [0, 1], [10, -10]), SOFT)
  return (
    <div className="relative h-44 overflow-hidden border-b border-line bg-panel-2 [background-image:radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:14px_14px]">
      <motion.span
        style={{ x }}
        animate={{ opacity: active ? 0.9 : 0.55, scale: active ? 1.04 : 1 }}
        transition={{ duration: 0.6, ease }}
        className="absolute -bottom-4 left-4 origin-bottom-left whitespace-nowrap font-serif text-7xl italic text-cream/20"
      >
        {p.name}
      </motion.span>
      <motion.div
        aria-hidden
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_20%,rgb(233_164_106/0.16),transparent_70%)]"
      />
      <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-ink/80 px-2.5 py-1 font-mono text-[10.5px] backdrop-blur">
        <span className="text-accent">0{index + 1}</span> · {kind[p.category]}
      </span>
    </div>
  )
}

function FeaturedCard({ p, index }: { p: Project; index: number }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const [active, setActive] = useState(false)
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), SOFT)
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), SOFT)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.25 } }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay: index * 0.08, ease, layout: { type: 'spring', stiffness: 160, damping: 26 } }}
      className="mission [perspective:1200px]"
      onPointerEnter={(e) => e.pointerType !== 'touch' && setActive(true)}
      onPointerMove={onMove}
      onPointerLeave={() => {
        setActive(false)
        mx.set(0.5)
        my.set(0.5)
      }}
    >
      <div className="mission-body h-full transition-[opacity,filter] duration-300">
        <motion.article style={{ rotateX: rx, rotateY: ry }} animate={{ y: active ? -6 : 0 }} transition={LIFT} className="relative h-full">
          <SelectFrame active={active} />
          <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel">
            <Cover p={p} index={index} mx={mx} active={active} />
            <div className="flex flex-1 flex-col p-5">
              <p className="font-mono text-[11px] text-muted">
                {kind[p.category]} · {p.year}
              </p>
              <h3 className="mt-1 font-serif text-3xl leading-tight">{p.name}</h3>
              <p className="mt-2 font-mono text-[12.5px] leading-relaxed text-muted">{p.description}</p>
              {p.highlights && (
                <ul className="mt-3 space-y-1 font-mono text-[11.5px] text-cream/80">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-accent">↳</span> {h}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-5">
                <Tags items={p.stack} active={active} />
                <div className="mt-4 border-t border-line pt-3">
                  <Links p={p} />
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </motion.div>
  )
}

// Projetos menores: uma linha por projeto, estilo índice
function Row({ p, i }: { p: Project; i: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.04, ease }}
      className="group relative grid gap-2 border-t border-line py-5 md:grid-cols-[5rem_1fr_1.5fr_10rem] md:items-center md:gap-6"
    >
      <span className="pointer-events-none absolute inset-x-0 inset-y-0 origin-left scale-x-0 bg-gradient-to-r from-accent/[0.07] to-transparent transition-transform duration-500 group-hover:scale-x-100" />
      <span className="relative font-mono text-[11px] text-muted">
        <span className="text-accent">●</span> {p.year}
      </span>
      <h4 className="relative font-serif text-2xl leading-tight transition-transform duration-300 group-hover:translate-x-1.5">
        {p.name} <em className="text-base text-muted">{kind[p.category]}</em>
      </h4>
      <p className="relative font-mono text-[12px] text-muted">
        {p.tagline} · <span className="text-cream/70">{p.stack.join(', ').toLowerCase()}</span>
      </p>
      <div className="relative md:flex md:justify-end">
        <Links p={p} />
      </div>
    </motion.li>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<Filter>('todos')
  const list = projects.filter((p) => filter === 'todos' || p.category.toLowerCase() === filter)
  const featured = list.filter((p) => p.featured)
  const others = list.filter((p) => !p.featured)

  return (
    <Section id="projetos" n="02" eyebrow="o que andei construindo" title={<>Missões <em className="text-accent">concluídas</em></>}>
      <Reveal className="mb-10 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className="relative rounded-full border border-line px-3.5 py-1.5 font-mono text-xs">
            {filter === f && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-cream" transition={{ type: 'spring', stiffness: 320, damping: 30 }} />}
            <span className={`relative ${filter === f ? 'text-ink' : 'text-muted hover:text-cream'}`}>{f}</span>
          </button>
        ))}
      </Reveal>

      {featured.length > 0 && (
        <motion.div layout className="missions grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {featured.map((p, i) => (
              <FeaturedCard key={p.name} p={p} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {others.length > 0 && (
        <div className="mt-16">
          <p className="mb-2 font-mono text-xs text-muted">
            <span className="text-accent">+</span> outras missões · {others.length}
          </p>
          <motion.ul layout className="border-b border-line">
            <AnimatePresence mode="popLayout">
              {others.map((p, i) => (
                <Row key={p.name} p={p} i={i} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </div>
      )}

      <ArcadeBox />
    </Section>
  )
}
