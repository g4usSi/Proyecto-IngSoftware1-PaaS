import { AppError, notImplemented } from '../../lib/app-error.js';
import { hashPassword } from './password.js';
import { validateRegistration } from './auth.validation.js';

const UNIQUE_VIOLATION = '23505';

export function createAuthService(repository) {
  return {
    // RF01, RF11, RNF01: valida, hashea la contraseña y crea la cuenta (activa por defecto, RF10).
    async register(input) {
      const { name, email, password } = validateRegistration(input);

      if (await repository.findUserByEmail(email)) throw emailTaken();

      const passwordHash = await hashPassword(password);
      let user;
      try {
        user = await repository.createUser({ name, email, passwordHash });
      } catch (error) {
        // Dos registros simultáneos pueden pasar la consulta anterior; la restricción UNIQUE los frena.
        if (error?.code === UNIQUE_VIOLATION) throw emailTaken();
        throw error;
      }
      return toPublicUser(user);
    },

    // Pendientes de bloques posteriores: siguen devolviendo 501.
    async login(_input) {
      return pending();
    },
    async logout(_identity) {
      return pending();
    },
    async getCurrentUser(_identity) {
      return pending();
    },
    async verifyEmail(_input) {
      return pending();
    },
    async forgotPassword(_input) {
      return pending();
    },
    async resetPassword(_input) {
      return pending();
    },
  };
}

// Nunca incluye password_hash.
function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    emailVerified: user.email_verified,
    createdAt: user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at,
  };
}

function emailTaken() {
  return new AppError(409, 'EMAIL_ALREADY_REGISTERED', 'El correo electrónico ya está registrado.');
}

function pending() {
  return notImplemented('AUTH_NOT_IMPLEMENTED', 'El módulo de autenticación está pendiente de implementación.');
}
