import { QueueEvents } from 'bullmq';
import Redis from 'ioredis';
import { Server } from 'socket.io';
import prisma from '../../prisma/client';
import myQueue from './DeliveryQueue';
interface Returnvalue {
  orderId: number;
}
interface DeliveryAgent {
  user_id: number;
}
interface UpdateOrder {
  status: string;
}
function emitDeliverQueries(io: Server, onlineUsers: Map<number, string[]>) {
  const pubClient = new Redis({
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
  });
  const deliveryAgentQueueEvents = new QueueEvents('delivery-agent-queue', {
    connection: pubClient,
  });
  deliveryAgentQueueEvents.on(
    'completed',
    async ({
      jobId,
      returnvalue,
      prev,
    }: {
      jobId: string;
      returnvalue: any;
      prev?: string;
    }) => {
      const { orderId } = returnvalue as Returnvalue;
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
      const deliveryAgents: DeliveryAgent[] =
        await prisma.delivery_agents.findMany({
          where: {
            status: 'ACTIVE',
          },
          select: {
            user_id: true,
          },
        });
      deliveryAgents.forEach((agent) => {
        const socketId: string[] | [] = onlineUsers.get(agent.user_id) || [];
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
        })) as UpdateOrder;
        if (updatedOrder?.status === 'prepared') {
          await myQueue.add('assignOrder', { orderId }, { delay: 1000 });
        }
      }, 30000);
    }
  );
}
export default emitDeliverQueries;
