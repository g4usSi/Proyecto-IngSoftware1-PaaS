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

    // Si el correo ya existe, Postgres lanza el error 23505 (unique_violation) y el service lo traduce.
    async createUser({ name, email, passwordHash }) {
      const { rows } = await database.query(
        `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING ${PUBLIC_COLUMNS}`,
        [name, email, passwordHash],
      );
      return rows[0];
    },
  };
}
