import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useState, type PointerEvent } from 'react'
import { ArrowUpRight, Lock, Sparkles } from 'lucide-react'
import { projects, type Project } from '../data/profile'
import { GithubIcon, Section } from './helpers'
import { BorderBeam } from '@/components/ui/border-beam'

const filters = ['Todos', 'Full-stack', 'Python', 'Back-end', 'Front-end'] as const

// Card com inclinação 3D e brilho que segue o cursor
function ProjectCard({ p, index }: { p: Project; index: number }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 })
  const px = useTransform(mx, (v) => `${v * 100}%`)
  const py = useTransform(my, (v) => `${v * 100}%`)
  const glow = useMotionTemplate`radial-gradient(400px circle at ${px} ${py}, rgb(255 255 255 / 0.08), transparent 60%)`
  const border = useMotionTemplate`radial-gradient(300px circle at ${px} ${py}, rgb(255 255 255 / 0.7), transparent 60%)`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`[perspective:1200px] ${p.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
    >
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative h-full rounded-2xl p-px"
      >
        {/* borda luminosa */}
        <motion.div className="absolute inset-0 rounded-2xl bg-line opacity-100" />
        <motion.div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: border }} />
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-panel p-6">
          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glow }} />
          {/* Magic UI: dois feixes de luz percorrendo a borda dos projetos em destaque */}
          {p.featured && (
            <>
              <BorderBeam duration={10} delay={index * 2} size={160} colorFrom="#ffffff" colorTo="#525252" />
              <BorderBeam duration={10} delay={index * 2 + 5} size={160} colorFrom="#a3a3a3" colorTo="#ffffff" />
            </>
          )}
          <div className="relative flex items-start justify-between gap-3" style={{ transform: 'translateZ(40px)' }}>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2 whitespace-nowrap font-mono text-xs text-white/40">
                <span className="size-2 rounded-full" style={{ background: p.featured ? "#fff" : "#737373", boxShadow: p.featured ? "0 0 10px #fff" : "none" }} />
                {p.category} · {p.year}
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-white">
                    <Sparkles className="size-3" /> missão principal
                  </span>
                )}
              </div>
              <h3 className={`font-semibold tracking-tight ${p.featured ? 'text-2xl' : 'text-xl'}`}>{p.name}</h3>
              <p className="mt-1 text-sm text-white/50">{p.tagline}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              {p.repo ? (
                <a href={p.repo} target="_blank" rel="noreferrer" aria-label={`Código de ${p.name}`} className="rounded-full border border-line p-2 text-white/60 transition hover:scale-110 hover:text-white">
                  <GithubIcon className="size-4" />
                </a>
              ) : (
                <span title="Repositório privado" className="rounded-full border border-line p-2 text-white/30">
                  <Lock className="size-4" />
                </span>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" aria-label={`Abrir ${p.name}`} className="rounded-full border border-line p-2 text-white/60 transition hover:rotate-45 hover:text-white">
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </div>
          <p className="relative mt-4 flex-1 text-white/65" style={{ transform: 'translateZ(25px)' }}>
            {p.description}
          </p>
          {p.highlights && (
            <ul className="relative mt-4 space-y-1.5 text-sm text-white/55">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2">
                  <span className="text-white">▹</span> {h}
                </li>
              ))}
            </ul>
          )}
          <div className="relative mt-5 flex flex-wrap gap-1.5" style={{ transform: 'translateZ(30px)' }}>
            {p.stack.map((s) => (
              <span key={s} className="rounded-md border border-line bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-white/60">
                {s}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos')
  const list = projects.filter((p) => filter === 'Todos' || p.category === filter)

  return (
    <Section id="projetos" eyebrow="missões" title={<>Missões <span className="text-gradient">concluídas</span></>}>
      <div className="mb-10 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="relative rounded-full px-4 py-2 text-sm transition-colors"
          >
            {filter === f && (
              <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className={`relative ${filter === f ? 'text-ink font-medium' : 'text-white/60 hover:text-white'}`}>{f}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <ProjectCard key={p.name} p={p} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  )
}
