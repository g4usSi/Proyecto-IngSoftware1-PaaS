import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { database } from '../src/config/database.js';

const migrationsDirectory = fileURLToPath(new URL('../migrations/', import.meta.url));
let client;
let locked = false;

try {
  // Una conexión dedicada mantiene el bloqueo entre migraciones.
  client = await database.connect();
  await client.query("SELECT pg_advisory_lock(hashtext('smartstorage:migrations'))");
  locked = true;
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const files = (await readdir(migrationsDirectory))
    .filter((file) => /^\d+[-_].*\.sql$/.test(file))
    .sort();

  for (const name of files) {
    // El mismo archivo debe conservar checksum al pasar entre Windows y Linux.
    const sql = (await readFile(path.join(migrationsDirectory, name), 'utf8')).replace(/\r\n/g, '\n');
    const checksum = createHash('sha256').update(sql).digest('hex');
    const existing = await client.query('SELECT checksum FROM schema_migrations WHERE name = $1', [name]);
    if (existing.rows.length > 0) {
      if (existing.rows[0].checksum !== checksum) {
        throw new Error(`La migración aplicada ${name} cambió. Crea una nueva migración; no edites una aplicada.`);
      }
      console.log(`Ya aplicada: ${name}`);
      continue;
    }

    await client.query('BEGIN');
    try {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name, checksum) VALUES ($1, $2)', [name, checksum]);
      await client.query('COMMIT');
      console.log(`Aplicada: ${name}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
  console.log('Migraciones completadas.');
} catch (error) {
  console.error('No se pudieron completar las migraciones:', error.message);
  process.exitCode = 1;
} finally {
  try {
    if (client) {
      try {
        if (locked) await client.query("SELECT pg_advisory_unlock(hashtext('smartstorage:migrations'))");
      } finally {
        client.release();
      }
    }
  } finally {
    await database.close();
  }
}
