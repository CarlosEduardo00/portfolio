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

## Visual e animações

Tema **Arcade**: fundo grafite com pontos, títulos em caixa alta (Chakra Petch), texto em Inter, detalhes em IBM Plex Mono e fonte pixelada (Silkscreen) em rótulos de jogo. Destaque quente em `--color-accent` ([`src/index.css`](src/index.css)).

| Onde | Efeito |
|---|---|
| Topo | Tela de "seleção de jogador": PLAYER 1, nome grande, ficha com foto e níveis (Java > Python > JavaScript > Astro), PRESS START |
| Seções | Cabeçalho "LEVEL 0X" com cantoneiras de HUD; menu com a seção atual marcada |
| Sobre | Foto (cinza com mouse, colorida no celular), ficha e bloco "Por que games?" com o mini Galaga |
| Mini Galaga | A nave segue o mouse só dentro da caixa e cada clique atira; sem mouse, joga sozinha |
| Missões | Cards em destaque com moldura de seleção (como escolher um item num jogo); demais projetos em lista |
| Experiência | Registro de quests: a atual "em andamento", as outras "completa" |
| Stack | Inventário por categoria (cada tecnologia é um slot com ícone) e nuvem 3D para girar |
| Contato | Formulário que monta o e-mail (sem servidor), status e redes |

Testado em celulares de 320 a 430 px de largura, celular deitado e desktop. Quem ativa "reduzir movimento" recebe a versão sem animações pesadas.

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
