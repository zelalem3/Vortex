import { Worker } from 'bullmq';
import { Redis } from 'ioredis'; // BullMQ uses this internally
import { VORTEX_QUEUE_NAME } from '../../shared/constants';

const redisPublisher = new Redis({ host: 'localhost', port: 6379 });

const worker = new Worker(VORTEX_QUEUE_NAME, async (job) => {
  console.log(`Working on ${job.data.id}...`);
  
  //simulate processing time
  await new Promise(res => setTimeout(res, 3000)); 

  
  await redisPublisher.publish('vortex-updates', JSON.stringify({
    taskId: job.data.id,
    status: 'completed',
    result: 'Vortex Data Processed'
  }));

  return { success: true };
}, { connection: { host: 'localhost', port: 6379 } });