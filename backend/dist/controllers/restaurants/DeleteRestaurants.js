import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const DeleteRestro = asyncHandler(async (req, res) => {
    const id = Number(req.params.restaurantId);
    if (!id) {
        const error = new Error("no id exists");
        error.statusCode = 400;
        throw error;
    }
    const DeleteRestro = await prisma.restaurants.delete({
        where: {
            id,
        },
    });
    if (!DeleteRestro) {
        const error = new Error("server error");
        error.statusCode = 500;
        throw error;
    }
    res.status(200).json({
        message: `Deleted succesfully ${id}`,
    });
});
export default DeleteRestro;
