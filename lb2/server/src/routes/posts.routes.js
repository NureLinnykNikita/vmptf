import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getNextId, readDatabase, writeDatabase } from '../services/database.service.js';
import { attachAuthor, attachComments } from '../services/social.service.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const db = await readDatabase();
  const posts = db.posts
    .map(post => attachComments(attachAuthor(post, db.users), db.comments, db.users))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(posts);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);
  const db = await readDatabase();
  const post = db.posts.find(item => item.id === postId);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.json(attachComments(attachAuthor(post, db.users), db.comments, db.users));
}));

router.post('/', asyncHandler(async (req, res) => {
  const { userId, content } = req.body;
  const parsedUserId = Number(userId);

  if (!parsedUserId || !String(content || '').trim()) {
    throw new ApiError(400, 'User and post content are required');
  }

  const db = await readDatabase();
  const user = db.users.find(item => item.id === parsedUserId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const post = {
    id: getNextId(db.posts),
    userId: parsedUserId,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  db.posts.push(post);
  await writeDatabase(db);

  res.status(201).json(attachComments(attachAuthor(post, db.users), db.comments, db.users));
}));

router.post('/:id/comments', asyncHandler(async (req, res) => {
  const postId = Number(req.params.id);
  const { userId, text } = req.body;
  const parsedUserId = Number(userId);

  if (!parsedUserId || !String(text || '').trim()) {
    throw new ApiError(400, 'User and comment text are required');
  }

  const db = await readDatabase();
  const post = db.posts.find(item => item.id === postId);
  const user = db.users.find(item => item.id === parsedUserId);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const comment = {
    id: getNextId(db.comments),
    postId,
    userId: parsedUserId,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  db.comments.push(comment);
  await writeDatabase(db);

  res.status(201).json({ ...comment, author: user });
}));

export default router;
