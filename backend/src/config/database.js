import pg from 'pg';
import { env } from './env.js';

export function createDatabase(connectionString) {
  const pool = connectionString ? new pg.Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30000,
  }) : null;

  // Evita una excepción no controlada si PostgreSQL cierra una conexión inactiva.
  pool?.on('error', () => {
    console.error('PostgreSQL cerró una conexión inactiva del pool.');
  });

  function requirePool() {
    if (!pool) throw new Error('Configura DATABASE_URL en backend/.env.');
    return pool;
  }

  return {
    query: (...args) => requirePool().query(...args),
    connect: () => requirePool().connect(),
    close: () => pool ? pool.end() : Promise.resolve(),
  };
}

export const database = createDatabase(env.databaseUrl);
