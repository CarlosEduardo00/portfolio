// Tudo o que aparece no site vem deste arquivo. Edite aqui para atualizar textos, projetos e trajetória.

export const profile = {
  name: 'Carlos Eduardo',
  nickname: 'Carlinhos',
  githubUser: 'CarlosEduardo00',
  location: 'Brasil',
  roles: ['Desenvolvedor Java', 'QA Tester', 'Full-stack em construção', 'Criador de projetos de fã'],
  headline:
    'Construo aplicações completas, do scraping e da API até a interface, e garanto que funcionem com olhar de QA.',
  about: [
    'Comecei em 2022 com HTML e CSS, publicando cada exercício na Vercel. De lá pra cá passei por JavaScript, React, Python, Node e Java, sempre aprendendo construindo.',
    'Hoje trabalho como Analista de QA e Suporte usando Java, Selenium e PostgreSQL, e curso Análise e Desenvolvimento de Sistemas.',
    'Nos projetos pessoais junto as duas coisas de que mais gosto: código e games. Isso virou uma enciclopédia de Zelda com mapa interativo, uma base de dados completa de MU Online e um app desktop que monitora o jogo.',
  ],
  links: {
    github: 'https://github.com/CarlosEduardo00',
    linkedin: 'https://www.linkedin.com/in/carlos-silva-49620815b/',
    email: 'mailto:carloscontato2000@hotmail.com',
    youtube: 'https://www.youtube.com/channel/UCYF3sregAil3V4dDkZ9EQ5g',
    instagram: 'https://www.instagram.com/buiux/',
    twitch: 'https://www.twitch.tv/buiux',
    discord: 'https://discordapp.com/users/339222450497781760',
  },
}

export type Project = {
  name: string
  tagline: string
  description: string
  highlights?: string[]
  stack: string[]
  category: 'Full-stack' | 'Python' | 'Front-end' | 'Back-end'
  year: number
  repo?: string // vazio = repositório privado
  live?: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    name: 'Hyrule Explorer',
    tagline: 'Enciclopédia, mapa interativo e tracker de Zelda: BotW',
    description:
      'Aplicação de fã com importador de dados, PostgreSQL, API REST documentada e front-end com mapa do jogo, 900 Korok Seeds, 136 shrines, tracker de progresso e calculadora de receitas.',
    highlights: ['API com 21 rotas + Swagger', 'Mapa com Leaflet e clusters', 'Migrations com Flyway'],
    stack: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'React', 'TypeScript', 'Tailwind', 'Docker'],
    category: 'Full-stack',
    year: 2026,
    featured: true,
  },
  {
    name: 'MU Explorer',
    tagline: 'Wiki e API estática de MU Online',
    description:
      'Scrapers educados coletam e normalizam dados de fontes de fãs (com autorização), validam contra JSON Schema e publicam um site em Astro com API estática no Cloudflare Workers.',
    highlights: ['3.074 itens · 291 monstros · 23.759 drops', 'Planner de builds', 'Ambientes de homologação e produção'],
    stack: ['Python', 'Astro', 'TypeScript', 'JSON Schema', 'SQLite', 'Cloudflare Workers', 'pytest'],
    category: 'Full-stack',
    year: 2026,
    repo: 'https://github.com/CarlosEduardo00/mu-explorer',
    live: 'https://mu-explorer.buiu.workers.dev',
    featured: true,
  },
  {
    name: 'MU Sentinel',
    tagline: 'Monitor desktop com visão computacional',
    description:
      'App para Windows que observa as janelas do MU Online, detecta morte, desconexão e travamento só pela imagem da tela, e avisa pelo Telegram. Tem assistente de configuração e atualização automática pelo GitHub Releases.',
    highlights: ['OpenCV + OCR', 'Auto-update com SHA-256', 'Build e release automatizados'],
    stack: ['Python 3.12', 'PySide6', 'OpenCV', 'RapidOCR', 'Telegram API', 'PyInstaller', 'PowerShell'],
    category: 'Python',
    year: 2026,
    repo: 'https://github.com/CarlosEduardo00/mu-sentinel',
    live: 'https://github.com/CarlosEduardo00/mu-sentinel/releases/latest',
    featured: true,
  },
  {
    name: 'SIP Manager',
    tagline: 'Aplicação web com Node e EJS',
    description: 'Gerenciador web renderizado no servidor com templates EJS, preparado para deploy com Procfile.',
    stack: ['Node.js', 'Express', 'EJS', 'CSS'],
    category: 'Back-end',
    year: 2023,
  },
  {
    name: 'Bot Discord',
    tagline: 'Bot em JavaScript para Discord',
    description: 'Bot com comandos personalizados para servidor do Discord.',
    stack: ['JavaScript', 'Node.js', 'discord.js'],
    category: 'Back-end',
    year: 2023,
  },
  {
    name: 'Projeto Quitanda',
    tagline: 'Sistema de vendas em Python',
    description: 'Exercício de estudo: controle de produtos e vendas de uma quitanda no terminal.',
    stack: ['Python'],
    category: 'Python',
    year: 2023,
    repo: 'https://github.com/CarlosEduardo00/Projeto_quitanda',
  },
  {
    name: 'Calculadora IMC',
    tagline: 'Calculadora de IMC responsiva',
    description: 'Calcula o IMC e mostra a classificação com interface limpa.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Front-end',
    year: 2023,
    repo: 'https://github.com/CarlosEduardo00/calculadora_imc',
    live: 'https://calculadora-imc-delta-pied.vercel.app',
  },
  {
    name: 'Berserk',
    tagline: 'Landing page temática',
    description: 'Página sobre o mangá Berserk, com layout responsivo e interações em JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Front-end',
    year: 2022,
    repo: 'https://github.com/CarlosEduardo00/berserk',
    live: 'https://berserk-seven.vercel.app',
  },
  {
    name: 'Gerador de Senha',
    tagline: 'Senhas fortes em um clique',
    description: 'Gera senhas aleatórias com tamanho ajustável e botão de copiar.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Front-end',
    year: 2022,
    repo: 'https://github.com/CarlosEduardo00/Gerador_de_senha',
    live: 'https://gerador-de-senha-seven.vercel.app',
  },
  {
    name: 'Relógio Digital',
    tagline: 'Relógio em tempo real',
    description: 'Relógio digital estilizado atualizado a cada segundo com JavaScript.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    category: 'Front-end',
    year: 2022,
    repo: 'https://github.com/CarlosEduardo00/relogio_digital',
    live: 'https://relogio-digital-cyan.vercel.app',
  },
  {
    name: 'Desafios Codelândia',
    tagline: 'Desafios de layout da comunidade',
    description: 'Série de interfaces feitas a partir dos desafios semanais da Codelândia.',
    stack: ['HTML', 'CSS'],
    category: 'Front-end',
    year: 2022,
    repo: 'https://github.com/CarlosEduardo00/Desafios_Codelandia',
    live: 'https://desafios-codelandia-kappa.vercel.app',
  },
  {
    name: 'Projeto Catálogo',
    tagline: 'Catálogo de produtos',
    description: 'Vitrine de produtos em grid responsivo.',
    stack: ['HTML', 'CSS'],
    category: 'Front-end',
    year: 2022,
    repo: 'https://github.com/CarlosEduardo00/ProjetoCatalogo',
    live: 'https://projeto-catalogo-iota.vercel.app',
  },
]

export type Milestone = {
  period: string
  title: string
  text: string
  tags: string[]
}

// Ajuste datas e empresas conforme seu LinkedIn.
export const timeline: Milestone[] = [
  {
    period: 'Mar 2022',
    title: 'Primeiro commit',
    text: 'Criei a conta no GitHub e comecei pelo básico: páginas em HTML e CSS, cada uma publicada na Vercel.',
    tags: ['HTML', 'CSS', 'Git', 'Vercel'],
  },
  {
    period: '2022',
    title: 'JavaScript e interação',
    text: 'Desafios da Codelândia, gerador de senha, relógio digital e landing pages. Foi quando a lógica de programação entrou de vez.',
    tags: ['JavaScript', 'Responsividade', 'DOM'],
  },
  {
    period: '2023',
    title: 'Expandindo a stack',
    text: 'Estudos de React, primeiros passos em Python, um bot de Discord e uma aplicação Node com EJS. Comecei a faculdade de Análise e Desenvolvimento de Sistemas.',
    tags: ['React', 'Python', 'Node.js', 'Java'],
  },
  {
    period: 'Carreira',
    title: 'Analista de QA e Suporte',
    text: 'Entrei no mercado testando e dando suporte a sistemas: automação com Selenium, Java no dia a dia e consultas em PostgreSQL.',
    tags: ['Java', 'Selenium', 'PostgreSQL', 'QA'],
  },
  {
    period: '2026',
    title: 'Projetos full-stack de verdade',
    text: 'Hyrule Explorer, MU Explorer e MU Sentinel: back-end em Spring Boot, scrapers em Python, deploy na Cloudflare, visão computacional e releases automatizadas, com desenvolvimento assistido por IA.',
    tags: ['Spring Boot', 'TypeScript', 'Python', 'Cloudflare', 'IA'],
  },
]

export const stack = {
  'Back-end': ['Java', 'Spring Boot', 'Python', 'Node.js', 'PostgreSQL', 'SQLite', 'Flyway'],
  'Front-end': ['React', 'TypeScript', 'Astro', 'Tailwind', 'Vite', 'HTML', 'CSS'],
  'Qualidade e ferramentas': ['Selenium', 'pytest', 'Vitest', 'Docker', 'Git', 'Cloudflare', 'Claude Code'],
}
