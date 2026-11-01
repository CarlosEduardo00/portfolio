import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { PixelShip } from './space/PixelShip'

const items = [
  ['Sobre', '#sobre'],
  ['Trajetória', '#trajetoria'],
  ['Projetos', '#projetos'],
  ['Stack', '#stack'],
  ['Contato', '#contato'],
]

export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })
  const shipLeft = useTransform(progress, (v) => `calc(${v * 100}% - 10px)`)
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/60 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="group flex items-center gap-2 font-mono text-sm font-semibold">
          <PixelShip className="size-5 text-white transition-transform duration-300 group-hover:-translate-y-1" />
          <span className="text-white">&lt;</span>
          {profile.nickname}
          <span className="text-white/35"> /&gt;</span>
        </a>
        <ul className="hidden gap-1 md:flex">
          {items.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="rounded-full px-4 py-2 text-sm text-white/60 transition hover:bg-white/5 hover:text-white">
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden px-4 pb-4 md:hidden">
          {items.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="block py-2 text-white/70">
                {label}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
      {/* barra de progresso com a nave voando na ponta */}
      <div className="relative h-0.5">
        <motion.div style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-gradient-to-r from-white/10 via-white/60 to-white" />
        <motion.div style={{ left: shipLeft }} className="absolute -top-[9px] rotate-90">
          <PixelShip className="size-5 text-white drop-shadow-[0_0_6px_rgb(255_255_255/0.8)]" />
        </motion.div>
      </div>
    </motion.header>
  )
}
