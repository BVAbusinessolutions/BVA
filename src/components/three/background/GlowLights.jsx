import * as THREE from 'three'
import { getGlowTexture } from '../../../lib/three/glowTexture'

const LIGHTS = [
  { position: [-12, 6, -15], scale: 34, opacity: 0.32 },
  { position: [14, -4, -12], scale: 28, opacity: 0.22 },
]

/** Halos azules lejanos que dan profundidad al fondo. */
export default function GlowLights() {
  return LIGHTS.map((light) => (
    <sprite key={light.position.join()} position={light.position} scale={light.scale}>
      <spriteMaterial
        map={getGlowTexture()}
        transparent
        opacity={light.opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  ))
}
