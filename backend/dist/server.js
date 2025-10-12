import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { createAdapter } from '@socket.io/redis-adapter';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';
import DeliveryQueue from './Redis/queues/DeliveryQueue.js';
import emitDeliverQueries from './Redis/queues/EmitDeliverQueries.js';
dotenv.config();
const corsOptions = {
    origin: ['http://localhost:3000', 'http://frontend:3000'],
    credentials: true,
};
const app = express();
const port = 5000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://frontend:3000'],
        credentials: true,
    },
});
async function initRedisAdapter(io) {
    const pubClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
    });
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
}
initRedisAdapter(io).catch(console.error);
const onlineUsers = socketloader(io);
emitDeliverQueries(io, onlineUsers);
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
    queues: [new BullMQAdapter(DeliveryQueue)],
    serverAdapter,
});
import { createServer } from 'node:http';
import path from 'node:path';
import { Worker } from 'bullmq';
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';
import redis from './Redis/queues/redisClients.js';
import AdditionalRoutes from './routes/additionalRoutes.js';
import CartControl from './routes/CartControl.js';
import ControlRestaurants from './routes/ControlRestaurants.js';
import delivery from './routes/delivery.js';
import ExtraRoutes from './routes/extrarouters.js';
import Franchise from './routes/franchise.js';
import MenusControl from './routes/MenusControl.js';
import OrderControl from './routes/OrderControl.js';
import StripeWebhooks from './routes/StripeWebhooks.js';
import UserRoute from './routes/UserControl.js';
import WebAddress from './routes/WebAddress.js';
import socketloader from './sockets/index.js';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OrderWorker = new Worker('delivery-agent-queue', async (job) => {
    const { orderId } = job.data;
    console.log('worker', orderId);
    return { orderId };
}, { connection: redis });
export default OrderWorker;
app.use('/admin/queues', serverAdapter.getRouter());
app.set('io', io);
app.set('onlineUsers', onlineUsers);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/stripe', StripeWebhooks);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/users', UserRoute);
app.use('/restaurants', ControlRestaurants);
//control menus
app.use('/restaurants/:restaurantId/menus', MenusControl);
app.use('/cart', CartControl);
app.use('/orders', OrderControl);
app.use('/auths', ExtraRoutes);
app.use('/franchise', Franchise);
app.use('/address', WebAddress);
app.use('/extra', AdditionalRoutes);
app.use('/delivery', delivery);
app.use(errorHandler);
httpServer.listen(port, () => {
    console.log(`server started on port ${port}`);
});
