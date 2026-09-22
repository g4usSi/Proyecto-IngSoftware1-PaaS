import { notImplemented } from '../../lib/app-error.js';

export function createSubscriptionsRepository(database) {
  return {
    async listActivePlans() {
      const result = await database.query(`
        SELECT id, code, name, capacity_bytes, daily_upload_limit,
               daily_bytes_limit, monthly_price_gtq, active
          FROM plans
         WHERE active = TRUE
         ORDER BY capacity_bytes ASC, code ASC
      `);
      return result.rows;
    },
    async findSubscriptionByUser(_userId) {
      return notImplemented('SUBSCRIPTIONS_NOT_IMPLEMENTED', 'La consulta de suscripción del usuario está pendiente.');
    },
  };
}
