import { motion } from 'motion/react'
import { comparing, design, designs } from '../design'

// Barra temporária para comparar as variantes (aparece só com ?design= no endereço)
export default function DesignSwitch() {
  if (!comparing) return null
  return (
    <motion.nav
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 24 }}
      aria-label="Comparar designs"
      className="fixed inset-x-0 bottom-4 z-[70] mx-auto flex w-max max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full border border-line bg-panel/95 p-1 shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <span className="hidden px-3 font-mono text-[11px] text-muted sm:inline">design</span>
      {designs.map((d) => (
        <a
          key={d.id}
          href={`?design=${d.id}`}
          title={d.note}
          className={`rounded-full px-3.5 py-1.5 font-mono text-xs transition ${design === d.id ? 'bg-accent text-ink' : 'text-muted hover:text-cream'}`}
        >
          {d.id.toUpperCase()} · {d.name}
        </a>
      ))}
    </motion.nav>
  )
}
