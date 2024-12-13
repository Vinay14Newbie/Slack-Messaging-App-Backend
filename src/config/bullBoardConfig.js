import { createBullBoard } from '@bull-board/api'; //Initializes the Bull-Board interface for managing queues.
import { BullAdapter } from '@bull-board/api/bullAdapter.js'; //it will bind your bullboard ui with corresponding Queue setup OR Connects Bull queues to Bull-Board.
import { ExpressAdapter } from '@bull-board/express'; //Connects Bull-Board to an Express server for hosting the UI.

import mailQueue from '../queues/mailQueue.js';
import testQueue from '../queues/testQueue.js';

const bullServerAdapter = new ExpressAdapter(); //for connection b/w bull board ui and express OR This connects Bull-Board's management interface to your Express app.
bullServerAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullAdapter(mailQueue), new BullAdapter(testQueue)], //to understand redis you need BullAdapter
  serverAdapter: bullServerAdapter //Links the Bull-Board interface to the Express adapter.
});

export default bullServerAdapter;
