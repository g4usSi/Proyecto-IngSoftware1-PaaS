import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = fileURLToPath(new URL('../../', import.meta.url));
dotenv.config({ path: path.join(backendRoot, '.env'), quiet: true });

export function readEnv(source = process.env) {
  const nodeEnv = source.NODE_ENV || 'development';
  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    throw new Error('NODE_ENV debe ser development, test o production.');
  }

  const rawPort = source.PORT || '3000';
  const port = Number(rawPort);
  if (!/^\d+$/.test(rawPort) || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT debe ser un entero entre 1 y 65535.');
  }

  const corsOrigins = (source.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => {
      let url;
      try {
        url = new URL(value);
      } catch {
        throw new Error('CORS_ORIGINS debe contener orígenes HTTP(S) separados por comas.');
      }
      if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
          url.pathname !== '/' || url.search || url.hash) {
        throw new Error('CORS_ORIGINS solo admite orígenes HTTP(S), sin rutas ni credenciales.');
      }
      return url.origin;
    });
  if (corsOrigins.length === 0) {
    throw new Error('CORS_ORIGINS debe contener al menos un origen.');
  }

  const databaseUrl = source.DATABASE_URL?.trim() || undefined;
  if (databaseUrl) {
    let url;
    try {
      url = new URL(databaseUrl);
    } catch {
      throw new Error('DATABASE_URL debe ser una URL válida de PostgreSQL.');
    }
    if (!['postgres:', 'postgresql:'].includes(url.protocol) || !url.hostname || url.pathname.length < 2) {
      throw new Error('DATABASE_URL debe indicar un servidor y una base de datos PostgreSQL.');
    }
  }

  const jwtSecret = source.JWT_SECRET?.trim() || undefined;
  if (jwtSecret && jwtSecret.length < 32) {
    throw new Error('JWT_SECRET debe tener al menos 32 caracteres.');
  }
  if (nodeEnv === 'production' && !jwtSecret) {
    throw new Error('JWT_SECRET es obligatorio en producción.');
  }
  const jwtExpiresIn = source.JWT_EXPIRES_IN?.trim() || '1h';
  if (!/^[1-9]\d*[smhd]$/.test(jwtExpiresIn)) {
    throw new Error('JWT_EXPIRES_IN debe ser un número seguido de s, m, h o d (por ejemplo 1h).');
  }

  return Object.freeze({
    nodeEnv,
    host: source.HOST || '127.0.0.1',
    port,
    corsOrigins,
    databaseUrl,
    jwtSecret,
    jwtExpiresIn,
    storageRoot: path.resolve(backendRoot, source.STORAGE_ROOT || './data/objects'),
  });
}

export const env = readEnv();
