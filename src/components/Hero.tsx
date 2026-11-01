import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { profile } from '../data/profile'
import { ease } from './helpers'

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

export default function Hero() {
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
