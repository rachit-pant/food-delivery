import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const GetCart = asyncHandler(async (req: Request, res: Response) => {
	const GetCart = await prisma.carts.findMany({
		where: {
			user_id: req.user?.id,
		},
		select: {
			id: true,
			quantity: true,
			restaurant_id: true,
			menus: {
				select: {
					item_name: true,
					image_url: true,
				},
			},
			menu_variants: {
				select: {
					variety_name: true,
					price: true,
				},
			},
		},
	});
	res.status(200).json(GetCart);
});

export default GetCart;
