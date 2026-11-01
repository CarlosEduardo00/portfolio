# Portfólio · Carlos Silva

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
| Topo | Mini Galaga: a nave segue o cursor por todo o topo (com inércia, inclinação e propulsor) e atira na formação de inimigos. Cada clique solta uma micro explosão e um tiro. Se o cursor sai do topo, ela decola; quando volta, reentra por baixo. Parada ou no celular, joga sozinha. Placar e recorde ficam no navegador |
| Botões do topo | Atração magnética curta e firme, com mola rígida (sem balanço) |
| Menu | Nave como logo e uma navezinha que avança pela barra de progresso da rolagem |
| Terminal | Digita o "lançamento" do perfil (`npx carlinhos --launch`) |
| Trajetória | Linha que preenche conforme a rolagem, cards entrando dos lados |
| Missões (projetos) | Seletor com 4 efeitos: Holograma (3D suave com reflexo), Radar (mira e varredura), Flip (vira e mostra a ficha da missão) e Magnético. A escolha fica salva no navegador |
| Arsenal (stack) | Faixas infinitas e nuvem 3D própria (`ArsenalCloud`): arraste com inércia, clique num ícone para trazê-lo à frente, nome ao passar o mouse |

O jogo pausa quando o topo sai da tela. Quem ativa "reduzir movimento" no sistema recebe a versão sem animações pesadas.

## Componentes do Magic UI

Instalados com `npx shadcn@latest add @magicui/<nome>` em `src/components/ui/`:

| Componente | Onde |
|---|---|
| `terminal` | Terminal que digita o perfil no topo |
| `border-beam` | Feixes de luz na borda do terminal e dos projetos em destaque |
| `hyper-text` | Títulos pequenos das seções, que embaralham ao aparecer |
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
