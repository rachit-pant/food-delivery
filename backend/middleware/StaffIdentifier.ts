import type { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { BetterError } from "../middleware/errorHandler.js";

interface StaffPayload {
	id: number;
	role: string;
	franchiseId: number;
}

declare global {
	namespace Express {
		interface Request {
			staff?: StaffPayload;
		}
	}
}
const staffIdentifier = asyncHandler(
	async (req: Request, _res: Response, next: NextFunction) => {
		const token = req.cookies?.staffToken;
		if (token) {
			try {
				const decoded = jwt.verify(
					token,
					process.env.REFRESH_SECRET_KEY as string,
				) as StaffPayload;

				req.staff = decoded;
				next();
			} catch (err: any) {
				if (err.name === "TokenExpiredError") {
					console.log("hello");
					throw new BetterError(
						"Token expired",
						401,
						"TOKEN_EXPIRED",
						"Token Error",
					);
				}
				throw new BetterError(
					"Invalid access token",
					401,
					"INVALID_ACCESS_TOKEN",
					"Token Error",
				);
			}
		} else {
			next();
		}
	},
);

export default staffIdentifier;
