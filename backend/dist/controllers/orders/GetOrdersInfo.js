import asyncHandler from "express-async-handler";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";
const GetOrdersInfo = asyncHandler(async (req, res) => {
    const _userId = req.user?.id;
    const orderId = Number(req.params.orderId);
    try {
        const order = await prisma.orders.findUnique({
            where: {
                id: orderId,
            },
            include: {
                order_items: true,
                order_payments: true,
            },
        });
        res.status(200).json(order);
    }
    catch (_error) {
        throw new BetterError("Order not found", 404, "ORDER_NOT_FOUND", "Order Error");
    }
});
export default GetOrdersInfo;
