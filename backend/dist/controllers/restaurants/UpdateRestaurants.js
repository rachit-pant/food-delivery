import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const UpdateRestro = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const UpdateRestro = await prisma.restaurants.update({
        where: {
            id,
        },
        data: {
            name: req.body.name,
            address: req.body.address,
            city_id: Number(req.body.city_id),
            status: req.body.status,
        },
    });
    if (!UpdateRestro) {
        const error = new Error("no id found");
        error.statusCode = 404;
        throw error;
    }
    res.status(200).json(UpdateRestro);
});
export default UpdateRestro;
