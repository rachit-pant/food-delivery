import { Queue } from 'bullmq';
import redis from './redisClients';
const myQueue = new Queue('delivery-agent-queue', {
  connection: redis,
});
export default myQueue;
