import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { createApp } from '../src/app.js';
import { readEnv } from '../src/config/env.js';

async function withApi(t, database) {
  const server = createApp({ database }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise((resolve) => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  return (pathname, options) => fetch(`${base}${pathname}`, options);
}

test('liveness no depende de PostgreSQL; readiness informa el fallo sin filtrar detalles', async (t) => {
  let queries = 0;
  const request = await withApi(t, { query: async () => {
    queries += 1;
    throw new Error('secret database internals');
  } });
  const health = await request('/api/health');
  assert.equal(health.status, 200);
  assert.equal((await health.json()).data.status, 'ok');
  assert.equal(queries, 0);

  const ready = await request('/api/ready');
  assert.equal(ready.status, 503);
  const body = await ready.json();
  assert.equal(body.error.code, 'DATABASE_UNAVAILABLE');
  assert.equal(JSON.stringify(body).includes('secret'), false);
  assert.equal(queries, 1);
});

test('readiness consulta PostgreSQL a través del adaptador de base de datos', async (t) => {
  const request = await withApi(t, { query: async (sql) => {
    assert.equal(sql, 'SELECT 1');
    return { rows: [{ '?column?': 1 }] };
  } });
  const response = await request('/api/ready');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).data.database, 'connected');
});

test('login pendiente y rutas privadas no aceptan un token inventado', async (t) => {
  const request = await withApi(t, { query: async () => { throw new Error('No debe consultar DB.'); } });
  const login = await request('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'no-real-password' }),
  });
  assert.equal(login.status, 501);
  assert.equal((await login.json()).error.code, 'AUTH_NOT_IMPLEMENTED');
  for (const route of ['/api/files', '/api/auth/me', '/api/subscriptions/me']) {
    const response = await request(route, { headers: { Authorization: 'Bearer forged-token' } });
    assert.equal(response.status, 501);
    assert.equal((await response.json()).error.code, 'AUTH_NOT_IMPLEMENTED');
  }
});

test('catálogo conserva precisión BIGINT y campos opcionales', async (t) => {
  const request = await withApi(t, { query: async (sql) => {
    assert.match(sql, /WHERE active = TRUE/);
    return { rows: [{
      id: 'a-plan-id', code: 'free', name: 'Free', capacity_bytes: '9007199254740993',
      daily_upload_limit: 10, daily_bytes_limit: null, monthly_price_gtq: '0.00', active: true,
    }] };
  } });
  const response = await request('/api/plans');
  assert.equal(response.status, 200);
  const { data } = await response.json();
  assert.equal(data[0].capacityBytes, '9007199254740993');
  assert.equal(data[0].dailyBytesLimit, null);
  assert.equal(data[0].monthlyPriceGtq, '0.00');
  assert.equal('capacity_bytes' in data[0], false);
});

test('errores de JSON, rutas inexistentes y CORS conservan el formato público', async (t) => {
  const request = await withApi(t, { query: async () => ({ rows: [] }) });
  const invalid = await request('/api/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken',
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).error.code, 'INVALID_JSON');

  const missing = await request('/api/unknown');
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, 'NOT_FOUND');

  const allowed = await request('/api/health', { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  for (const origin of ['http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173']) {
    const pendingLogin = await request('/api/auth/login', {
      method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{}',
    });
    assert.equal(pendingLogin.status, 501);
    assert.equal(pendingLogin.headers.get('access-control-allow-origin'), origin);
  }
  const forbidden = await request('/api/health', { headers: { Origin: 'https://unknown.example' } });
  assert.equal(forbidden.status, 403);
  assert.equal((await forbidden.json()).error.code, 'ORIGIN_NOT_ALLOWED');
});

test('configuración rechaza puertos, esquemas DB y orígenes inválidos', () => {
  assert.equal(readEnv({}).port, 3000);
  assert.equal(readEnv({}).databaseUrl, undefined);
  assert.throws(() => readEnv({ PORT: '3000abc' }), /PORT/);
  assert.throws(() => readEnv({ DATABASE_URL: 'https://example.com/db' }), /DATABASE_URL/);
  assert.throws(() => readEnv({ CORS_ORIGINS: 'http://localhost:5173/some/path' }), /CORS_ORIGINS/);
});
