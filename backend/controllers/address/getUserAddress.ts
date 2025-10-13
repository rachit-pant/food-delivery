import type { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

const getUserAddress = expressAsyncHandler(
	async (req: Request, res: Response) => {
		const user_id = req.user.id;
		const address = await prisma.user_addresses.findFirst({
			where: {
				user_id: Number(user_id),
				is_default: true,
			},
			select: {
				id: true,
				lat: true,
				lng: true,
			},
		});
		res.json(address);
	},
);

export default getUserAddress;
