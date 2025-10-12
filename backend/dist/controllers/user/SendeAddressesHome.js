import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const AddressesHome = asyncHandler(async (req, res) => {
    const id = req.user?.id;
    if (!id) {
        const error = new Error("unauth acess");
        error.statusCode = 401;
        throw error;
    }
    const AddressesHome = await prisma.user_addresses.findFirst({
        where: {
            user_id: id,
            is_default: true,
        },
        include: {
            cities: {
                include: {
                    states: {
                        include: {
                            countries: true,
                        },
                    },
                },
            },
        },
    });
    if (!AddressesHome) {
        const error = new Error("no addresses found");
        error.statusCode = 401;
        throw error;
    }
    res.status(200).json(AddressesHome);
});
export default AddressesHome;
