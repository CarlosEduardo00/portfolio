import { motion } from 'motion/react'
import { stack } from '../data/profile'
import { Reveal, Section, ease } from './helpers'
import ArsenalCloud, { type CloudItem } from './ArsenalCloud'

// Ícones do Simple Icons para a nuvem 3D
const tech: [string, string][] = [
  ['openjdk', 'Java'], ['spring', 'Spring Boot'], ['python', 'Python'], ['nodedotjs', 'Node.js'], ['postgresql', 'PostgreSQL'],
  ['sqlite', 'SQLite'], ['flyway', 'Flyway'], ['react', 'React'], ['typescript', 'TypeScript'], ['astro', 'Astro'],
  ['tailwindcss', 'Tailwind'], ['vite', 'Vite'], ['html5', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'],
  ['selenium', 'Selenium'], ['pytest', 'pytest'], ['vitest', 'Vitest'], ['docker', 'Docker'], ['git', 'Git'],
  ['github', 'GitHub'], ['cloudflare', 'Cloudflare'], ['claude', 'Claude AI'], ['opencv', 'OpenCV'], ['qt', 'Qt'],
]
const cloudItems: CloudItem[] = tech.map(([slug, name]) => ({ name, src: `https://cdn.simpleicons.org/${slug}/f2ede6` }))

export default function Stack() {
  const groups = Object.entries(stack)
  return (
    <Section id="stack" n="04" eyebrow="ferramentas que uso bem" title="Stack">
      <div className="grid items-center gap-10 lg:grid-cols-[1.7fr_1fr]">
        <Reveal>
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-panel/60 md:grid-cols-4">
            {groups.map(([group, items], gi) => (
              <div key={group} className={`p-5 sm:p-6 ${gi % 2 ? 'border-l border-line' : ''} ${gi > 1 ? 'border-t border-line md:border-t-0' : ''} ${gi === 2 ? 'md:border-l' : ''}`}>
                <h3 className="mb-4 font-mono text-xs text-accent">
                  <span className="text-muted">~</span> {group}
                </h3>
                <ul className="space-y-2.5">
                  {items.map((s, i) => (
                    <motion.li
                      key={s}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: gi * 0.08 + i * 0.04, ease }}
                      className="group flex cursor-default items-center gap-2 text-sm font-medium"
                    >
                      <span className="size-1 rounded-full bg-muted transition-all duration-300 group-hover:w-3 group-hover:bg-accent" />
                      <span className="transition-colors group-hover:text-accent">{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease }}
          className="flex flex-col items-center gap-3"
        >
          {/* arraste para girar (com inércia); clique num ícone para trazê-lo à frente */}
          <div className="flex w-full justify-center">
            <ArsenalCloud items={cloudItems} max={380} />
          </div>
          <p className="font-mono text-[11px] text-muted">arraste para girar · clique num ícone</p>
        </motion.div>
      </div>
    </Section>
  )
}
