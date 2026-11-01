import { motion } from 'motion/react'
import { useState } from 'react'
import { stack } from '../data/profile'
import { Section, ease } from './helpers'
import ArsenalCloud, { type CloudItem } from './ArsenalCloud'

const ICON_COLOR = 'f2ede6'
const iconUrl = (slug: string) => `https://cdn.simpleicons.org/${slug}/${ICON_COLOR}`

// Ícone de cada item do inventário (Simple Icons)
const slugs: Record<string, string> = {
  Java: 'openjdk', 'Spring Boot': 'spring', Python: 'python', PostgreSQL: 'postgresql', Selenium: 'selenium',
  JavaScript: 'javascript', TypeScript: 'typescript', React: 'react', Astro: 'astro', Tailwind: 'tailwindcss', 'HTML e CSS': 'html5',
  pytest: 'pytest', Vitest: 'vitest', 'JSON Schema': 'json', SQLite: 'sqlite', Flyway: 'flyway', Swagger: 'swagger',
  Docker: 'docker', Cloudflare: 'cloudflare', 'GitHub Actions': 'githubactions', Git: 'git', 'Claude AI': 'claude', Vercel: 'vercel',
}

// Nuvem 3D: um pouco mais de ícones que o inventário
const tech: [string, string][] = [
  ['openjdk', 'Java'], ['spring', 'Spring Boot'], ['python', 'Python'], ['nodedotjs', 'Node.js'], ['postgresql', 'PostgreSQL'],
  ['sqlite', 'SQLite'], ['flyway', 'Flyway'], ['react', 'React'], ['typescript', 'TypeScript'], ['astro', 'Astro'],
  ['tailwindcss', 'Tailwind'], ['vite', 'Vite'], ['html5', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'],
  ['selenium', 'Selenium'], ['pytest', 'pytest'], ['vitest', 'Vitest'], ['docker', 'Docker'], ['git', 'Git'],
  ['github', 'GitHub'], ['cloudflare', 'Cloudflare'], ['claude', 'Claude AI'], ['opencv', 'OpenCV'], ['qt', 'Qt'],
]
const cloudItems: CloudItem[] = tech.map(([slug, name]) => ({ name, src: iconUrl(slug) }))

function Slot({ name, delay, main }: { name: string; delay: number; main: boolean }) {
  const [broken, setBroken] = useState(false)
  const slug = slugs[name]
  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease }}
      whileHover={{ y: -3 }}
      className={`group flex min-w-0 items-center gap-2.5 border bg-ink/60 px-2.5 py-2 transition-colors hover:border-accent/60 ${main ? 'border-accent/30' : 'border-line'}`}
    >
      <span className="grid size-7 shrink-0 place-items-center border border-line bg-panel">
        {slug && !broken ? (
          <img src={iconUrl(slug)} alt="" width={16} height={16} loading="lazy" onError={() => setBroken(true)} className="size-4" />
        ) : (
          <span className="pixel text-[9px] text-accent">{name.slice(0, 2).toUpperCase()}</span>
        )}
      </span>
      <span className="min-w-0 break-words text-[12.5px] font-medium leading-tight transition-colors group-hover:text-accent">{name}</span>
    </motion.li>
  )
}

export default function Stack() {
  const groups = Object.entries(stack)
  return (
    <Section id="stack" n="04" eyebrow="ferramentas que uso bem" title="Stack">
      <div className="grid items-center gap-12 lg:grid-cols-[1.9fr_1fr]">
        {/* inventário: um painel por categoria, cada tecnologia é um slot */}
        <div className="grid gap-4 sm:grid-cols-2">
          {groups.map(([group, items], gi) => (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: gi * 0.08, ease }}
              className={`relative border bg-panel p-4 ${gi === 0 ? 'hud-corners border-accent/40' : 'border-line'}`}
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="pixel text-[11px] uppercase text-accent">{group}</h3>
                <span className="pixel text-[10px] text-muted">
                  {items.length}/{items.length}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-2">
                {items.map((s, i) => (
                  <Slot key={s} name={s} main={gi === 0} delay={gi * 0.08 + i * 0.03} />
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

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
          <p className="pixel text-[10px] text-muted">ARRASTE PARA GIRAR · TOQUE NUM ÍCONE</p>
        </motion.div>
      </div>
    </Section>
  )
}
