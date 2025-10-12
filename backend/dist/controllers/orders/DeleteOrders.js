import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const DeleteOrder = asyncHandler(async (req, res) => {
    const orderId = Number(req.params.orderId);
    await prisma.orders.update({
        where: {
            id: orderId,
        },
        data: {
            status: "cancelled",
        },
    });
    res.status(200).json({
        message: "deleted",
    });
});
export default DeleteOrder;
