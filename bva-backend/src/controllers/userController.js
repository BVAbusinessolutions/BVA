import { User, ValidationError } from '../models/User.js'
import { HttpError } from '../utils/httpError.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * POST /api/users  { email, password, fullName, role }
 * Solo owner o admin. El usuario se crea en el tenant del token, nunca en uno enviado
 * en el cuerpo: así nadie puede crear cuentas en el negocio de otro.
 * La contraseña se guarda solo como hash bcrypt.
 */
export async function createUser(req, res) {
  const { email, password, fullName, role } = req.body ?? {}
  if (typeof email !== 'string' || !EMAIL.test(email) || email.length > 254) {
    throw new HttpError(400, 'Correo no válido')
  }
  if (typeof fullName !== 'string' || !fullName.trim() || fullName.length > 120) {
    throw new HttpError(400, 'Indica el nombre completo')
  }
  // Un admin no puede crear owners: solo un owner da ese rol.
  if (role === 'owner' && req.user.role !== 'owner') {
    throw new HttpError(403, 'Solo el dueño puede crear otro dueño')
  }

  try {
    const user = await User.create({
      tenantId: req.user.tenantId,
      email,
      password,
      fullName,
      role,
    })
    res.status(201).json({ user })
  } catch (error) {
    if (error instanceof ValidationError) throw new HttpError(400, error.message)
    if (error?.code === 'ER_DUP_ENTRY') throw new HttpError(409, 'Ese correo ya está registrado')
    throw error
  }
}
