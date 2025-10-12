import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();

const PopularDish = asyncHandler(async (req: Request, res: Response) => {
	const Name = req.params.menuName;

	const PopularDish = await prisma.restaurants.findMany({
		where: {
			name: {
				contains: Name,
				mode: "insensitive",
			},
		},
	});

	res.json(PopularDish);
});

export default PopularDish;
