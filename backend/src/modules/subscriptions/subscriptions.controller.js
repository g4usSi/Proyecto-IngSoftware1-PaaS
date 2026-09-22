export function createSubscriptionsController(service) {
  return {
    async listPlans(_req, res) {
      res.json({ data: await service.listPlans() });
    },
    async me(req, res) {
      res.json({ data: await service.getMySubscription(req.user.id) });
    },
  };
}
