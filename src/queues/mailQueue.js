import Queue from 'bull';

import redisConfig from '../config/redisConfig.js';

//                        queue name
export default new Queue('mailQueue', {
  redis: redisConfig
});

/**
 * 
 * 
'mailQueue' (Queue Name):

This is the name of the queue. It uniquely identifies this queue in Redis.
Multiple workers or producers can interact with the same queue by referring to this name.

Redis Configuration Object:

The redis object specifies the connection details to the Redis server.
host: The Redis server's hostname or IP address.
port: The Redis server's port number (default is 6379).

Why Pass Redis Config?:

Bull uses Redis as its backend for storing job details, progress, and metadata.
The configuration ensures Bull can connect to the correct Redis instance.
 */
