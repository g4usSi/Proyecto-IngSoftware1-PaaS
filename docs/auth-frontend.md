# Autenticación: guía de integración para el frontend

Qué necesita el frontend para usar lo que ya está implementado del módulo de usuarios y autenticación. Se actualiza al terminar cada bloque.

Convenciones generales (ya cubiertas por `apiRequest()` de `services/api.js`):

- Éxito: `{ "data": ... }`. Fallo: `{ "error": { "code": "...", "message": "..." } }`.
- `message` está en español y se puede mostrar tal cual al usuario. Usa `code` para la lógica.
- Las peticiones con cuerpo llevan `Content-Type: application/json`.
- La API en JSON usa camelCase.

## Estado por endpoint

| Endpoint | Estado |
| --- | --- |
| `POST /api/auth/register` | Implementado (Bloque 1) |
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | Pendiente (Bloque 2), responden `501 AUTH_NOT_IMPLEMENTED` |
| `POST /api/auth/verify-email`, `forgot-password`, `reset-password` | Pendiente, responden `501 AUTH_NOT_IMPLEMENTED` |

## `POST /api/auth/register`

Crea una cuenta nueva. **No requiere token.** No inicia sesión: tras registrarse, el usuario debe iniciar sesión (Bloque 2).

Cuerpo:

```json
{ "name": "Lany Pérez", "email": "lany@example.com", "password": "Clave#Segura1" }
```

- `name` y `email` se limpian en el servidor (espacios al inicio y al final; el correo se guarda en minúsculas).
- Los tres campos son obligatorios y deben ser texto.

Éxito: `201`

```json
{
  "data": {
    "id": "3f1c1c1e-0000-4000-8000-000000000001",
    "name": "Lany Pérez",
    "email": "lany@example.com",
    "role": "client",
    "active": true,
    "emailVerified": false,
    "createdAt": "2026-09-24T12:00:00.000Z"
  }
}
```

La respuesta nunca incluye la contraseña ni su hash. El rol inicial siempre es `client`; el rol no se puede enviar en el cuerpo.

### Errores

| Estado | `code` | Cuándo | Mensaje |
| --- | --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Falta el nombre (o está vacío) | `El nombre es obligatorio.` |
| 400 | `VALIDATION_ERROR` | Nombre de más de 120 caracteres | `El nombre no puede superar 120 caracteres.` |
| 400 | `VALIDATION_ERROR` | Falta el correo | `El correo electrónico es obligatorio.` |
| 400 | `VALIDATION_ERROR` | Correo con formato inválido o de más de 254 caracteres | `El formato del correo electrónico no es válido.` |
| 400 | `VALIDATION_ERROR` | Falta la contraseña | `La contraseña es obligatoria.` |
| 400 | `VALIDATION_ERROR` | Contraseña de menos de 8 caracteres | `La contraseña debe tener al menos 8 caracteres.` |
| 400 | `VALIDATION_ERROR` | Contraseña de más de 128 caracteres | `La contraseña no puede superar 128 caracteres.` |
| 400 | `VALIDATION_ERROR` | Sin letra minúscula | `La contraseña debe incluir una letra minúscula.` |
| 400 | `VALIDATION_ERROR` | Sin letra mayúscula | `La contraseña debe incluir una letra mayúscula.` |
| 400 | `VALIDATION_ERROR` | Sin número | `La contraseña debe incluir un número.` |
| 400 | `VALIDATION_ERROR` | Sin símbolo | `La contraseña debe incluir un símbolo.` |
| 400 | `INVALID_JSON` | El cuerpo no es JSON válido | `El cuerpo JSON no es válido.` |
| 409 | `EMAIL_ALREADY_REGISTERED` | El correo ya tiene una cuenta | `El correo electrónico ya está registrado.` |
| 500 | `INTERNAL_ERROR` | Error inesperado | `Ocurrió un error interno.` |

Notas:

- Si hay varios problemas a la vez, la API devuelve **solo el primero** (en el orden de la tabla). Para una mejor experiencia, el frontend puede validar antes de enviar con las mismas reglas.
- El mensaje `VALIDATION_ERROR` no indica qué campo falló; si necesitas resaltar campos, se puede añadir después un campo `field` al error (avísame).

### Política de contraseñas

Debe cumplir todo esto: entre 8 y 128 caracteres, al menos una minúscula, una mayúscula, un número y un símbolo (cualquier carácter que no sea letra, número ni espacio). Conviene mostrarla en el formulario antes de enviar.

## Cuenta activa o desactivada

Toda cuenta nueva se crea con `active: true`. El bloqueo de inicio de sesión para cuentas desactivadas llega con el login (Bloque 2).
