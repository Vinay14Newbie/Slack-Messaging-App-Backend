import mailQueue from '../queues/mailQueue.js';

import '../processors/mailProcessor.js';

export const addEmailtoMailQueue = async (emailData) => {
  try {
    await mailQueue.add(emailData);
    console.log('Email added to the queue');
  } catch (error) {
    console.log('Add mail to mailQueue error: ', error);
  }
};
