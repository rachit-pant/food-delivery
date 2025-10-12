import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
import myQueue from '../../Redis/queues/DeliveryQueue.js';
export const updateOrders = asyncHandler(async (req, res) => {
    const orderId = Number(req.params.orderId);
    try {
        const order = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                status: 'prepared',
            },
        });
        myQueue.add(`assign_order_${order.id}`, { orderId: order.id }, {
            removeOnComplete: {
                age: 3600,
            },
        });
        res.status(200).json(order);
    }
    catch (_error) {
        throw new BetterError('Order not found', 404, 'ORDER_NOT_FOUND', 'Order Error');
    }
});
export const updateOrdersToDelivered = asyncHandler(async (req, res) => {
    const orderId = Number(req.params.orderId);
    const userId = Number(req.user?.id);
    try {
        const order = await prisma.orders.update({
            where: {
                id: orderId,
            },
            data: {
                delivery_agents: {
                    connect: {
                        user_id: userId,
                    },
                },
                status: 'picked',
            },
        });
        res.status(200).json(order);
    }
    catch (_error) {
        throw new BetterError('Order not found', 404, 'ORDER_NOT_FOUND', 'Order Error');
    }
});
