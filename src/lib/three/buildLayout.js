import { seededRandom } from './playGeometry'

/** Medidas de la ventana del navegador del modelo 3D. */
export const FRAME = Object.freeze({ width: 4.3, height: 3, depth: 0.12, barHeight: 0.28 })

const FRONT_Z = FRAME.depth / 2 + 0.02
const BLOCK_DEPTH = 0.06

/**
 * Bloques de la página que se arma: posición final (x, y) dentro de la ventana, tamaño, color
 * y orden de llegada. `cta` marca el botón que late al lanzar.
 */
const RAW_BLOCKS = [
  { id: 'nav', x: 0, y: 0.92, w: 3.9, h: 0.16, color: '#27272a', order: 0 },
  { id: 'logo', x: -1.72, y: 0.92, w: 0.24, h: 0.16, color: '#2F5BFF', order: 0.4, lift: 0.03 },
  { id: 'title1', x: -0.82, y: 0.55, w: 1.95, h: 0.2, color: '#F4F4F5', order: 1 },
  { id: 'title2', x: -1.05, y: 0.28, w: 1.5, h: 0.2, color: '#F4F4F5', order: 1.4 },
  { id: 'lead', x: -0.92, y: 0.04, w: 1.75, h: 0.08, color: '#71717a', order: 1.8 },
  { id: 'cta', x: -1.35, y: -0.24, w: 0.9, h: 0.22, color: '#2F5BFF', order: 2.2, cta: true },
  { id: 'media', x: 1.05, y: 0.32, w: 1.6, h: 0.95, color: '#1e44e0', order: 2.6 },
  { id: 'card1', x: -1.3, y: -0.86, w: 1.15, h: 0.55, color: '#18181b', order: 3 },
  { id: 'card2', x: 0, y: -0.86, w: 1.15, h: 0.55, color: '#18181b', order: 3.4 },
  { id: 'card3', x: 1.3, y: -0.86, w: 1.15, h: 0.55, color: '#18181b', order: 3.8 },
]

const random = seededRandom(42)

/** Cada bloque sale de una posición dispersa (siempre la misma) y llega a su lugar. */
export const BLOCKS = Object.freeze(
  RAW_BLOCKS.map((block) => {
    const z = FRONT_Z + BLOCK_DEPTH / 2 + (block.lift ?? 0)
    return {
      ...block,
      depth: BLOCK_DEPTH,
      to: [block.x, block.y, z],
      from: [
        block.x + (random() - 0.5) * 5,
        block.y + (random() - 0.5) * 3.5,
        z + 1.2 + random() * 2.2,
      ],
      fromRotation: [(random() - 0.5) * 2.4, (random() - 0.5) * 2.4, (random() - 0.5) * 1.6],
    }
  }),
)

/** Tramos del avance (0 a 3) en que ocurre cada fase del modelo. */
export const PHASES = Object.freeze({
  chatOut: [0.35, 0.95],
  frameSolid: [0.35, 1.2],
  blueprintIn: [0.45, 1.05],
  blueprintOut: [2.2, 2.8],
  buildStart: 1.35,
  buildLength: 0.55,
  buildGap: 0.09,
  launch: [2.3, 3],
})
