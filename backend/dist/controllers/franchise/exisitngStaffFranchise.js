import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
export const getStaff = asyncHandler(async (_req, res) => {
    const staff = await prisma.staff.findMany();
    res.status(200).json(staff);
});
export const StaffNotFranchise = asyncHandler(async (req, res) => {
    const staffId = Number(req.params.staffId);
    const userId = Number(req.user?.id);
    if (!staffId || !userId) {
        throw new BetterError('Invalid staffId or userId', 400, 'BAD_REQUEST', 'User Error');
    }
    const franchise = await prisma.franchise.findMany({
        where: {
            userId: userId,
            franchise_staff: {
                none: {
                    staffId: staffId,
                    isActive: true,
                },
            },
        },
    });
    res.status(200).json(franchise);
});
