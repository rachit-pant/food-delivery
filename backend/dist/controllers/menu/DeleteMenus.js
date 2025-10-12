import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const DeleteMenus = asyncHandler(async (req, res) => {
    const menuId = Number(req.params.menuId);
    const DeleteMenus = await prisma.menus.delete({
        where: {
            id: menuId,
        },
    });
    if (!DeleteMenus) {
        const error = new Error("no menu found");
        error.statusCode = 400;
        throw error;
    }
    res.status(200).json({
        message: "Deleted Menus",
    });
});
export default DeleteMenus;
