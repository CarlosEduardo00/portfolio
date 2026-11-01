import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

// Revela o conteúdo subindo de leve quando entra na tela
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Cabeçalho + conteúdo de cada seção, estilo HUD de jogo: "LEVEL 01" e título em caixa alta com cantoneiras
export function Section({ id, n, eyebrow, title, children, className = '' }: { id: string; n: string; eyebrow: string; title: ReactNode; children: ReactNode; className?: string }) {
    return (
      <section id={id} className={`scroll-mt-16 border-t border-line ${className}`}>
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-28">
          <Reveal className="mb-14 flex flex-col items-center text-center">
            <p className="pixel text-[11px] text-accent">LEVEL {n}</p>
            <h2 className="hud-corners relative mt-4 px-6 py-3 font-serif text-4xl font-semibold uppercase tracking-wide sm:text-6xl">{title}</h2>
            <p className="mt-4 font-mono text-xs text-muted">{'> '}{eyebrow}</p>
          </Reveal>
          {children}
        </div>
      </section>
    )
}

// Ícones de marca (o lucide-react v1 não traz mais logos)
export function GithubIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.2-3.1-.1-.4-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  )
}

export function LinkedinIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM7.1 20.5H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z" />
    </svg>
  )
}
