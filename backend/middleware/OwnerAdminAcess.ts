import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PrismaClient } from "../generated/prisma/index.js";
import { BetterError } from "../middleware/errorHandler.js";

const prisma = new PrismaClient();
interface JwtPayload {
	id: number;
	role: number;
	email: string;
}
interface StaffPayload {
	id: number;
	role: string;
	franchiseId: number;
}

declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
			staff?: StaffPayload;
		}
	}
}
const DAR = asyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		const ResId = Number(req.params.restaurantId);
		const ResData = await prisma.restaurants.findUnique({
			where: {
				id: ResId,
			},
		});
		if (
			req.staff &&
			req.staff.id === 1 &&
			req.staff.franchiseId === ResData?.franchiseId
		) {
			return next();
		}
		if (ResData?.user_id === req.user?.id || req.user?.role === 3) {
			return next();
		} else {
			throw new BetterError(
				"you dont have permission",
				403,
				"FORBIDDEN",
				"Permission Error",
			);
		}
	},
);

export default DAR;
