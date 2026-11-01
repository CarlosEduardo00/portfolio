import { motion } from 'motion/react'
import { stack } from '../data/profile'
import { Section } from './helpers'
import ArsenalCloud, { type CloudItem } from './ArsenalCloud'

// Ícones do Simple Icons, todos em branco para combinar com o tema preto e branco
const tech: [string, string][] = [
  ['openjdk', 'Java'], ['spring', 'Spring Boot'], ['python', 'Python'], ['nodedotjs', 'Node.js'], ['postgresql', 'PostgreSQL'],
  ['sqlite', 'SQLite'], ['flyway', 'Flyway'], ['react', 'React'], ['typescript', 'TypeScript'], ['astro', 'Astro'],
  ['tailwindcss', 'Tailwind'], ['vite', 'Vite'], ['html5', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'],
  ['selenium', 'Selenium'], ['pytest', 'pytest'], ['vitest', 'Vitest'], ['docker', 'Docker'], ['git', 'Git'],
  ['github', 'GitHub'], ['cloudflare', 'Cloudflare'], ['claude', 'Claude AI'], ['opencv', 'OpenCV'], ['qt', 'Qt'],
]
const cloudItems: CloudItem[] = tech.map(([slug, name]) => ({ name, src: `https://cdn.simpleicons.org/${slug}/white` }))

const all = Object.values(stack).flat()

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee overflow-hidden py-2">
      <motion.div
        className="flex w-max gap-3"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      >
        {doubled.map((s, i) => (
          <span key={i} className="whitespace-nowrap rounded-xl border border-line bg-panel/70 px-5 py-3 font-mono text-sm text-white/70">
            {s}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

export default function Stack() {
  return (
    <Section id="stack" eyebrow="arsenal" title={<>Arsenal do <span className="text-gradient">dia a dia</span></>}>
      <div className="-mx-4 mb-14 space-y-2 sm:-mx-6">
        <Row items={all.slice(0, Math.ceil(all.length / 2))} />
        <Row items={all.slice(Math.ceil(all.length / 2))} reverse />
      </div>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,420px)_1fr]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Arraste para girar (com inércia); clique num ícone para trazê-lo à frente */}
        <div className="flex w-full justify-center">
          <ArsenalCloud items={cloudItems} />
        </div>
        <p className="font-mono text-xs text-white/35">arraste para girar · clique num ícone</p>
      </motion.div>
      <div className="grid gap-5">
        {Object.entries(stack).map(([group, items], gi) => (
          <motion.div
            key={group}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: gi * 0.12, duration: 0.6 }}
            className="rounded-2xl border border-line bg-panel/60 p-6 backdrop-blur"
          >
            <h3 className="mb-4 font-semibold">{group}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: gi * 0.12 + i * 0.05, type: 'spring', stiffness: 300 }}
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  className="cursor-default rounded-full bg-white/5 px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                >
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      </div>
    </Section>
  )
}
