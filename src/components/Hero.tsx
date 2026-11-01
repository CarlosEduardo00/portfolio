import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowDown, MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './helpers'
import { AnimatedSpan, Terminal, TypingAnimation } from '@/components/ui/terminal'
import { BorderBeam } from '@/components/ui/border-beam'
import GalagaField from './space/GalagaField'

const ease = [0.22, 1, 0.36, 1] as const

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600)
    return () => clearInterval(t)
  }, [])
  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={profile.roles[i]}
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease }}
          className="text-gradient font-semibold"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

// Botão que "puxa" na direção do mouse
function Magnetic({ children, href, primary }: { children: ReactNode; href: string; primary?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  return (
    <motion.a
      ref={ref}
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel="noreferrer"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width / 2) * 0.3)
        y.set((e.clientY - r.top - r.height / 2) * 0.3)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
      whileTap={{ scale: 0.95 }}
      className={
        primary
          ? 'inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-ink shadow-[0_0_40px_-8px_rgb(255_255_255/0.35)]'
          : 'inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-6 py-3 font-medium backdrop-blur hover:bg-white/10'
      }
    >
      {children}
    </motion.a>
  )
}

// Terminal do Magic UI: digita o comando e revela as linhas em sequência
function HeroTerminal() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 20 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.6, ease }}
      className="relative w-full max-w-md [perspective:1000px]"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative overflow-hidden rounded-xl shadow-2xl shadow-white/5"
      >
        <Terminal className="max-w-none bg-panel/80 text-[12px] backdrop-blur-xl sm:text-[13px]">
          <TypingAnimation className="text-white">{'> npx carlinhos --launch'}</TypingAnimation>
          <AnimatedSpan className="text-white/85">✔ Piloto a bordo: Carlos Eduardo</AnimatedSpan>
          <AnimatedSpan className="text-white/85">✔ Motores: Java · Spring Boot · Python</AnimatedSpan>
          <AnimatedSpan className="text-white/85">✔ Painel: React · TypeScript · Astro</AnimatedSpan>
          <AnimatedSpan className="text-white/85">✔ Escudos (QA): Selenium · pytest · Vitest</AnimatedSpan>
          <AnimatedSpan className="text-white/85">✔ Missões ativas: 3 projetos full-stack</AnimatedSpan>
          <AnimatedSpan className="text-white">» Status: pronto para decolar</AnimatedSpan>
          <TypingAnimation className="text-white/45">Clique no espaço para atirar · role para as missões ↓</TypingAnimation>
        </Terminal>
        <BorderBeam duration={8} size={120} colorFrom="#ffffff" colorTo="#525252" />
      </motion.div>
    </motion.div>
  )
}

export default function Hero() {
  const words = profile.name.split(' ')
  return (
    <section className="relative mx-auto flex min-h-svh max-w-6xl flex-col justify-center gap-14 px-4 pb-32 pt-52 sm:px-6 lg:flex-row lg:items-center">
      {/* Mini Galaga: formação de inimigos no alto e a nave embaixo, atrás do conteúdo */}
      <GalagaField />
      <div className="relative flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-1.5 text-sm text-white/70 backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-white" />
          </span>
          Aberto a novas oportunidades
        </motion.div>

        <p className="mb-2 font-mono text-white">Olá, eu sou</p>
        <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl" aria-label={profile.name}>
          {words.map((w, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
              {w.split('').map((l, li) => {
                const i = words.slice(0, wi).join(' ').length + (wi ? 1 : 0) + li
                return (
                  <motion.span
                    key={li}
                    initial={{ opacity: 0, y: 60, rotate: 8 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.04, ease }}
                    className="inline-block"
                  >
                    {l}
                  </motion.span>
                )
              })}
              {wi < words.length - 1 && ' '}
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mb-6 text-2xl text-white/80 sm:text-3xl"
        >
          <RotatingRole />
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mb-8 max-w-xl text-lg text-white/60"
        >
          {profile.headline}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap items-center gap-3"
        >
          <Magnetic href="#projetos" primary>
            Ver missões <ArrowDown className="size-4" />
          </Magnetic>
          <Magnetic href={profile.links.github}>
            <GithubIcon /> GitHub
          </Magnetic>
          <Magnetic href={profile.links.linkedin}>
            <LinkedinIcon /> LinkedIn
          </Magnetic>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-6 flex items-center gap-1.5 text-sm text-white/40"
        >
          <MapPin className="size-4" /> {profile.location}
        </motion.p>
      </div>
      <div className="relative flex flex-1 justify-center lg:justify-end">
        <HeroTerminal />
      </div>
    </section>
  )
}
