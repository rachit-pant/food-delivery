import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

const cartCount = expressAsyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	if (!userId) {
		throw new Error("User ID is required");
	}
	const count = await prisma.carts.count({
		where: {
			user_id: Number(userId),
		},
		select: {
			quantity: true,
		},
	});
	res.json(count.quantity);
});

export default cartCount;
