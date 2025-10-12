import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
import { BetterError } from '../../middleware/errorHandler.js';
const prisma = new PrismaClient();
export const getUsers = asyncHandler(async (_req, res) => {
    const user = await prisma.users.findMany();
    res.status(200).json(user);
});
export const getUser = asyncHandler(async (req, res) => {
    const Id = Number(req.user?.id);
    if (!Id) {
        throw new BetterError('Wrong id', 404, 'WRONG_ID', 'User Error');
    }
    const reqUser = await prisma.users.findUnique({
        where: {
            id: Id,
        },
        select: {
            full_name: true,
            email: true,
            user_roles: {
                select: {
                    role_name: true,
                },
            },
        },
    });
    if (!reqUser) {
        throw new BetterError('User not found', 404, 'USER_NOT_FOUND', 'User Error');
    }
    res.status(200).json(reqUser);
});
