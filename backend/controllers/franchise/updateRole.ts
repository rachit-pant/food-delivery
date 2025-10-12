import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";

const updateRole = asyncHandler(async (req: Request, res: Response) => {
	const { franchiseStaffId, roleId } = req.body;
	if (!franchiseStaffId || !roleId) {
		throw new Error("Missing required fields");
	}
	const updatedRole = await prisma.franchiseStaff.update({
		where: { id: Number(franchiseStaffId) },
		data: { staffRoleId: Number(roleId) },
	});
	res.status(200).json(updatedRole);
});

export default updateRole;
