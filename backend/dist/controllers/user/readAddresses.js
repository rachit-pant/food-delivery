import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const readAddress = asyncHandler(async (req, res) => {
    const id = Number(req.user?.id);
    if (!id) {
        const error = new Error("no user found");
        error.statusCode = 400;
        throw error;
    }
    const Addresses = await prisma.user_addresses.findMany({
        where: {
            user_id: id,
        },
        select: {
            id: true,
            address: true,
            is_default: true,
            cities: {
                select: {
                    city_name: true,
                    states: {
                        select: {
                            state_name: true,
                            countries: {
                                select: {
                                    country_name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    res.status(200).json(Addresses);
});
export default readAddress;
