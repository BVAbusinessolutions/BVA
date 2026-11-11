/** Cliente HTTP base: todas las llamadas de red del sitio pasan por aquí. */
export class HttpError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/**
 * Envía JSON por POST con tiempo límite.
 * @param {string} url
 * @param {unknown} body
 * @param {{ timeoutMs?: number }} [options]
 */
export async function postJson(url, body, { timeoutMs = 10000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!response.ok) throw new HttpError(`Error HTTP ${response.status}`, response.status)
    const text = await response.text()
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  } finally {
    clearTimeout(timer)
  }
}
