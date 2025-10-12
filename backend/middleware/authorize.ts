import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

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

const authorize = asyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		const token = req.cookies?.accesstoken;
		if (!token) {
			const error = new Error("No access token provided");
			(error as any).statusCode = 401;
			throw error;
		}

		try {
			const decoded = jwt.verify(
				token,
				process.env.ACCESS_SECRET_KEY as string,
			) as JwtPayload;

			req.user = decoded;
			next();
		} catch (err: any) {
			if (err.name === "TokenExpiredError") {
				const error = new Error("Token expired");
				(error as any).statusCode = 401;
				throw error;
			}
			const error = new Error("Invalid token");
			(error as any).statusCode = 401;
			throw error;
		}
	},
);

export default authorize;
