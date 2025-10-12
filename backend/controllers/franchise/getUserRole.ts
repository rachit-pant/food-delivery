import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { BetterError } from "../../middleware/errorHandler.js";
import prisma from "../../prisma/client.js";

interface role {
	id: number | string;
	name: string;
	franchiseId: number;
}
const staffToken = (data: role) => {
	return jwt.sign(
		{
			id: data.id,
			role: data.name,
			franchiseId: data.franchiseId,
		},
		process.env.REFRESH_SECRET_KEY as string,
		{ expiresIn: "1d" },
	);
};
const getUserRole = expressAsyncHandler(async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const franchiseId = Number(req.params.franchiseId);
	if (!userId) {
		throw new BetterError("no user found", 400, "NO_USER_FOUND", "User Error");
	}
	const role = await prisma.franchiseStaff.findFirst({
		where: {
			franchiseId: franchiseId,
			isActive: true,
			staff: {
				userId: userId,
			},
		},
		select: {
			franchiseId: true,
			staffRole: {
				select: {
					role: true,
					id: true,
				},
			},
		},
	});
	if (!role) {
		throw new BetterError("no role found", 400, "NO_ROLE_FOUND", "Role Error");
	}
	const formatted = {
		name: role.staffRole.role,
		id: role.staffRole.id,
		franchiseId: role.franchiseId,
	};
	const restaurant = await prisma.restaurants.findMany({
		where: {
			franchiseId: franchiseId,
		},
		select: {
			id: true,
			name: true,
			address: true,
			franchiseId: true,
		},
	});
	const settings = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict" as const,
	};
	const receivedToken = req.cookies?.staffToken;
	if (receivedToken) {
		res.clearCookie("staffToken", settings);
	}

	const token = staffToken(formatted);
	console.log("STAFFTOKEN", token);
	res.cookie("staffToken", token, settings);
	res.status(200).json({ formatted, restaurant });
});

export default getUserRole;
