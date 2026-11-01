import { motion } from 'motion/react'
import { Mail, Play, Camera, Tv, MessageCircle } from 'lucide-react'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from './helpers'
import { ShimmerButton } from '@/components/ui/shimmer-button'

const socials = [
  { label: 'GitHub', href: profile.links.github, icon: <GithubIcon /> },
  { label: 'LinkedIn', href: profile.links.linkedin, icon: <LinkedinIcon /> },
  { label: 'YouTube', href: profile.links.youtube, icon: <Play className="size-5" /> },
  { label: 'Instagram', href: profile.links.instagram, icon: <Camera className="size-5" /> },
  { label: 'Twitch', href: profile.links.twitch, icon: <Tv className="size-5" /> },
  { label: 'Discord', href: profile.links.discord, icon: <MessageCircle className="size-5" /> },
]

export default function Contact() {
  return (
    <section id="contato" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-16 pt-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl border border-line bg-panel/70 px-6 py-16 text-center backdrop-blur sm:px-12"
      >
        <div className="absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        <p className="relative font-mono text-sm text-white">{'// transmissão'}</p>
        <h2 className="relative mt-3 text-4xl font-bold tracking-tight sm:text-6xl">
          Bora construir <span className="text-gradient">algo junto?</span>
        </h2>
        <p className="relative mx-auto mt-4 max-w-lg text-white/60">
          Estou aberto a vagas, freelas e projetos colaborativos. Manda uma mensagem.
        </p>
        {/* Magic UI: botão com brilho girando pela borda */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative mt-8 inline-block">
          <ShimmerButton
            onClick={() => (window.location.href = profile.links.email)}
            background="#000000"
            shimmerColor="#ffffff"
            shimmerDuration="2.5s"
            className="gap-2 px-7 py-3.5 font-medium shadow-[0_0_50px_-10px_rgb(255_255_255/0.35)]"
          >
            <Mail className="size-5" /> Enviar e-mail
          </ShimmerButton>
        </motion.div>
        <div className="relative mt-10 flex flex-wrap justify-center gap-3">
          {socials.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.07 }}
              whileHover={{ y: -6, scale: 1.1 }}
              className="rounded-full border border-line bg-white/5 p-3 text-white/60 hover:text-white"
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
      <footer className="mt-12 text-center font-mono text-xs text-white/30">
        Feito com React, Tailwind e Motion · {new Date().getFullYear()} · {profile.name}
      </footer>
    </section>
  )
}
