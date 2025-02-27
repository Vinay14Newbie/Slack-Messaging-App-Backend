import { createMessageService } from '../services/messageService.js';
import {
  NEW_DM_EVENT,
  NEW_DM_RECEIVED_EVENT
} from '../utils/common/eventConstants.js';

export default function DMmessageHandler(io, socket) {
  socket.on(NEW_DM_EVENT, async function createDMMessageHandler(data, cb) {
    console.log('Controller layer: ', data, typeof data);
    const { memberId } = data;
    // const messageResponse = await ;
    io.to(memberId).emit(NEW_DM_RECEIVED_EVENT, messageResponse);

    cb?.({
      success: true,
      message: 'Successfully created the DM',
      data: messageResponse
    });
  });
}
