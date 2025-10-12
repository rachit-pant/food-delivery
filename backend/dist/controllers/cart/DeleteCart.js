import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const DeleteCart = asyncHandler(async (req, res) => {
    const DeleteCart = await prisma.carts.deleteMany({
        where: {
            user_id: req.user?.id,
            menu_id: Number(req.params.itemId),
        },
    });
    if (!DeleteCart) {
        const error = new Error("no user found");
        error.statusCode = 400;
        throw error;
    }
    res.status(200).json({
        message: "Deleted Succes",
    });
});
export default DeleteCart;
