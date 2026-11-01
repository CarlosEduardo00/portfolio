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

Estilo editorial: fundo grafite, títulos grandes em serifa (Instrument Serif), textos em mono (JetBrains Mono) e um destaque quente (`--color-accent` em [`src/index.css`](src/index.css)), que combina com o tom da foto.

| Onde | Efeito |
|---|---|
| Topo | Nome sobe letra por letra de dentro de uma máscara e acompanha o mouse de leve; faixa com localização, foco e anos de experiência |
| Menu | Seção atual marcada com um ponto, barra de progresso da rolagem |
| Sobre | Foto em preto e branco que ganha cor ao passar o mouse, desliza com a rolagem e inclina com o cursor |
| Missões | Cards em destaque com capa, inclinação suave e moldura de seleção (como escolher um item num jogo); demais projetos em lista |
| Curiosidade | Mini Galaga numa "tela de fliperama" dentro de Missões: a nave segue o mouse só ali dentro e cada clique atira. Sem mouse, ela joga sozinha |
| Experiência | Linhas que se destacam no hover, da mais recente para a mais antiga |
| Stack | Colunas por senioridade e nuvem 3D (`ArsenalCloud`): arraste com inércia, clique num ícone para trazê-lo à frente |
| Contato | Formulário que monta o e-mail (sem servidor), status e redes |

Quem ativa "reduzir movimento" no sistema recebe a versão sem animações pesadas. A foto fica em `public/carlos.webp`.

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
