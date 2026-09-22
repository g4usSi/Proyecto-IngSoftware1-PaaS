import * as service from './storage.service.js';

export async function list(req, res) {
  res.json({ data: await service.listFiles(req.user.id) });
}

export async function upload(req, res) {
  // El parser multipart, los límites y la validación real se añadirán al implementar Storage.
  res.status(201).json({ data: await service.uploadFile(req.user.id, req.body) });
}

export async function download(req, _res) {
  // La implementación deberá transmitir el WebP solo después de validar propiedad.
  await service.downloadFile(req.user.id, req.params.fileId);
}

export async function remove(req, res) {
  res.json({ data: await service.deleteFile(req.user.id, req.params.fileId) });
}
