import bcrypt from 'bcrypt'
import { pool } from '../config/db.js'
import { config } from '../config/env.js'

/** bcrypt solo usa los primeros 72 bytes: una clave más larga se truncaría sin avisar. */
export const PASSWORD_MIN_LENGTH = 8
export const PASSWORD_MAX_BYTES = 72

export const ROLES = Object.freeze(['owner', 'admin', 'agent', 'viewer'])

/** Columnas públicas: password_hash nunca sale del modelo. */
const PUBLIC_COLUMNS = 'id, tenant_id, email, full_name, role, status, last_login_at, created_at'

const toPublic = (row) =>
  row
    ? {
        id: row.id,
        tenantId: row.tenant_id,
        email: row.email,
        fullName: row.full_name,
        role: row.role,
        status: row.status,
        lastLoginAt: row.last_login_at ?? null,
        createdAt: row.created_at,
      }
    : null

/** Dato de entrada no válido (el controlador lo convierte en 400). */
export class ValidationError extends Error {}

const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase()

/**
 * Modelo de usuarios. Recibe la conexión para poder probarlo sin MySQL.
 * Reglas que cumple cada consulta:
 *   1. Parametrizada con `?` (sentencia preparada de mysql2): nunca se concatenan valores.
 *   2. Filtrada por tenant_id: un usuario de una pyme nunca ve los de otra.
 * @param {{ execute: Function }} db pool de mysql2/promise o un doble de prueba
 * @param {{ rounds: number }} options costo de bcrypt
 */
export function createUserModel(db, { rounds }) {
  // Hash de relleno: si el correo no existe se compara igual contra él. Así la respuesta
  // tarda lo mismo y no revela qué correos están registrados.
  const dummyHash = bcrypt.hashSync('bva-dummy-password', rounds)

  function assertPasswordPolicy(password) {
    if (typeof password !== 'string' || password.length < PASSWORD_MIN_LENGTH) {
      throw new ValidationError(
        `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`,
      )
    }
    if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
      throw new ValidationError(`La contraseña no puede pasar de ${PASSWORD_MAX_BYTES} bytes`)
    }
  }

  /** Hash bcrypt: incluye una sal aleatoria y el costo dentro del propio texto. */
  async function hashPassword(password) {
    assertPasswordPolicy(password)
    return bcrypt.hash(password, rounds)
  }

  async function findById(tenantId, id) {
    const [rows] = await db.execute(
      `SELECT ${PUBLIC_COLUMNS} FROM users WHERE tenant_id = ? AND id = ? LIMIT 1`,
      [tenantId, id],
    )
    return toPublic(rows[0])
  }

  async function create({ tenantId, email, password, fullName, role = 'agent' }) {
    if (!ROLES.includes(role)) throw new ValidationError('Rol no válido')
    const passwordHash = await hashPassword(password)
    const [result] = await db.execute(
      `INSERT INTO users (tenant_id, email, password_hash, full_name, role, status)
       VALUES (?, ?, ?, ?, ?, 'active')`,
      [tenantId, normalizeEmail(email), passwordHash, String(fullName ?? '').trim(), role],
    )
    return findById(tenantId, result.insertId)
  }

  /**
   * Valida correo y contraseña dentro de un tenant. Devuelve el usuario público o null.
   * Nunca dice si falló el correo o la contraseña.
   */
  async function verifyCredentials(tenantId, email, password) {
    if (typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
      return null
    }
    const [rows] = await db.execute(
      `SELECT ${PUBLIC_COLUMNS}, password_hash FROM users
       WHERE tenant_id = ? AND email = ? LIMIT 1`,
      [tenantId, normalizeEmail(email)],
    )
    const row = rows[0]
    const matches = await bcrypt.compare(password, row?.password_hash ?? dummyHash)
    if (!row || !matches || row.status !== 'active') return null

    // Si se sube BCRYPT_ROUNDS, el hash viejo se renueva en el siguiente inicio de sesión.
    if (bcrypt.getRounds(row.password_hash) < rounds) {
      const fresh = await bcrypt.hash(password, rounds)
      await db.execute(
        'UPDATE users SET password_hash = ?, last_login_at = UTC_TIMESTAMP(3) WHERE tenant_id = ? AND id = ?',
        [fresh, tenantId, row.id],
      )
    } else {
      await db.execute(
        'UPDATE users SET last_login_at = UTC_TIMESTAMP(3) WHERE tenant_id = ? AND id = ?',
        [tenantId, row.id],
      )
    }
    return toPublic(row)
  }

  return Object.freeze({ hashPassword, findById, create, verifyCredentials })
}

/** Modelo listo para usar con el pool y la configuración del entorno. */
export const User = createUserModel(pool, { rounds: config.bcryptRounds })
export default User
