# Portfólio · Carlos Eduardo

Site pessoal feito com **React 19 + TypeScript + Vite + Tailwind CSS 4 + Motion** (antigo Framer Motion).

## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ para publicar (Vercel, Netlify, Cloudflare Pages)
```

## Editar conteúdo

Todos os textos, projetos, trajetória e stack ficam em [`src/data/profile.ts`](src/data/profile.ts).
Para adicionar um projeto, copie um item da lista `projects`. Sem `repo` o card mostra um cadeado (repositório privado).

## Tema e animações

Visual preto e branco com temática de naves (no estilo Galaga), igual ao README do perfil no GitHub.

| Onde | Efeito |
|---|---|
| Fundo | Campo de estrelas caindo em três velocidades, estrelas cadentes e brilho que segue o mouse |
| Topo | Mini Galaga: a nave segue o mouse e atira na formação de inimigos (clique também atira); parada, ela joga sozinha. Placar e recorde ficam no navegador |
| Menu | Nave como logo e uma navezinha que avança pela barra de progresso da rolagem |
| Terminal | Digita o "lançamento" do perfil (`npx carlinhos --launch`) |
| Trajetória | Linha que preenche conforme a rolagem, cards entrando dos lados |
| Missões (projetos) | Cards com inclinação 3D, brilho que segue o cursor e feixes de luz nas missões principais |
| Arsenal (stack) | Faixas infinitas, nuvem 3D de ícones e chips com mola |

O jogo pausa quando o topo sai da tela. Quem ativa "reduzir movimento" no sistema recebe a versão sem animações pesadas.

## Componentes do Magic UI

Instalados com `npx shadcn@latest add @magicui/<nome>` em `src/components/ui/`:

| Componente | Onde |
|---|---|
| `terminal` | Terminal que digita o perfil no topo |
| `border-beam` | Feixes de luz na borda do terminal e dos projetos em destaque |
| `hyper-text` | Títulos pequenos das seções, que embaralham ao aparecer |
| `icon-cloud` | Nuvem 3D de tecnologias na seção Stack (carregada sob demanda) |
| `shimmer-button` | Botão de e-mail no contato |

Para adicionar mais: peça ao Claude Code (com o MCP do Magic UI ativo) ou rode `npx shadcn@latest add @magicui/<nome>`.

## MCPs de front-end

Instalados no Claude Code no escopo local deste projeto (`claude mcp list` mostra os três como conectados) e também descritos em `.mcp.json`:

- **Magic UI**: componentes animados prontos (marquee, shimmer, partículas, globos, beams)
- **shadcn**: busca e instala componentes do shadcn/ui
- **Context7**: documentação atualizada de React, Motion, Tailwind, Next e outros

Opcional, com chave grátis em 21st.dev: **Magic (21st.dev)**, gera componentes React a partir de uma descrição.

```bash
claude mcp add magic --scope project --env API_KEY=SUA_CHAVE -- cmd /c npx -y @21st-dev/magic@latest
```

## README do perfil

A pasta [`profile-readme/`](profile-readme) tem o README novo do GitHub e os workflows que o mantêm atualizado.
Ela deve ir para o repositório `CarlosEduardo00/CarlosEduardo00`.
