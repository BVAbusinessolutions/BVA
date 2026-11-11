import mysql from 'mysql2/promise'
import { config } from './env.js'

/**
 * Pool de conexiones compartido. Cada consulta toma una conexión libre y la devuelve sola.
 * Usa siempre `pool.execute(sql, params)` con `?`: mysql2 envía los valores aparte del SQL
 * (sentencia preparada), así que un valor nunca puede alterar la consulta (inyección SQL).
 */
export const pool = mysql.createPool({
  ...config.db,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60_000,
  queueLimit: 0,
  timezone: 'Z',
  charset: 'utf8mb4',
  supportBigNumbers: true,
  bigNumberStrings: true,
  multipleStatements: false,
})

/** Comprueba la conexión al arrancar para fallar pronto si MySQL no responde. */
export async function pingDatabase() {
  const connection = await pool.getConnection()
  try {
    await connection.ping()
  } finally {
    connection.release()
  }
}
