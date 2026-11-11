import { config } from '../config/env.js'
import { Tenant } from '../models/Tenant.js'
import { User } from '../models/User.js'
import { HttpError } from '../utils/httpError.js'
import { signAccessToken } from '../utils/jwt.js'

const isText = (value, max) => typeof value === 'string' && value.length > 0 && value.length <= max

/**
 * POST /api/auth/login  { tenantSlug, email, password }
 * Responde { token, user }. Cualquier fallo devuelve el mismo mensaje para no revelar
 * si existe el negocio, el correo o si la contraseña era la equivocada.
 */
export async function login(req, res) {
  const { tenantSlug, email, password } = req.body ?? {}
  if (!isText(tenantSlug, 63) || !isText(email, 254) || !isText(password, 200)) {
    throw new HttpError(400, 'Indica el negocio, el correo y la contraseña')
  }

  const tenant = await Tenant.findActiveBySlug(tenantSlug)
  // Sin tenant igual se ejecuta bcrypt (tenantId 0 no existe) para que el tiempo sea parejo.
  const user = await User.verifyCredentials(tenant?.id ?? 0, email, password)
  if (!tenant || !user) throw new HttpError(401, 'Correo o contraseña incorrectos')

  const token = signAccessToken(user, config.jwt)
  res.json({ token, tokenType: 'Bearer', expiresIn: config.jwt.expiresIn, user })
}

/** GET /api/auth/me — datos del usuario dueño del token. */
export async function me(req, res) {
  const user = await User.findById(req.user.tenantId, req.user.id)
  if (!user) throw new HttpError(404, 'Usuario no encontrado')
  res.json({ user })
}
