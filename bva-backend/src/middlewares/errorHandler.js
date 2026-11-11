import { HttpError } from '../utils/httpError.js'

/** 404 para rutas que no existen. */
export const notFound = (_req, _res, next) => next(new HttpError(404, 'Recurso no encontrado'))

/**
 * Último middleware: responde JSON y nunca filtra detalles internos (SQL, rutas, stack).
 * Los errores inesperados se registran en el servidor y el cliente solo ve un mensaje genérico.
 * Express reconoce un manejador de errores porque recibe 4 argumentos.
 */
export function errorHandler(error, _req, res, _next) {
  if (error instanceof HttpError) {
    if (error.headers) res.set(error.headers)
    return res.status(error.status).json({ error: error.message })
  }
  if (error?.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido' })
  }
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'La petición es demasiado grande' })
  }
  console.error(error)
  return res.status(500).json({ error: 'Error interno del servidor' })
}
