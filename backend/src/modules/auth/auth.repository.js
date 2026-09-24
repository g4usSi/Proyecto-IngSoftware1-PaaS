// Columnas públicas del usuario: password_hash nunca se selecciona para respuestas.
const PUBLIC_COLUMNS = 'id, name, email, role, active, email_verified, created_at';

export function createAuthRepository(database) {
  return {
    async findUserByEmail(email) {
      const { rows } = await database.query(
        `SELECT ${PUBLIC_COLUMNS}, password_hash FROM users WHERE email = $1`,
        [email],
      );
      return rows[0] ?? null;
    },

    async findUserById(id) {
      const { rows } = await database.query(
        `SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`,
        [id],
      );
      return rows[0] ?? null;
    },

    // Si el correo ya existe, Postgres lanza el error 23505 (unique_violation) y el service lo traduce.
    async createUser({ name, email, passwordHash }) {
      const { rows } = await database.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING ${PUBLIC_COLUMNS}`,
        [name, email, passwordHash],
      );
      return rows[0];
    },

    async isTokenRevoked(jti) {
      const { rows } = await database.query('SELECT 1 FROM revoked_tokens WHERE jti = $1', [jti]);
      return rows.length > 0;
    },

    // Idempotente: revocar dos veces el mismo token no es un error.
    async revokeToken({ jti, userId, expiresAt }) {
      await database.query(
        'INSERT INTO revoked_tokens (jti, user_id, expires_at) VALUES ($1, $2, $3) ON CONFLICT (jti) DO NOTHING',
        [jti, userId, expiresAt],
      );
    },

    // Un token vencido ya no se puede usar, así que su revocación deja de importar.
    async purgeExpiredRevocations() {
      await database.query('DELETE FROM revoked_tokens WHERE expires_at < now()');
    },
  };
}
