import { SHIP } from './sprites'

// Nave em pixel art como SVG (para ícones e detalhes de interface)
export function PixelShip({ className = 'size-5', title }: { className?: string; title?: string }) {
  const rects = SHIP.flatMap((row, r) =>
    [...row].map((ch, c) =>
      ch === '.' ? null : <rect key={`${r}-${c}`} x={c} y={r} width={1.02} height={1.02} fill={ch === '+' ? '#7a7a7a' : 'currentColor'} />,
    ),
  )
  return (
    <svg viewBox={`0 0 ${SHIP[0].length} ${SHIP.length}`} className={className} shapeRendering="crispEdges" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {rects}
    </svg>
  )
}
