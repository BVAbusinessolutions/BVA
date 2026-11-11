import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'
import { JWT_ALGORITHM } from '../utils/jwt.js'

/** "Bearer <header>.<payload>.<firma>" en formato base64url. */
const BEARER = /^Bearer ([\w-]+\.[\w-]+\.[\w-]+)$/

const unauthorized = (message, code = 'invalid_token') =>
  new HttpError(401, message, {
    headers: { 'WWW-Authenticate': `Bearer error="${code}"` },
  })

/**
 * Crea el middleware que exige un JWT válido en `Authorization: Bearer <token>`.
 * Si es válido deja en `req.user` = { id, tenantId, role }. Todas las consultas de la
 * petición deben filtrar por `req.user.tenantId`, nunca por un tenant que mande el cliente.
 * @param {{ secret: string, issuer: string, audience: string }} options
 */
export function createVerifyToken({ secret, issuer, audience }) {
  return function verifyToken(req, _res, next) {
    const header = req.get('authorization') ?? ''
    const match = header.match(BEARER)
    if (!match) return next(unauthorized('Falta el token de acceso', 'invalid_request'))

    try {
      const payload = jwt.verify(match[1], secret, {
        algorithms: [JWT_ALGORITHM],
        issuer,
        audience,
      })
      if (!payload.sub || !payload.tid || !payload.role) {
        return next(unauthorized('Token inválido'))
      }
      req.user = { id: payload.sub, tenantId: payload.tid, role: payload.role }
      return next()
    } catch (error) {
      const expired = error instanceof jwt.TokenExpiredError
      return next(unauthorized(expired ? 'El token expiró' : 'Token inválido'))
    }
  }
}

/** Middleware listo para usar con la configuración del entorno. */
export const verifyToken = createVerifyToken(config.jwt)
export default verifyToken
