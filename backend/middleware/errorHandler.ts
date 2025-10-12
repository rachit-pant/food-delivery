import type { NextFunction, Request, Response } from "express";

export class BetterError extends Error {
	statusCode: number;
	code: string;
	name: string;
	constructor(message: string, statusCode: number, code: string, name: string) {
		super(message);
		this.statusCode = statusCode;
		this.code = code;
		this.name = name;
	}
}
export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	console.error(err);

	res.status(err.statusCode || 500).json({
		success: false,
		message: err.message || "Internal Server Error",
		code: err.code || "INTERNAL_SERVER_ERROR",
		name: err.name || "Error",
	});
};
