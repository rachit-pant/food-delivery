import expressAsyncHandler from "express-async-handler";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";
const postFranchise = expressAsyncHandler(async (req, res) => {
    const { name } = req.body;
    const userId = Number(req.user?.id);
    if (!userId) {
        throw new BetterError("no user found", 400, "NO_USER_FOUND", "User Error");
    }
    const image = req.file?.filename;
    let restaurants;
    if (image) {
        restaurants = JSON.parse(req.body.restaurants);
    }
    else {
        restaurants = req.body.restaurants;
    }
    console.log(restaurants);
    const franchise = await prisma.franchise.create({
        data: {
            name: name,
            image_url: `/images/${image}`,
            userId,
            restaurants: {
                connect: restaurants.map((r) => ({
                    id: Number(r.restaurant_id),
                })),
            },
        },
    });
    res.status(200).json(franchise);
});
export default postFranchise;
