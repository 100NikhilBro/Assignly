// // import {Queue} from 'bullmq';
// // import {env} from '../config/env'

// // export const assignmentQueue = new Queue("assignmentQueue",{
// //     connection:{
// //         url:env.REDIS_URL // We have to add the url of redis here - Remember it 
// //     }
// // })




// import { Queue } from 'bullmq';
// import { env } from '../config/env';
// import { redisConnection } from '../config/redis';

// const isRedisAvailable = !!redisConnection;

// export const assignmentQueue = isRedisAvailable ? new Queue("assignmentQueue", {
//   connection: { url: env.REDIS_URL }
// }) : null;

// if (!isRedisAvailable) {
//   console.warn("⚠️ Redis not available, queue disabled. Assignments will be processed synchronously.");
// } else {
//   console.log("✅ Queue initialized with Redis");
// }




import { Queue } from 'bullmq';
import { env } from '../config/env';

let assignmentQueue: Queue | null = null;

const initQueue = async () => {
  try {
    if (!env.REDIS_URL) {
      console.warn("⚠️ REDIS_URL not defined, queue disabled");
      return null;
    }

    const queue = new Queue("assignmentQueue", {
      connection: { url: env.REDIS_URL }
    });
    console.log("✅ Queue initialized");
    return queue;
  } catch (err) {
    console.error("❌ Queue initialization failed:", err);
    return null;
  }
};

// Initialize
const initialize = async () => {
  assignmentQueue = await initQueue();
};

initialize().catch(console.error);

export { assignmentQueue };
