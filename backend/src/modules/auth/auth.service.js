import { notImplemented } from '../../lib/app-error.js';

// Punto de entrada para validación, hash de contraseña y emisión/verificación JWT.
// No almacenar contraseñas en texto plano ni devolver password_hash en respuestas.
export async function register(_input) {
  return pending();
}

export async function login(_input) {
  return pending();
}

export async function logout(_identity) {
  return pending();
}

export async function getCurrentUser(_identity) {
  return pending();
}

export async function verifyEmail(_input) {
  return pending();
}

export async function forgotPassword(_input) {
  return pending();
}

export async function resetPassword(_input) {
  return pending();
}

function pending() {
  return notImplemented('AUTH_NOT_IMPLEMENTED', 'El módulo de autenticación está pendiente de implementación.');
}
