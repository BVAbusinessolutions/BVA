import * as THREE from 'three'

let cached = null

/** Textura de brillo radial azul (128 px), compartida por todas las escenas. */
export function getGlowTexture() {
  if (cached) return cached
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
  gradient.addColorStop(0, 'rgba(122, 149, 255, 1)')
  gradient.addColorStop(0.35, 'rgba(47, 91, 255, 0.55)')
  gradient.addColorStop(1, 'rgba(47, 91, 255, 0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  cached = new THREE.CanvasTexture(canvas)
  return cached
}
