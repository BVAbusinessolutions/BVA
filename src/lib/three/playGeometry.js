import * as THREE from 'three'

/**
 * Geometrías del logo de BVA para escenas 3D.
 * Coordenadas tomadas del isotipo SVG (viewBox 64×64, y hacia abajo).
 */
export const LOGO_SCALE = 0.07
export const UPPER_PLAY = [
  [21, 10],
  [44, 21],
  [21, 32],
]
export const LOWER_PLAY = [
  [21, 32],
  [49, 43],
  [21, 54],
]

const toScene = ([x, y], scale) => [(x - 30) * scale, -(y - 32) * scale]

/** Prisma triangular con bordes suavizados, centrado en z = 0. */
export function createPlayGeometry(points, { scale = LOGO_SCALE, depth = 0.55 } = {}) {
  const shape = new THREE.Shape()
  const [x0, y0] = toScene(points[0], scale)
  shape.moveTo(x0, y0)
  points.slice(1).forEach((point) => {
    const [x, y] = toScene(point, scale)
    shape.lineTo(x, y)
  })
  shape.closePath()

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.11,
    bevelSize: scale * 0.75,
    bevelSegments: 4,
    curveSegments: 8,
  })
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

/** Triángulo de play simple y centrado, para partículas. */
export function createSmallPlayGeometry(size = 0.35, depth = 0.12) {
  const shape = new THREE.Shape()
  shape.moveTo(-size * 0.45, size * 0.5)
  shape.lineTo(size * 0.55, 0)
  shape.lineTo(-size * 0.45, -size * 0.5)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.25,
    bevelSize: size * 0.06,
    bevelSegments: 2,
  })
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

/** Generador pseudoaleatorio con semilla, para que la escena se vea igual en cada carga. */
export function seededRandom(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
