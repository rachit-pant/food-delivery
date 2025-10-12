import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const PopularDish = asyncHandler(async (req, res) => {
    const Name = req.params.menuName;
    const PopularDish = await prisma.restaurants.findMany({
        where: {
            name: {
                contains: Name,
                mode: "insensitive",
            },
        },
    });
    res.json(PopularDish);
});
export default PopularDish;
