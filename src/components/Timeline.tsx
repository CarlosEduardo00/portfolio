import { motion } from 'motion/react'
import { timeline } from '../data/profile'
import { Section, ease } from './helpers'
import { design } from '../design'

// Experiência, da mais recente para a mais antiga. O formato muda conforme a variante de design.
export default function Timeline() {
  const rows = [...timeline].reverse()
  return (
    <Section id="experiencia" n="03" eyebrow="trajetória até aqui" title="Experiência">
      {design === 'b' ? <Vertical rows={rows} /> : design === 'c' ? <Quests rows={rows} /> : <Rows rows={rows} />}
    </Section>
  )
}

type Rows = { rows: typeof timeline }

// a: linhas em três colunas (período · cargo · descrição)
function Rows({ rows }: Rows) {
  return (
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
  )
}

// b: linha vertical com marcadores; o primeiro (atual) em destaque
function Vertical({ rows }: Rows) {
  return (
    <ol className="relative ml-2 border-l border-line">
      {rows.map((m, i) => (
        <motion.li
          key={m.title}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: i * 0.05, ease }}
          className="group relative pb-10 pl-8 last:pb-0"
        >
          <span
            className={`absolute -left-[7px] top-1.5 size-3.5 rounded-full border-2 border-ink transition-transform group-hover:scale-125 ${i === 0 ? 'bg-accent shadow-[0_0_0_4px_rgb(233_164_106/0.2)]' : 'bg-muted'}`}
          />
          <p className="font-mono text-xs text-accent">{m.period.toLowerCase()}</p>
          <h3 className="mt-1 font-serif text-3xl leading-tight">{m.title}</h3>
          <p className="mt-2 max-w-2xl leading-relaxed text-cream/70">{m.text}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {m.tags.map((t) => (
              <span key={t} className="rounded-full bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-muted">
                {t.toLowerCase()}
              </span>
            ))}
          </div>
        </motion.li>
      ))}
    </ol>
  )
}

// c: "registro de quests" em cards, com a atual marcada como em andamento
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
