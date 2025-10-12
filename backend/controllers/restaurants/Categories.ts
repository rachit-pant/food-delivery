import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient();
const AddCategory = asyncHandler(async (_req: Request, res: Response) => {
	const GetCategory = await prisma.menu_categories.findMany({});
	if (!GetCategory) {
		const error = new Error("server error");
		(error as any).statusCode = 500;
		throw error;
	}
	res.status(201).json(GetCategory);
});

export default AddCategory;
