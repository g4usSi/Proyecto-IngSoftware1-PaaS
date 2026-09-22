import { AppError, notImplemented } from '../../lib/app-error.js';

export function createSubscriptionsService(repository) {
  return {
    async listPlans() {
      let plans;
      try {
        plans = await repository.listActivePlans();
      } catch {
        throw new AppError(503, 'DATABASE_UNAVAILABLE', 'El catálogo de planes no está disponible. Revisa PostgreSQL y las migraciones.');
      }
      return plans.map((plan) => ({
        id: plan.id,
        code: plan.code,
        name: plan.name,
        // BIGINT y NUMERIC viajan como texto para evitar pérdida de precisión.
        capacityBytes: String(plan.capacity_bytes),
        dailyUploadLimit: plan.daily_upload_limit,
        dailyBytesLimit: plan.daily_bytes_limit === null ? null : String(plan.daily_bytes_limit),
        monthlyPriceGtq: plan.monthly_price_gtq === null ? null : String(plan.monthly_price_gtq),
        active: plan.active,
      }));
    },
    async getMySubscription(_userId) {
      return notImplemented('SUBSCRIPTIONS_NOT_IMPLEMENTED', 'La consulta del plan del usuario está pendiente de implementación.');
    },
  };
}
