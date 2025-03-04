import { JOIN_DM } from '../utils/common/eventConstants.js';

export default function DMHandler(io, socket) {
  socket.on(JOIN_DM, async function joinDMHandler(data, cb) {
    console.log('data in dm: ', data);
    const { senderId, receiverId } = data;
    const roomId = [senderId, receiverId].sort().join('_'); //creating roomId using sender and receiver ID
    socket.join(roomId);
    console.log(roomId);
    console.log(`User ${socket.id} joined the DM: ${roomId}`);

    cb?.({
      success: true,
      message: 'Successfully joined the DM',
      data: roomId
    });
  });
}
