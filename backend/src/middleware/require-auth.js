import { AppError } from '../lib/app-error.js';

// Andy reemplazará este bloqueo por verificación JWT y carga de identidad.
// Nunca confiar en IDs del body ni aceptar un token sin verificar su firma.
export function requireAuth(_req, _res, next) {
  next(new AppError(501, 'AUTH_NOT_IMPLEMENTED', 'La autenticación todavía no está implementada.'));
}
