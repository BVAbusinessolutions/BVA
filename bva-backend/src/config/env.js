import 'dotenv/config'

/** Lee una variable obligatoria o detiene el arranque con un mensaje claro. */
function required(name) {
  const value = process.env[name]
  if (!value) throw new Error(`Falta la variable de entorno ${name} (revisa .env.example)`)
  return value
}

const jwtSecret = required('JWT_SECRET')
if (jwtSecret.length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres')

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS ?? 12)
if (!Number.isInteger(bcryptRounds) || bcryptRounds < 4 || bcryptRounds > 15) {
  throw new Error('BCRYPT_ROUNDS debe ser un entero entre 4 y 15')
}

/** Configuración validada una sola vez al arrancar. */
export const config = Object.freeze({
  port: Number(process.env.PORT ?? 4000),
  isProduction: process.env.NODE_ENV === 'production',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  db: Object.freeze({
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'bva_app',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'bva_saas',
  }),
  jwt: Object.freeze({
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
    issuer: process.env.JWT_ISSUER ?? 'bva-api',
    audience: process.env.JWT_AUDIENCE ?? 'bva-web',
  }),
  bcryptRounds,
})
