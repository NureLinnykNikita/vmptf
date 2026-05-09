import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { readDatabase } from '../services/database.service.js';
import { attachAuthor, attachComments, getAcceptedFriends } from '../services/social.service.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = await readDatabase();
  res.json(db.users);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const db = await readDatabase();
  const user = db.users.find(item => item.id === userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const posts = db.posts
    .filter(post => post.userId === userId)
    .map(post => attachComments(attachAuthor(post, db.users), db.comments, db.users))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const friends = getAcceptedFriends(db.users, db.friendships, userId);

  res.json({ ...user, posts, friends });
}));

router.get('/:id/posts', asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const db = await readDatabase();
  const user = db.users.find(item => item.id === userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const posts = db.posts
    .filter(post => post.userId === userId)
    .map(post => attachComments(attachAuthor(post, db.users), db.comments, db.users))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(posts);
}));

router.get('/:id/friends', asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const db = await readDatabase();
  const user = db.users.find(item => item.id === userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(getAcceptedFriends(db.users, db.friendships, userId));
}));

router.get('/:id/friend-requests', asyncHandler(async (req, res) => {
  const userId = Number(req.params.id);
  const db = await readDatabase();
  const user = db.users.find(item => item.id === userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const incoming = db.friendships
    .filter(friendship => friendship.addresseeId === userId && friendship.status === 'pending')
    .map(friendship => ({
      ...friendship,
      requester: db.users.find(item => item.id === friendship.requesterId) || null
    }));

  const outgoing = db.friendships
    .filter(friendship => friendship.requesterId === userId && friendship.status === 'pending')
    .map(friendship => ({
      ...friendship,
      addressee: db.users.find(item => item.id === friendship.addresseeId) || null
    }));

  res.json({ incoming, outgoing });
}));

export default router;
