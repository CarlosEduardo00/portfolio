import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './helpers'
import { design } from '../design'

const items = [
  ['sobre', '#sobre'],
  ['missões', '#projetos'],
  ['experiência', '#experiencia'],
  ['stack', '#stack'],
  ['contato', '#contato'],
] as const

export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32 })
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  // destaca no menu a seção que está na tela
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive('#' + e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    items.forEach(([, href]) => {
      const el = document.querySelector(href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/75 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-baseline gap-3 text-sm">
          <span className="font-semibold lowercase">
            {profile.name}
            <span className="text-accent">.</span>
          </span>
          <span className="hidden font-mono text-xs text-muted sm:inline">↳ java · qa</span>
        </a>
        <ul className="hidden gap-1 md:flex">
          {items.map(([label, href]) => (
            <li key={href} className="relative">
              <a href={href} className={`relative z-10 block px-3 py-1.5 text-xs transition-colors ${design === 'c' ? 'pixel uppercase' : 'font-mono'} ${active === href ? 'text-cream' : 'text-muted hover:text-cream'}`}>
                {label}
              </a>
              {active === href && (
                <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="hidden rounded-full border border-line p-2 text-muted transition hover:border-accent/60 hover:text-cream sm:block">
            <GithubIcon className="size-3.5" />
          </a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hidden rounded-full border border-line p-2 text-muted transition hover:border-accent/60 hover:text-cream sm:block">
            <LinkedinIcon className="size-3.5" />
          </a>
          <button className="rounded-full border border-line p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-line px-4 md:hidden">
            {items.map(([label, href], i) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="flex items-baseline gap-3 py-3 font-serif text-3xl">
                  <span className="font-mono text-xs text-accent">0{i + 1}</span>
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      {/* progresso da rolagem */}
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 -bottom-px h-px origin-left bg-accent" />
    </motion.header>
  )
}
