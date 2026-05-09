import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';
import { ApiError } from '../utils/api-error.js';
import { getNextId, readDatabase, writeDatabase } from '../services/database.service.js';

const router = Router();

router.get('/conversations/:userId', asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const db = await readDatabase();
  const user = db.users.find(item => item.id === userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const partnerIds = new Set();

  db.messages.forEach(message => {
    if (message.senderId === userId) {
      partnerIds.add(message.receiverId);
    }

    if (message.receiverId === userId) {
      partnerIds.add(message.senderId);
    }
  });

  const conversations = [...partnerIds].map(partnerId => {
    const partner = db.users.find(item => item.id === partnerId);
    const messages = db.messages
      .filter(message => {
        const sent = message.senderId === userId && message.receiverId === partnerId;
        const received = message.senderId === partnerId && message.receiverId === userId;
        return sent || received;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return {
      partner,
      lastMessage: messages.at(-1) || null,
      messagesCount: messages.length
    };
  });

  res.json(conversations);
}));

router.get('/:userId/:friendId', asyncHandler(async (req, res) => {
  const userId = Number(req.params.userId);
  const friendId = Number(req.params.friendId);
  const db = await readDatabase();

  const user = db.users.find(item => item.id === userId);
  const friend = db.users.find(item => item.id === friendId);

  if (!user || !friend) {
    throw new ApiError(404, 'One of the users was not found');
  }

  const messages = db.messages
    .filter(message => {
      const sent = message.senderId === userId && message.receiverId === friendId;
      const received = message.senderId === friendId && message.receiverId === userId;
      return sent || received;
    })
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(message => ({
      ...message,
      sender: db.users.find(item => item.id === message.senderId) || null,
      receiver: db.users.find(item => item.id === message.receiverId) || null
    }));

  res.json(messages);
}));

router.post('/', asyncHandler(async (req, res) => {
  const senderId = Number(req.body.senderId);
  const receiverId = Number(req.body.receiverId);
  const text = String(req.body.text || '').trim();

  if (!senderId || !receiverId || !text) {
    throw new ApiError(400, 'Sender, receiver and message text are required');
  }

  if (senderId === receiverId) {
    throw new ApiError(400, 'User cannot send message to himself');
  }

  const db = await readDatabase();
  const sender = db.users.find(item => item.id === senderId);
  const receiver = db.users.find(item => item.id === receiverId);

  if (!sender || !receiver) {
    throw new ApiError(404, 'One of the users was not found');
  }

  const message = {
    id: getNextId(db.messages),
    senderId,
    receiverId,
    text,
    createdAt: new Date().toISOString()
  };

  db.messages.push(message);
  await writeDatabase(db);

  res.status(201).json({ ...message, sender, receiver });
}));

export default router;
