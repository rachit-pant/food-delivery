import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const getSpecOrders = asyncHandler(async (req, res) => {
    const orderId = Number(req.params.orderId);
    const getSpecOrders = await prisma.orders.findMany({
        where: {
            user_id: req.user?.id,
            id: orderId,
        },
        include: {
            order_items: {
                include: {
                    menus: true,
                    menu_variants: true,
                },
            },
        },
    });
    if (!getSpecOrders) {
        res.status(404).json({ message: "Order not found" });
        return;
    }
    res.status(200).json(getSpecOrders);
});
export default getSpecOrders;
