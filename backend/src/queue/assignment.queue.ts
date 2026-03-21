// import {Queue} from 'bullmq';
// import {env} from '../config/env'

// export const assignmentQueue = new Queue("assignmentQueue",{
//     connection:{
//         url:env.REDIS_URL // We have to add the url of redis here - Remember it 
//     }
// })




import { Queue } from 'bullmq';
import { env } from '../config/env';
import { redisConnection } from '../config/redis';

const isRedisAvailable = !!redisConnection;

export const assignmentQueue = isRedisAvailable ? new Queue("assignmentQueue", {
  connection: { url: env.REDIS_URL }
}) : null;

if (!isRedisAvailable) {
  console.warn("⚠️ Redis not available, queue disabled. Assignments will be processed synchronously.");
} else {
  console.log("✅ Queue initialized with Redis");
}
