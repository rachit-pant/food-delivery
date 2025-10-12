import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";

const createAddr = asyncHandler(async (req: Request, res: Response) => {
	const Id = Number(req.user?.id);
	const { address } = req.body;
	const city_id = Number(req.body.city_id);
	const { latitude, longitude } = req.body;

	if (!address || !city_id) {
		throw new BetterError(
			"Address and City ID are required",
			400,
			"BAD_REQUEST",
			"User Error",
		);
	}
	if (!latitude || !longitude) {
		throw new BetterError(
			"Latitude and longitude are required",
			400,
			"BAD_REQUEST",
			"User Error",
		);
	}
	if (!Id) {
		throw new BetterError("Wrong id", 404, "WRONG_ID", "User Error");
	}
	try {
		const findAddress = await prisma.user_addresses.findMany({
			where: {
				user_id: Id,
			},
		});
		const newAddress = await prisma.user_addresses.create({
			data: {
				user_id: Id,
				address,
				city_id,
				is_default: findAddress.length === 0,
				lat: latitude,
				lng: longitude,
			},
		});

		res.status(201).json({
			message: "Address created successfully",
			data: newAddress,
		});
	} catch (_error) {
		throw new BetterError(
			"Address not created",
			500,
			"ADDRESS_NOT_CREATED",
			"User Error",
		);
	}
});

export default createAddr;
