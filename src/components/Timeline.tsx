import { motion } from 'motion/react'
import { timeline } from '../data/profile'
import { Section, ease } from './helpers'

// Experiência como "registro de quests", da mais recente para a mais antiga
export default function Timeline() {
  const rows = [...timeline].reverse()
  return (
    <Section id="experiencia" n="03" eyebrow="trajetória até aqui" title="Experiência">
      <Quests rows={rows} />
    </Section>
  )
}

type Rows = { rows: typeof timeline }

// cards de quest, com a atual marcada como em andamento
function Quests({ rows }: Rows) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {rows.map((m, i) => {
        const current = i === 0
        return (
          <motion.li
            key={m.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease }}
            whileHover={{ y: -4 }}
            className={`relative border bg-panel p-5 ${current ? 'hud-corners border-accent/50' : 'border-line'}`}
          >
            <div className="flex items-center justify-between">
              <span className="pixel text-[10px] text-muted">QUEST {String(rows.length - i).padStart(2, '0')}</span>
              <span className={`pixel text-[10px] ${current ? 'text-accent' : 'text-muted'}`}>
                {current ? (
                  <>
                    EM ANDAMENTO <span className="blink">▮</span>
                  </>
                ) : (
                  'COMPLETA ✓'
                )}
              </span>
            </div>
            <h3 className="mt-3 font-serif text-2xl uppercase leading-tight">{m.title}</h3>
            <p className="mt-1 font-mono text-[11px] text-accent">{m.period.toLowerCase()}</p>
            <p className="mt-3 font-mono text-[12.5px] leading-relaxed text-muted">{m.text}</p>
            <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] text-cream/60">
              <span className="text-muted">loot:</span> {m.tags.join(' · ').toLowerCase()}
            </p>
          </motion.li>
        )
      })}
    </ol>
  )
}
