import * as service from '../services/notifications.service.js';

export async function list(req, res) {
  res.json({ notifications: await service.list(req.session.user.id) });
}

export async function unread(req, res) {
  res.json({ unread: await service.unreadCount(req.session.user.id) });
}

export async function markRead(req, res) {
  res.json({ notification: await service.markRead(req.params.id, req.session.user.id) });
}

export async function markAllRead(req, res) {
  res.json({ updated: await service.markAllRead(req.session.user.id) });
}
