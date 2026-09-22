import { notImplemented } from '../../lib/app-error.js';

// Contrato: SHA-256 sobre los bytes recibidos → deduplicación GLOBAL.
// Conservar únicamente el WebP final; original_size_bytes es metadato.
// Derivar tamaño físico con stat y ahorro a partir de objetos físicos únicos.
// La autorización siempre corresponde a la referencia del usuario, nunca al hash.
export async function listFiles(_ownerId) { return pending(); }
export async function uploadFile(_ownerId, _input) { return pending(); }
export async function downloadFile(_ownerId, _fileId) { return pending(); }
export async function deleteFile(_ownerId, _fileId) { return pending(); }

function pending() {
  return notImplemented('STORAGE_NOT_IMPLEMENTED', 'El módulo de almacenamiento está pendiente de implementación.');
}
