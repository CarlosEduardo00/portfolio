import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { timeline } from '../data/profile'
import { Section } from './helpers'

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  // A linha vai "enchendo" conforme você rola
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <Section id="trajetoria" eyebrow="rota de voo" title={<>De <span className="text-gradient">HTML</span> a full-stack</>}>
      <div ref={ref} className="relative">
        <div className="absolute left-4 top-0 h-full w-px bg-line md:left-1/2" />
        <motion.div
          style={{ scaleY: fill }}
          className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-white/20 via-white to-white/20 md:left-1/2"
        />
        <ol className="space-y-12">
          {timeline.map((m, i) => {
            const left = i % 2 === 0
            return (
              <li key={m.title} className="relative md:grid md:grid-cols-2 md:gap-12">
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="absolute left-4 top-6 z-10 size-4 -translate-x-1/2 rounded-full border-2 border-ink bg-white shadow-[0_0_14px] shadow-white/70 md:left-1/2"
                />
                <motion.div
                  initial={{ opacity: 0, x: left ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={`ml-10 rounded-2xl border border-line bg-panel/60 p-6 backdrop-blur md:ml-0 ${left ? '' : 'md:col-start-2'}`}
                >
                  <p className="font-mono text-sm text-white">{m.period}</p>
                  <h3 className="mt-1 text-xl font-semibold">{m.title}</h3>
                  <p className="mt-2 text-white/60">{m.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.tags.map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-white/60">
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </li>
            )
          })}
        </ol>
      </div>
    </Section>
  )
}
