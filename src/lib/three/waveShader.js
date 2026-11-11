/**
 * Shader del fondo: una malla de puntos que ondula como un paisaje de datos.
 * La animación corre en la GPU; el procesador solo actualiza dos números por fotograma.
 */
export const WAVE_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vHeight;
  varying float vDepth;

  void main() {
    vec3 p = position;
    float t = uTime * 0.35 + uScroll * 6.0;
    float h = sin(p.x * 0.28 + t) * 0.55
            + cos(p.y * 0.35 + t * 0.8) * 0.45
            + sin((p.x + p.y) * 0.15 - t * 0.6) * 0.6;
    p.z += h;
    vHeight = h;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    gl_PointSize = uSize * uPixelRatio * (9.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

export const WAVE_FRAGMENT = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vHeight;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorA, uColorB, smoothstep(-0.8, 1.3, vHeight));
    float fog = smoothstep(30.0, 6.0, vDepth);
    gl_FragColor = vec4(color, soft * fog * uOpacity);
  }
`
