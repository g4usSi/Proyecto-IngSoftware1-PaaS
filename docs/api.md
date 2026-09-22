# Contratos iniciales de API

Base: `/api`. JSON UTF-8. Éxito: `{ "data": ... }`. Error: `{ "error": { "code": "CODIGO", "message": "Mensaje" } }`. No se devuelven trazas internas ni hashes de contraseña.

## Operaciones disponibles

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/health` | `200`, `{ "data": { "status": "ok", "service": "smartstorage-api" } }` |
| GET | `/ready` | `200` con BD conectada; `503 DATABASE_UNAVAILABLE` si falta configuración o conexión |
| GET | `/plans` | `200`, catálogo activo de PostgreSQL; requiere migraciones. El seed incluye únicamente Free |

Los tamaños BIGINT y precios NUMERIC del catálogo viajan como strings decimales para no perder precisión. Los contadores diarios limitados son enteros o `null`.

## Rutas reservadas (501 en esta entrega)

| Método | Ruta | Contrato previsto |
| --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password }`; futura respuesta `201` con usuario seguro. Alta y asignación Free transaccionales |
| POST | `/auth/login` | `{ email, password }`; futura respuesta `{ data: { user, accessToken, expiresIn } }` |
| POST | `/auth/logout` | Sesión autenticada; revocar sesión y limpiar estado del cliente |
| GET | `/auth/me` | Sesión autenticada; `{ data: { user: { id, name, email, role, emailVerified } } }` |
| POST | `/auth/verify-email` | `{ token }`; consumir token de un solo uso |
| POST | `/auth/forgot-password` | `{ email }`; respuesta neutral sin revelar si existe la cuenta |
| POST | `/auth/reset-password` | `{ token, password }`; token de un solo uso |
| GET | `/files` | Listado paginado de imágenes del propietario autenticado |
| POST | `/files` | `multipart/form-data`, campo `file`, `folderId` opcional; JPG/PNG/WebP, máximo 25 MB |
| GET | `/files/:fileId/download` | Descarga autorizada de la versión WebP, nunca del original |
| DELETE | `/files/:fileId` | Elimina el enlace lógico; solo se borra el WebP cuando no quedan referencias |
| GET | `/subscriptions/me` | Suscripción y plan de la cuenta autenticada |

Estas rutas y los formatos futuros son contratos de integración, no funciones ya desarrolladas. `requireAuth` devuelve `501 AUTH_NOT_IMPLEMENTED` mientras no exista una verificación real; nunca confía en un ID enviado por el cliente o en un JWT simplemente decodificado.

## Contrato de identidad para Andy

El cliente enviará `Authorization: Bearer <accessToken>`. El middleware verificará firma, expiración, estado de usuario y política de revocación. Solo entonces asignará:

```js
req.user = { id: 'UUID', email: 'cliente@example.test', role: 'client' };
```

Los controladores de Storage y Suscripciones tomarán el propietario de `req.user.id`; no de parámetros `userId` controlados por quien hace la petición. Roles válidos: `client`, `admin`. El registro público siempre crea `client` aunque el cuerpo incluya `role`.

Errores futuros: `400` validación, `401` sesión inválida, `403` permiso insuficiente, `404` recurso inexistente/no accesible, `409` conflicto, `413` tamaño excedido, `415` formato inválido y `429` límite de intentos. Cada implementación debe precisar su código de negocio sin alterar el sobre común.

## Persistencia para la primera implementación

- `users`: UUID, correo normalizado único, nombre, hash de contraseña, rol, estado y verificación.
- `plans`/`subscriptions`: Free como seed; asignación al registrar pendiente.
- `folders`/`images`: propiedad por usuario y vínculo con objeto global.
- `stored_objects`: hash del original, tamaño original, estado y ruta relativa WebP.

Verificación de correo, sesiones revocables, pagos y cuotas diarias necesitan migraciones adicionales. Ninguna tabla o flag del esquema inicial reemplaza esa lógica. Las rutas administrativas y su cálculo de ahorro se añadirán al implementar el módulo.
