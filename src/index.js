import cors from 'cors';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import bullServerAdapter from './config/bullBoardConfig.js';
import connectDB from './config/dbConfig.js';
import { PORT } from './config/serverConfig.js';
import ChannelSocketHandlers from './controllers/ChannelSocketController.js';
import MessageSocketHandlers from './controllers/messageSocketController.js';
import { isAuthenticated } from './middlewares/authMiddleware.js';
import apiRouter from './routers/apiRouter.js';

const app = express();
const server = createServer(app); //it will create a server, cause now we're serving the websocket request on same port
const io = new Server(server);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/ui', bullServerAdapter.getRouter());

app.get('/ping', isAuthenticated, (req, res) => {
  console.log(req.user);
  return res.json({ message: 'pong' });
});

app.use('/api', apiRouter);

// 'io.on' listens for the connection event, which triggers every time a client establishes a WebSocket connection to the server.
io.on('connection', (socket) => {
  console.log('a user connected ', socket.id);

  //message from client
  // Listens for a custom event named 'messageFromClient' from the connected client.
  // socket.on('messageFromClient', (data) => {
  //   console.log('Message from client: ', data);

  //   // The io.emit method sends an event called 'new message' to every connected client.
  //   io.emit('new message', data.toUpperCase()); //broadcast the message with event name 'new message'
  // });

  // 'socket.emit' targets the client associated with the current socket object (instead of all clients, as with io.emit).
  // setTimeout(() => {
  //   socket.emit('message', `This is a message from the server:`);
  // }, 3000);

  MessageSocketHandlers(io, socket);
  ChannelSocketHandlers(io, socket);
});

server.listen(PORT, () => {
  console.log('Server is running on port ', PORT);
  connectDB();
});
