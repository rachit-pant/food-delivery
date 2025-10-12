import asyncHandler from "express-async-handler";
import { PrismaClient } from "../generated/prisma/index.js";
import { BetterError } from "../middleware/errorHandler.js";
const prisma = new PrismaClient();
const DAR = asyncHandler(async (req, _res, next) => {
    const ResId = Number(req.params.restaurantId);
    const ResData = await prisma.restaurants.findUnique({
        where: {
            id: ResId,
        },
    });
    if (req.staff &&
        req.staff.id === 1 &&
        req.staff.franchiseId === ResData?.franchiseId) {
        return next();
    }
    if (ResData?.user_id === req.user?.id || req.user?.role === 3) {
        return next();
    }
    else {
        throw new BetterError("you dont have permission", 403, "FORBIDDEN", "Permission Error");
    }
});
export default DAR;
