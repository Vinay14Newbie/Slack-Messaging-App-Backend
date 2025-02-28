import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import DMHandler from './controllers/1v1MessageSocketController.js';
import ChannelSocketHandlers from './controllers/ChannelSocketController.js';
import DMmessageHandler from './controllers/DMSocketController.js';
import MessageSocketHandlers from './controllers/messageSocketController.js';
import { verifyEmailController } from './controllers/userController.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';
import apiRouter from './routers/apiRouter.js';

const app = express();
const server = createServer(app); //it will create a server, cause now we're serving the websocket request on same port
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.get('/ping', isAuthenticated, (req, res) => {
  console.log(req.user);
  return res.json({ message: 'pong' });
});

app.use('/api', apiRouter);

app.get('/verify/:token', verifyEmailController);

// 'io.on' listens for the connection event, which triggers every time a client establishes a WebSocket connection to the server.
io.on('connection', (socket) => {
  console.log('a user connected ', socket.id);

  MessageSocketHandlers(io, socket);
  ChannelSocketHandlers(io, socket);

  DMHandler(io, socket);
  DMmessageHandler(io, socket);
});

server.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectDB();
});
