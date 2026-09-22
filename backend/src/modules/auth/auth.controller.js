import * as service from './auth.service.js';

export async function register(req, res) {
  const data = await service.register(req.body);
  res.status(201).json({ data });
}

export async function login(req, res) {
  res.json({ data: await service.login(req.body) });
}

export async function logout(req, res) {
  res.json({ data: await service.logout(req.user) });
}

export async function me(req, res) {
  res.json({ data: await service.getCurrentUser(req.user) });
}

export async function verifyEmail(req, res) {
  res.json({ data: await service.verifyEmail(req.body) });
}

export async function forgotPassword(req, res) {
  res.json({ data: await service.forgotPassword(req.body) });
}

export async function resetPassword(req, res) {
  res.json({ data: await service.resetPassword(req.body) });
}
