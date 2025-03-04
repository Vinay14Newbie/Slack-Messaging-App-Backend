import { createDMMessageService } from '../services/DMService.js';
import {
  NEW_DM_EVENT,
  NEW_DM_RECEIVED_EVENT
} from '../utils/common/eventConstants.js';

export default function DMmessageHandler(io, socket) {
  socket.on(NEW_DM_EVENT, async function createDMMessageHandler(data, cb) {
    const { senderId, receiverId } = data;
    const roomId = [senderId, receiverId].sort().join('_'); //creating roomId using sender and receiver ID
    data.dmId = roomId;
    console.log('Controller layer: ', data, typeof data.dmId);
    const messageResponse = await createDMMessageService(data);
    io.to(roomId).emit(NEW_DM_RECEIVED_EVENT, messageResponse);

    cb?.({
      success: true,
      message: 'Successfully created the DM',
      data: messageResponse
    });
  });
}
