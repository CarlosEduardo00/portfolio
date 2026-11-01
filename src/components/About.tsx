import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { profile, projects } from '../data/profile'
import { Section } from './helpers'

function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (n) => setV(Math.round(n)) })
    return () => c.stop()
  }, [inView, to])
  return (
    <span ref={ref}>
      {v.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}

export default function About() {
  const years = new Date().getFullYear() - 2022
  const stats = [
    { n: years, s: '+', label: 'anos programando' },
    { n: 27, s: '', label: 'repositórios no GitHub' },
    { n: projects.length, s: '', label: 'projetos neste portfólio' },
    { n: 3074, s: '', label: 'itens catalogados no MU Explorer' },
  ]
  return (
    <Section id="sobre" eyebrow="piloto" title={<>Código, testes <span className="text-gradient">e games</span></>}>
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5 text-lg leading-relaxed text-white/70">
          {profile.about.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
            >
              {p}
            </motion.p>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 200, damping: 18 }}
              whileHover={{ y: -6 }}
              className="rounded-2xl border border-line bg-panel/60 p-5 backdrop-blur"
            >
              <div className="text-3xl font-bold text-gradient sm:text-4xl">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-1 text-sm text-white/50">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
