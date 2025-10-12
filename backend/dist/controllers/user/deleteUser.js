import asyncHandler from "express-async-handler";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";
const deleteUser = asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!id) {
        throw new BetterError("Wrong id", 404, "WRONG_ID", "User Error");
    }
    try {
        await prisma.users.delete({
            where: {
                id: id,
            },
        });
        res.status(200).json({
            message: "deleted user successfully",
        });
    }
    catch (_err) {
        throw new BetterError("User not deleted", 404, "USER_NOT_DELETED", "User Error");
    }
});
export default deleteUser;
