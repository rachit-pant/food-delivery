import asyncHandler from "express-async-handler";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";
const GetPlans = asyncHandler(async (req, res) => {
    const id = Number(req.user?.role);
    console.log(id);
    if (!id) {
        throw new BetterError("wrong id", 400, "WRONG_ID", "Error");
    }
    const plans = await prisma.plan.findMany({
        where: {
            role_id: id,
        },
    });
    if (plans.length === 0) {
        throw new BetterError("no plans found", 400, "NO_PLANS_FOUND", "Error");
    }
    res.status(200).json(plans);
});
export default GetPlans;
