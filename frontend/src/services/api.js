const API_BASE = '/api';

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

/** Shared JSON client. Returns the content of { data }; never persists tokens. */
export async function apiRequest(path, { body, token, headers, ...options } = {}) {
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Accept', 'application/json');

  if (body !== undefined) requestHeaders.set('Content-Type', 'application/json');
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: requestHeaders,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204) return undefined;

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('El servicio devolvió una respuesta inesperada.', 'INVALID_RESPONSE', response.status);
  }

  if (!response.ok) {
    throw new ApiError(
      payload?.error?.message ?? 'No se pudo completar la solicitud.',
      payload?.error?.code ?? 'REQUEST_FAILED',
      response.status,
    );
  }

  if (!payload || !Object.hasOwn(payload, 'data')) {
    throw new ApiError('El servicio devolvió una respuesta inesperada.', 'INVALID_RESPONSE', response.status);
  }

  return payload.data;
}
