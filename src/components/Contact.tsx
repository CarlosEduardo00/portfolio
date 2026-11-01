import { motion } from 'motion/react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowUpRight, Camera, Mail, MessageCircle, Play, Send, Tv } from 'lucide-react'
import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon, Section, ease } from './helpers'
import { pick } from '../design'

const email = profile.links.email.replace('mailto:', '')

const socials = [
  { label: 'github', sub: '@' + profile.githubUser, href: profile.links.github, icon: <GithubIcon className="size-3.5" /> },
  { label: 'linkedin', sub: '/in/carlos-silva', href: profile.links.linkedin, icon: <LinkedinIcon className="size-3.5" /> },
  { label: 'e-mail', sub: email, href: profile.links.email, icon: <Mail className="size-3.5" /> },
]
const extras = [
  { label: 'YouTube', href: profile.links.youtube, icon: <Play className="size-3.5" /> },
  { label: 'Instagram', href: profile.links.instagram, icon: <Camera className="size-3.5" /> },
  { label: 'Twitch', href: profile.links.twitch, icon: <Tv className="size-3.5" /> },
  { label: 'Discord', href: profile.links.discord, icon: <MessageCircle className="size-3.5" /> },
]

function Card({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease }}
      className={`rounded-2xl border border-line bg-panel p-5 ${className}`}
    >
      {children}
    </motion.div>
  )
}

const label = 'mb-1.5 block font-mono text-[11px] text-accent'
const field =
  'w-full rounded-lg border border-line bg-ink/60 px-3 py-2.5 font-mono text-[13px] text-cream placeholder:text-muted/60 outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/15'

// Sem servidor: o formulário monta o e-mail e abre no app de e-mail de quem visita
function Composer() {
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contato pelo portfólio${name ? ` · ${name}` : ''}`)
    const body = encodeURIComponent(msg)
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
  }
  return (
    <form onSubmit={submit} className="flex h-full flex-col">
      <div className="-mx-5 -mt-5 mb-5 flex items-center justify-between border-b border-line px-5 py-2.5 font-mono text-[11px] text-muted">
        <span>~/contato.sh</span>
        <span aria-hidden>— ▢ ✕</span>
      </div>
      <label className={label} htmlFor="c-name">
        nome
      </label>
      <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="seu nome" className={field} />
      <label className={`${label} mt-4`} htmlFor="c-msg">
        mensagem
      </label>
      <textarea id="c-msg" required value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} placeholder="conta o que você precisa…" className={`${field} flex-1 resize-none`} />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="group mt-4 flex items-center justify-center gap-2 rounded-lg bg-accent py-2.5 font-mono text-sm font-medium text-ink"
      >
        enviar <Send className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.button>
    </form>
  )
}

export default function Contact() {
  return (
    <>
      <Section id="contato" n="05" eyebrow="vamos conversar" title="Contato">
        <div className={`grid gap-4 ${pick({ a: 'lg:grid-cols-[1fr_1.5fr_1fr]', b: 'md:grid-cols-2', c: 'lg:grid-cols-[1fr_1.5fr_1fr]' })}`}>
          <div className="grid gap-4">
            <Card>
              <p className="flex items-center justify-between font-mono text-[11px] text-muted">
                01 · status
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-accent" />
                </span>
              </p>
              <p className="mt-4 font-serif text-5xl italic text-accent">disponível</p>
              <p className="mt-3 font-mono text-[12px] leading-relaxed text-muted">Aberto a vagas de Java, QA e integrações, além de projetos e boas conversas.</p>
            </Card>
            <Card delay={0.08}>
              <p className="font-mono text-[11px] text-muted">02 · atuação</p>
              <p className="mt-4 font-serif text-3xl leading-tight">{profile.status}</p>
              <p className="mt-3 font-mono text-[12px] text-muted">java · selenium · postgresql</p>
            </Card>
          </div>
          <Card delay={0.12} className="flex flex-col">
            <Composer />
          </Card>
          <div className={`grid gap-4 ${pick({ a: '', b: 'md:col-span-2 md:grid-cols-2', c: '' })}`}>
            <Card delay={0.16}>
              <p className="font-mono text-[11px] text-muted">03 · resposta</p>
              <p className="mt-4 font-serif text-5xl italic text-accent">~24h</p>
              <p className="mt-3 font-mono text-[12px] text-muted">respondo pessoalmente, em dias úteis.</p>
            </Card>
            <Card delay={0.2}>
              <p className="mb-2 font-mono text-[11px] text-muted">04 · redes</p>
              <ul>
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 border-b border-line py-2.5 last:border-0">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-hover:border-accent/60 group-hover:text-accent">{s.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13px] font-medium">{s.label}</span>
                        <span className="block truncate font-mono text-[11px] text-muted">{s.sub}</span>
                      </span>
                      <ArrowUpRight className="size-3.5 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                {extras.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid size-7 place-items-center rounded-full border border-line text-muted transition hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent">
                    {s.icon}
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-4 py-6 font-mono text-[11px] text-muted sm:flex-row sm:px-6">
          <span className="font-sans text-sm font-semibold lowercase text-cream">
            {profile.name}
            <span className="text-accent">.</span>
          </span>
          <span>© {new Date().getFullYear()} · feito com react, tailwind e motion</span>
        </div>
      </footer>
    </>
  )
}
