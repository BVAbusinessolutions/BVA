import { config } from './config/env.js'
import { pingDatabase, pool } from './config/db.js'
import { createApp } from './app.js'

/** Arranque: verifica MySQL, levanta la API y cierra limpio al recibir SIGTERM/SIGINT. */
async function start() {
  await pingDatabase()
  const server = createApp().listen(config.port, () => {
    console.log(`API de BVA escuchando en http://localhost:${config.port}/api`)
  })

  const shutdown = () => {
    server.close(async () => {
      await pool.end()
      process.exit(0)
    })
  }
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

start().catch((error) => {
  console.error('No se pudo arrancar la API:', error.message)
  process.exit(1)
})
