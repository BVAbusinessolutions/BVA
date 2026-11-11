/**
 * Guion de la demo: qué pasa en cada cuadro. Cada paso hereda lo del anterior;
 * `click` y `toast` duran solo su cuadro.
 *   cursor: posición en % de la ventana · card: columna de la tarjeta en vivo (null = no está)
 *   stats: clientes, conversaciones, ventas (₡) · bars: alto de cada barra (0..1) · menu: ítem activo
 */
const STEPS = [
  {
    duration: 1500,
    cursor: [70, 55],
    card: null,
    done: false,
    stats: [24, 8, 1240000],
    bars: [0.35, 0.5, 0.42, 0.6, 0.38, 0.3, 0.2],
    menu: 0,
  },
  { duration: 1100, cursor: [91, 8], click: true },
  { duration: 1900, card: 0, toast: 0, stats: [25, 8, 1240000], menu: 1 },
  { duration: 1900, cursor: [48, 52], card: 1, toast: 1, stats: [25, 9, 1240000], menu: 2 },
  { duration: 1700, cursor: [84, 72], bars: [0.45, 0.62, 0.5, 0.72, 0.48, 0.6, 0.35], menu: 4 },
  {
    duration: 2100,
    cursor: [66, 52],
    card: 2,
    done: true,
    toast: 2,
    stats: [25, 9, 1285000],
    bars: [0.45, 0.62, 0.5, 0.72, 0.48, 0.6, 0.78],
    menu: 2,
  },
  { duration: 2300, cursor: [18, 60], toast: 3, menu: 3 },
]

export const FRAMES = Object.freeze(
  STEPS.reduce((frames, step) => {
    const previous = frames.at(-1) ?? {}
    return [
      ...frames,
      { ...previous, ...step, click: step.click ?? false, toast: step.toast ?? null },
    ]
  }, []),
)

/** Cuadro que se muestra quieto con "reducir movimiento": la venta ya cerrada. */
export const STATIC_FRAME = 5
