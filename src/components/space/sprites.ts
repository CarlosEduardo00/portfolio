// Sprites em pixel art (estilo Galaga). '#' = pixel aceso, '+' = pixel de detalhe (cinza).

export const SHIP = [
  '.....#.....',
  '.....#.....',
  '....###....',
  '....#+#....',
  '.+..###..+.',
  '.#.#####.#.',
  '.#########.',
  '###.#+#.###',
  '##..###..##',
  '#...#.#...#',
]

export const ENEMY_A = [
  '..#.....#..',
  '...#...#...',
  '..#######..',
  '.##+###+##.',
  '###########',
  '#.#######.#',
  '#.#.....#.#',
  '...##.##...',
]

// Segundo quadro da animação (asas mexendo)
export const ENEMY_B = [
  '..#.....#..',
  '#..#...#..#',
  '#.#######.#',
  '###+###+###',
  '###########',
  '.#########.',
  '..#.....#..',
  '.#.......#.',
]

export type Sprite = string[]

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: Sprite,
  x: number,
  y: number,
  px: number,
  main = '#ffffff',
  detail = '#7a7a7a',
) {
  const w = sprite[0].length * px
  for (let r = 0; r < sprite.length; r++) {
    for (let c = 0; c < sprite[r].length; c++) {
      const ch = sprite[r][c]
      if (ch === '.') continue
      ctx.fillStyle = ch === '+' ? detail : main
      ctx.fillRect(Math.round(x - w / 2 + c * px), Math.round(y + r * px), px, px)
    }
  }
}
