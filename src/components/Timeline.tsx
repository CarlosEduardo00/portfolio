import { motion } from 'motion/react'
import { timeline } from '../data/profile'
import { Section, ease } from './helpers'

// Experiência em linhas, da mais recente para a mais antiga
export default function Timeline() {
  const rows = [...timeline].reverse()
  return (
    <Section id="experiencia" n="03" eyebrow="trajetória até aqui" title="Experiência">
      <ol className="border-b border-line">
        {rows.map((m, i) => (
          <motion.li
            key={m.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: i * 0.05, ease }}
            className="group relative grid gap-2 border-t border-line py-6 md:grid-cols-[9rem_1fr_1.15fr] md:gap-8"
          >
            {/* linha de destaque que cresce no hover */}
            <span className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
            <span className="flex items-start gap-2 pt-1.5 font-mono text-[11px] text-muted">
              <span className={i === 0 ? 'text-accent' : ''}>●</span>
              {m.period.toLowerCase()}
            </span>
            <h3 className="font-serif text-2xl leading-tight transition-transform duration-300 group-hover:translate-x-1.5 sm:text-[1.7rem]">{m.title}</h3>
            <div>
              <p className="font-mono text-[12.5px] leading-relaxed text-muted">{m.text}</p>
              <p className="mt-2 font-mono text-[11px] text-cream/60">{m.tags.join(' · ').toLowerCase()}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}
