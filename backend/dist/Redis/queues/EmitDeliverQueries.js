import { QueueEvents } from 'bullmq';
import { Redis } from 'ioredis';
import prisma from '../../prisma/client.js';
import myQueue from './DeliveryQueue.js';
function emitDeliverQueries(io, onlineUsers) {
    const pubClient = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
    });
    const deliveryAgentQueueEvents = new QueueEvents('delivery-agent-queue', {
        connection: pubClient,
    });
    deliveryAgentQueueEvents.on('completed', async ({ jobId, returnvalue, prev, }) => {
        const { orderId } = returnvalue;
        const order = await prisma.orders.findUnique({
            where: {
                id: orderId,
            },
            select: {
                id: true,
                net_amount: true,
                payment_status: true,
                order_addresses: {
                    select: {
                        address: true,
                    },
                },
                order_items: {
                    select: {
                        product_name: true,
                        quantity: true,
                    },
                },
                restaurants: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        const deliveryAgents = await prisma.delivery_agents.findMany({
            where: {
                status: 'ACTIVE',
            },
            select: {
                user_id: true,
            },
        });
        deliveryAgents.forEach((agent) => {
            const socketId = onlineUsers.get(agent.user_id) || [];
            if (socketId.length > 0) {
                socketId.forEach((id) => {
                    io.to(id).emit('OrderRequest', order);
                });
            }
        });
        setTimeout(async () => {
            const updatedOrder = (await prisma.orders.findUnique({
                where: { id: orderId },
                select: { status: true },
            }));
            if (updatedOrder?.status === 'prepared') {
                await myQueue.add('assignOrder', { orderId }, { delay: 1000 });
            }
        }, 30000);
    });
}
export default emitDeliverQueries;
