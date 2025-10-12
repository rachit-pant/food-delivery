import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

interface JwtPayload {
	id: number;
	role: number;
	email: string;
}
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload;
		}
	}
}
const UserAccess = asyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		const id = Number(req.params.id);
		if (id !== req.user?.id) {
			const error = new Error("wrong login");
			(error as any).statusCode = 400;
			throw error;
		}
		next();
	},
);

export default UserAccess;
