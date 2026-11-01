import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { design } from '../design'

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

// Cabeçalho + conteúdo de cada seção. Muda conforme a variante de design:
// a: "01 / —— frase" e título grande em serifa com ponto colorido
// b: coluna da esquerda com título fixo (sticky), conteúdo à direita
// c: cabeçalho centralizado estilo HUD de jogo ("LEVEL 01")
export function Section({ id, n, eyebrow, title, children, className = '' }: { id: string; n: string; eyebrow: string; title: ReactNode; children: ReactNode; className?: string }) {
  if (design === 'b') {
    return (
      <section id={id} className={`scroll-mt-16 border-t border-line ${className}`}>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-24 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
          <div>
            <Reveal className="mb-10 lg:sticky lg:top-24">
              <p className="font-mono text-xs text-accent">({n})</p>
              <h2 className="mt-3 font-serif text-5xl leading-[0.95] tracking-tight lg:text-[2.75rem]">{title}</h2>
              <p className="mt-4 max-w-[14rem] font-mono text-xs leading-relaxed text-muted">{eyebrow}</p>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2, ease }}
                className="mt-6 block h-1 w-12 origin-left rounded-full bg-accent"
              />
            </Reveal>
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </section>
    )
  }
  if (design === 'c') {
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
  return (
    <section id={id} className={`scroll-mt-16 border-t border-line ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-28">
        <Reveal className="mb-12 md:mb-14">
          <p className="mb-4 flex items-center gap-3 font-mono text-xs text-muted">
            <span className="text-accent">{n}</span> /
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease }}
              className="inline-block h-px w-10 origin-left bg-muted/60"
            />
            {eyebrow}
          </p>
          <h2 className="font-serif text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            {title}
            <span className="text-accent">.</span>
          </h2>
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
