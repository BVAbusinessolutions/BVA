import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login, me } from '../controllers/authController.js'
import { createUser } from '../controllers/userController.js'
import { getTheme } from '../controllers/tenantController.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { requireRole } from '../middlewares/requireRole.js'

/** Frena ataques de fuerza bruta: 10 intentos de inicio de sesión cada 15 minutos por IP. */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Prueba de nuevo en unos minutos.' },
})

export const router = Router()

router.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Públicas
router.post('/auth/login', loginLimiter, login)
router.get('/tenants/:slug/theme', getTheme)

// Protegidas: de aquí en adelante todo exige un JWT válido.
router.use(verifyToken)
router.get('/auth/me', me)
router.post('/users', requireRole('owner', 'admin'), createUser)
