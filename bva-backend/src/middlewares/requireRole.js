import { HttpError } from '../utils/httpError.js'

/**
 * Permite el paso solo a los roles indicados. Va siempre después de verifyToken.
 * @param {...string} roles p. ej. requireRole('owner', 'admin')
 */
export const requireRole =
  (...roles) =>
  (req, _res, next) =>
    roles.includes(req.user?.role)
      ? next()
      : next(new HttpError(403, 'No tienes permiso para esta acción'))
