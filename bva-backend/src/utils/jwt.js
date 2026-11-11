import jwt from 'jsonwebtoken'

/** Único algoritmo aceptado. Fijarlo evita el ataque de "alg: none" o el cambio a otro algoritmo. */
export const JWT_ALGORITHM = 'HS256'

/**
 * Firma el token de acceso. Lleva solo lo necesario para autorizar, nunca datos sensibles:
 * sub = id del usuario, tid = id del tenant, role = rol dentro de ese tenant.
 */
export function signAccessToken(user, { secret, expiresIn, issuer, audience }) {
  return jwt.sign({ tid: String(user.tenantId), role: user.role }, secret, {
    algorithm: JWT_ALGORITHM,
    subject: String(user.id),
    expiresIn,
    issuer,
    audience,
  })
}
