import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const PatchMenus = asyncHandler(async (req, res) => {
    const MenuId = Number(req.params.menuId);
    const PatchMenus = await prisma.menus.update({
        where: {
            id: MenuId,
        },
        data: {
            category_id: Number(req.body.category),
            item_name: req.body.item_name,
            description: req.body.description,
            image_url: req.body.photo,
            price: Number(req.body.price),
        },
    });
    if (!PatchMenus) {
        const error = new Error("no menu found to be parched");
        error.statusCode = 400;
        throw error;
    }
    res.status(200).json(PatchMenus);
});
export default PatchMenus;
