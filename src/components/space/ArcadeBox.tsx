import { motion } from 'motion/react'
import { ease } from '../helpers'
import GalagaField from './GalagaField'

// Curiosidade: o mini Galaga que já foi o topo do site, agora numa "tela de fliperama"
export default function ArcadeBox() {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease }}
      className="mt-20"
    >
      <div className="overflow-hidden rounded-2xl border border-line bg-panel">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[11px] text-muted">
          <span>
            <span className="text-accent">~/</span>curiosidade/galaga.exe
          </span>
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-white/15" />
            <span className="size-2 rounded-full bg-accent/80" />
          </span>
        </div>
        {/* área do jogo: a nave só obedece aqui dentro */}
        <div className="relative h-[380px] cursor-crosshair overflow-hidden bg-[#070707] [background-image:radial-gradient(rgb(255_255_255/0.08)_1px,transparent_1px)] [background-size:22px_22px] sm:h-[420px]">
          <GalagaField />
          <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_2px,rgb(0_0_0/0.18)_3px)]" />
        </div>
      </div>
      <figcaption className="mt-3 flex flex-col justify-between gap-1 font-mono text-[11px] text-muted sm:flex-row">
        <span>
          <span className="text-accent">↳</span> curiosidade: este portfólio já foi uma nave. mova o mouse aqui dentro e clique para atirar.
        </span>
        <span>sem mouse, ela joga sozinha</span>
      </figcaption>
    </motion.figure>
  )
}
