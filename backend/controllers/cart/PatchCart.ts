import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const PatchCart = asyncHandler(async (req: Request, res: Response) => {
	const itemId = Number(req.params.cartId);
	const quantity = Number(req.body.quantity);
	if (Number.isNaN(itemId) || Number.isNaN(quantity)) {
		res.status(400);
		throw new Error("Invalid item ID or quantity");
	}
	if (quantity === 0) {
		await prisma.carts.delete({
			where: {
				id: itemId,
			},
		});
	} else {
		await prisma.carts.update({
			where: {
				user_id: req.user?.id,
				id: itemId,
			},
			data: {
				quantity: Number(req.body.quantity),
			},
		});
	}
	res.status(200).json({
		message: "changed successfully",
	});
});

export default PatchCart;
