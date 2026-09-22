import { notImplemented } from '../../lib/app-error.js';

// Objetos compartidos por hash; referencias privadas por usuario.
// Toda consulta de archivos debe incluir el propietario autenticado.
export async function findObjectByOriginalHash(_originalSha256, _transaction) {
  return notImplemented('STORAGE_NOT_IMPLEMENTED', 'El repositorio de almacenamiento está pendiente.');
}

export async function listFilesByOwner(_ownerId) {
  return notImplemented('STORAGE_NOT_IMPLEMENTED', 'El repositorio de almacenamiento está pendiente.');
}
