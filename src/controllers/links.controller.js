import * as service from '../services/links.service.js';

export async function create(req, res) { res.status(201).json({ invitation: await service.createInvitation(req.session.user.id) }); }
export async function invitations(req, res) { res.json({ invitations: await service.listInvitations(req.session.user.id) }); }
export async function accept(req, res) { res.json({ invitation: await service.acceptInvitation(req.body.code, req.session.user.id) }); }
export async function people(req, res) {
  const user = req.session.user;
  const people = user.role === 'trainer' ? await service.listAthletes(user.id) : await service.listTrainers(user.id);
  res.json({ people });
}
