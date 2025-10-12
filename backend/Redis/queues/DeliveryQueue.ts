import { Queue } from "bullmq";
import redis from "./redisClients.js";

const myQueue = new Queue("delivery-agent-queue", {
	connection: redis,
});
export default myQueue;
