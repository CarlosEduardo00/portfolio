import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { profile } from '../data/profile'
import { Reveal, Section, ease } from './helpers'
import ArcadeBox from './space/ArcadeBox'

// Destaca em negrito os trechos entre **asteriscos**
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="font-semibold text-cream">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}

function Portrait() {
  const ref = useRef<HTMLDivElement>(null)
  // a foto desliza um pouco dentro da moldura conforme a rolagem
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])
  // e inclina levemente seguindo o mouse
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 })
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, clipPath: 'inset(12% 0 0 0 round 16px)' }}
      whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0 round 16px)', transitionEnd: { clipPath: 'none' } }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease }}
      className="[perspective:1000px]"
    >
      <motion.figure
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={(e) => {
          if (e.pointerType === 'touch') return
          const r = e.currentTarget.getBoundingClientRect()
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 6)
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
        }}
        onPointerLeave={() => {
          rx.set(0)
          ry.set(0)
        }}
        className="group relative"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-panel">
          <motion.img
            src="/carlos.webp"
            alt="Foto de Carlos Silva"
            width={1023}
            height={1537}
            style={{ y: imgY }}
            className="absolute inset-x-0 top-[-6%] h-[112%] w-full object-cover object-[50%_30%] grayscale transition-[filter] duration-700 group-hover:grayscale-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        </div>
        <figcaption className="mt-3 flex justify-between font-mono text-[11px] text-muted">
          <span>
            {profile.location.toLowerCase()} · {new Date().getFullYear()}
          </span>
          <span>↳ carlos, {profile.age} anos</span>
        </figcaption>
      </motion.figure>
    </motion.div>
  )
}

const aboutText = [
  'Sou **Java Developer** e **QA Engineer**. Hoje trabalho como **Analista de QA e Integrações**: testo, automatizo e integro sistemas com Java, Selenium e PostgreSQL para que funcionem de ponta a ponta.',
  'Comecei em 2022 com HTML e CSS e fui subindo: JavaScript, React, Python, Node e Java. Sou formado em **Análise e Desenvolvimento de Sistemas** e já fui **professor de programação** no ensino técnico, ensinando banco de dados, front-end e back-end.',
  'Com o tempo, me especializei em **qualidade de software**: automações e projetos reais, pensados para escalar e continuar fáceis de manter no longo prazo, sempre com **boas práticas**. Minha base é Java, mas sigo ampliando o repertório com projetos diversos. Não me prendo à ferramenta: o que me move é a capacidade de **criar e inovar**.',
  'Fora do expediente, junto as duas coisas de que mais gosto: **código e games**. É dessa mistura que nascem meus projetos pessoais.',
]

export default function About() {
  return (
    <Section id="sobre" n="01" eyebrow="quem está por trás dos testes" title="Sobre">
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div className="flex flex-col">
          <div className="space-y-5 font-mono text-[13.5px] leading-relaxed text-muted sm:text-sm">
            {aboutText.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p>
                  <Rich text={p} />
                </p>
              </Reveal>
            ))}
          </div>
          <dl className="mt-auto pt-12">
            {profile.facts.map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease }}
                className="group grid grid-cols-[7.5rem_1fr] border-t border-line py-3 font-mono text-[13px] last:border-b"
              >
                <dt className="text-cream">{k}</dt>
                <dd className="text-muted transition-colors group-hover:text-accent">{v.toLowerCase()}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
        <Portrait />
      </div>

      {/* código e games: o porquê dos projetos, com o mini Galaga como easter egg */}
      <div className="mt-24 grid items-center gap-10 lg:grid-cols-[1fr_1.55fr] lg:gap-14">
        <Reveal>
          <p className="pixel mb-4 font-mono text-xs text-muted">
            <span className="text-accent">↳</span> código e games
          </p>
          <h3 className="pixel font-serif text-5xl leading-none sm:text-6xl">
            Por que <em className="pixel text-accent">games</em>?
          </h3>
          <div className="mt-6 space-y-4 font-mono text-[13.5px] leading-relaxed text-muted sm:text-sm">
            {profile.games.map((p, i) => (
              <p key={i}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </Reveal>
        <ArcadeBox />
      </div>
    </Section>
  )
}
