import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { readDatabase } from '../services/database.service.js';
import { attachAuthor, attachComments, normalizeText } from '../services/social.service.js';

const router = Router();

function searchUsers(users, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  return users.filter(user => {
    return normalizeText(user.username).includes(normalizedQuery) ||
      normalizeText(user.fullName).includes(normalizedQuery) ||
      normalizeText(user.bio).includes(normalizedQuery);
  });
}

function searchPosts(posts, users, comments, query) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return [];
  }

  return posts
    .filter(post => normalizeText(post.content).includes(normalizedQuery))
    .map(post => attachComments(attachAuthor(post, users), comments, users))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

router.get('/', asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const db = await readDatabase();

  res.json({
    users: searchUsers(db.users, query),
    posts: searchPosts(db.posts, db.users, db.comments, query)
  });
}));

router.get('/users', asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const db = await readDatabase();
  res.json(searchUsers(db.users, query));
}));

router.get('/posts', asyncHandler(async (req, res) => {
  const query = req.query.q || '';
  const db = await readDatabase();
  res.json(searchPosts(db.posts, db.users, db.comments, query));
}));

export default router;
