// Variantes de design para comparação: escolha pelo endereço, ex. /?design=b
// a = Editorial (atual) · b = Bold (títulos grotescos, colunas com título fixo) · c = Arcade (HUD de jogo)
// Depois da escolha, a variante vencedora vira o padrão e as outras saem.

export type Design = 'a' | 'b' | 'c'

export const designs: { id: Design; name: string; note: string }[] = [
  { id: 'a', name: 'Editorial', note: 'serifa Fraunces, layout atual' },
  { id: 'b', name: 'Bold', note: 'Bricolage Grotesque, título fixo ao lado' },
  { id: 'c', name: 'Arcade', note: 'Chakra Petch, HUD de jogo' },
]

function read(): Design {
  try {
    const d = new URLSearchParams(window.location.search).get('design')
    return d === 'b' || d === 'c' ? d : 'a'
  } catch {
    return 'a'
  }
}

export const design: Design = read()
export const comparing = (() => {
  try {
    return new URLSearchParams(window.location.search).has('design')
  } catch {
    return false
  }
})()

// escolhe um valor conforme a variante ativa
export const pick = <T,>(v: Record<Design, T>): T => v[design]

const extraFonts: Partial<Record<Design, string>> = {
  b: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap',
  c: 'https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,500;0,600;0,700;1,600&display=swap',
}

export function applyDesign() {
  document.documentElement.dataset.design = design
  const href = extraFonts[design]
  if (href) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}
