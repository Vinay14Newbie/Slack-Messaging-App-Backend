import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js'; //it will bind your bullboard ui with corresponding Queue setup
import { ExpressAdapter } from '@bull-board/express';

import mailQueue from '../queues/mailQueue.js';
import testQueue from '../queues/testQueue.js';

const bullServerAdapter = new ExpressAdapter();
bullServerAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullAdapter(mailQueue), new BullAdapter(testQueue)],
  serverAdapter: bullServerAdapter
});

export default bullServerAdapter;
