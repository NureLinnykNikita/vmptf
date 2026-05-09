import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getNextId, readDatabase, writeDatabase } from '../services/database.service.js';
import { getFriendshipBetween } from '../services/social.service.js';

const router = Router();

router.post('/request', asyncHandler(async (req, res) => {
  const requesterId = Number(req.body.requesterId ?? req.body.fromUserId ?? req.body.userId);
  const addresseeId = Number(req.body.addresseeId ?? req.body.toUserId ?? req.body.friendId);

  if (!requesterId || !addresseeId) {
    throw new ApiError(400, 'Requester and addressee are required');
  }

  if (requesterId === addresseeId) {
    throw new ApiError(400, 'User cannot add himself as a friend');
  }

  const db = await readDatabase();
  const requester = db.users.find(user => user.id === requesterId);
  const addressee = db.users.find(user => user.id === addresseeId);

  if (!requester || !addressee) {
    throw new ApiError(404, 'One of the users was not found');
  }

  const existing = getFriendshipBetween(db.friendships, requesterId, addresseeId);

  if (existing) {
    throw new ApiError(409, `Friendship already exists with status: ${existing.status}`);
  }

  const friendship = {
    id: getNextId(db.friendships),
    requesterId,
    addresseeId,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.friendships.push(friendship);
  await writeDatabase(db);

  res.status(201).json(friendship);
}));

router.post('/accept', asyncHandler(async (req, res) => {
  const friendshipId = Number(req.body.friendshipId ?? req.body.requestId);
  const userId = Number(req.body.userId);

  if (!friendshipId || !userId) {
    throw new ApiError(400, 'Friendship id and user id are required');
  }

  const db = await readDatabase();
  const friendship = db.friendships.find(item => item.id === friendshipId);

  if (!friendship) {
    throw new ApiError(404, 'Friendship request not found');
  }

  if (friendship.addresseeId !== userId) {
    throw new ApiError(403, 'Only the addressee can accept this request');
  }

  friendship.status = 'accepted';
  friendship.acceptedAt = new Date().toISOString();

  await writeDatabase(db);
  res.json(friendship);
}));

router.delete('/:id', asyncHandler(async (req, res) => {
  const friendshipId = Number(req.params.id);
  const db = await readDatabase();
  const friendship = db.friendships.find(item => item.id === friendshipId);

  if (!friendship) {
    throw new ApiError(404, 'Friendship not found');
  }

  db.friendships = db.friendships.filter(item => item.id !== friendshipId);
  await writeDatabase(db);

  res.status(204).send();
}));

export default router;
