/** Error con código HTTP. El mensaje se muestra al cliente, así que no debe tener detalles internos. */
export class HttpError extends Error {
  constructor(status, message, { headers } = {}) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.headers = headers
  }
}
