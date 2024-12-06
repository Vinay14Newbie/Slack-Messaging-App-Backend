import express from 'express';

import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import apiRouter from './routers/apiRouter.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/ping', isAuthenticated, (req, res) => {
  console.log(req.user);
  return res.json({ message: 'pong' });
});

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectDB();
});
