import { JOIN_DM } from '../utils/common/eventConstants';

export default function DMHandler(io, socket) {
  socket.on(JOIN_DM, async function joinDMHandler(data, cb) {
    const roomId = data.memberId;
    socket.join(roomId);
    console.log(`User ${socket.id} joined the DM: ${roomId}`);

    cb?.({
      success: true,
      message: 'Successfully joined the DM',
      data: roomId
    });
  });
}
