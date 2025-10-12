import asyncHandler from "express-async-handler";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";
const getInfo = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new BetterError("User not found", 404, "USER_NOT_FOUND", "User Error");
    }
    try {
        const deliveryAgent = await prisma.delivery_agents.findUnique({
            where: { user_id: userId },
            select: {
                id: true,
                user_id: true,
                status: true,
                orders: {
                    where: {
                        status: "picked",
                    },
                    select: {
                        id: true,
                        restaurants: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        net_amount: true,
                        payment_status: true,
                        order_items: {
                            select: {
                                id: true,
                                product_name: true,
                            },
                        },
                    },
                },
            },
        });
        res.status(200).json(deliveryAgent);
    }
    catch (_err) {
        throw new BetterError("Delivery agent not found", 404, "DELIVERY_AGENT_NOT_FOUND", "Delivery Agent Error");
    }
});
export default getInfo;
