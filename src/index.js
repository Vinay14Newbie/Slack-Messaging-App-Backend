import express from 'express';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';
import apiRouter from './routers/apiRouter.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.get('/ping', isAuthenticated, (req, res) => {
  console.log(req.user);
  return res.json({ message: 'pong' });
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectDB();
});
