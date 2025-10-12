import { Worker } from "bullmq";
import redis from "../queues/redisClients.js";

const OrderWorker = new Worker(
	"delivery-agent-queue",
	async (job) => {
		const { orderId } = job.data;

		return { orderId };
	},
	{ connection: redis },
);

export default OrderWorker;
