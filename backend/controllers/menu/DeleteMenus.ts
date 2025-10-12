import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const DeleteMenus = asyncHandler(async (req: Request, res: Response) => {
	const menuId = Number(req.params.menuId);
	const DeleteMenus = await prisma.menus.delete({
		where: {
			id: menuId,
		},
	});
	if (!DeleteMenus) {
		const error = new Error("no menu found");
		(error as any).statusCode = 400;
		throw error;
	}
	res.status(200).json({
		message: "Deleted Menus",
	});
});

export default DeleteMenus;
