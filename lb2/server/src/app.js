import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import usersRoutes from './routes/users.routes.js';
import postsRoutes from './routes/posts.routes.js';
import friendsRoutes from './routes/friends.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import searchRoutes from './routes/search.routes.js';
import { ApiError } from './utils/api-error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mini Social Network API is running' });
});

app.use('/api/users', usersRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/search', searchRoutes);

const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next(new ApiError(404, 'API route not found'));
    return;
  }

  res.sendFile(path.join(clientDistPath, 'index.html'), error => {
    if (error) {
      next(new ApiError(404, 'Client build not found. Run npm run build in the client folder.'));
    }
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal server error'
  });
});

export default app;
