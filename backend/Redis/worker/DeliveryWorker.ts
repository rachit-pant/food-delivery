import { Worker } from 'bullmq';
import redis from '../queues/redisClients';

const OrderWorker = new Worker(
  'delivery-agent-queue',
  async (job) => {
    const { orderId } = job.data;

    return { orderId };
  },
  { connection: redis }
);

export default OrderWorker;
