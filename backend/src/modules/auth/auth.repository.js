import { notImplemented } from '../../lib/app-error.js';

// Implementar consultas parametrizadas contra users después de acordar el flujo.
export async function findUserByEmail(_email) {
  return notImplemented('AUTH_NOT_IMPLEMENTED', 'El repositorio de usuarios está pendiente.');
}

export async function createUser(_user, _transaction) {
  return notImplemented('AUTH_NOT_IMPLEMENTED', 'El repositorio de usuarios está pendiente.');
}
