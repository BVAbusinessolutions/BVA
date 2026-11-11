import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { config } from './config/env.js'
import { router } from './routes/index.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'

/** Aplicación Express sin arrancar el servidor (así se puede probar). */
export function createApp() {
  const app = express()
  app.disable('x-powered-by')
  // Detrás de un proxy (Nginx, Railway, Render) para que el límite de intentos vea la IP real.
  if (config.isProduction) app.set('trust proxy', 1)

  app.use(helmet())
  app.use(cors({ origin: config.corsOrigin, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }))
  app.use(express.json({ limit: '100kb' }))

  app.use('/api', router)
  app.use(notFound)
  app.use(errorHandler)
  return app
}
