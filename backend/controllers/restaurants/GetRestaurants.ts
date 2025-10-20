import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import prisma from "../../prisma/client.js";

interface RestaurantTiming {
	id: number;
	restaurant_id: number;
	week_day: string;
	start_time: Date;
	end_time: Date;
}
//custom for current remove customNow and use now
const customNow = new Date();
customNow.setHours(12, 0, 0, 0);
function isRestaurantOpen(timings: RestaurantTiming[], now: Date): boolean {
	if (!timings || timings.length === 0) return false;

	return timings.some((timing) => {
		const start = new Date(timing.start_time);
		const end = new Date(timing.end_time);

		const todayStart = new Date(now);
		todayStart.setHours(start.getHours(), start.getMinutes(), 0, 0);

		const todayEnd = new Date(now);
		todayEnd.setHours(end.getHours(), end.getMinutes(), 0, 0);

		if (todayEnd <= todayStart) {
			todayEnd.setDate(todayEnd.getDate() + 1);
		}

		return now >= todayStart && now <= todayEnd;
	});
}
export const GetRestro = asyncHandler(async (req: Request, res: Response) => {
	const filter = req.query.filter as string;
	const country = req.query.country as string;

	const filters: any = {};
	if (filter && filter !== "None") {
		filters.rating = { gte: Number(filter) };
	}
	if (country) {
		filters.cities = {
			states: {
				countries: { country_name: country },
			},
		};
	}

	const allRes = await prisma.restaurants.findMany({
		where: filters,
		include: { restaurant_timings: true },
	});

	const now = new Date();
	const todayWeekDay = now.toLocaleDateString("en-US", { weekday: "long" });

	const response = allRes.map((res) => {
		const todayTimings = res.restaurant_timings.filter(
			(t) => t.week_day === todayWeekDay,
		);
		const open = isRestaurantOpen(todayTimings, customNow);
		return { ...res, is_open: open };
	});

	res.status(200).json(response);
});

export const GetPer = asyncHandler(async (req: Request, res: Response) => {
	const id = Number(req.params.restaurantId);
	const GetPer = await prisma.restaurants.findUnique({
		where: {
			id,
		},
		include: {
			restaurant_timings: true,
			cities: {
				select: {
					city_name: true,
					states: {
						select: {
							state_name: true,
						},
					},
				},
			},
		},
	});
	if (!GetPer) {
		const error = new Error("no restro exists");
		(error as any).statusCode = 400;
		throw error;
	}
	res.status(200).json(GetPer);
});
