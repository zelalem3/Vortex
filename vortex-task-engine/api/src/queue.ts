import { Queue } from 'bullmq';
import { VORTEX_QUEUE_NAME } from '../../shared/constants.js';
import type { TaskData } from '../../shared/constants.ts';

export const vortexQueue = new Queue(VORTEX_QUEUE_NAME, {
  connection: { host: 'localhost', port: 6379 }
});

export const addVortexTask = async (data: TaskData) => {
  await vortexQueue.add('process-task', data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 }
  });
};