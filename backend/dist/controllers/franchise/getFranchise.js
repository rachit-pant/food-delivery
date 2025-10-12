import expressAsyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
export const getSelectedRestaurants = expressAsyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new BetterError('no user found', 400, 'NO_USER_FOUND', 'User Error');
    }
    const restaurants = await prisma.restaurants.findMany({
        where: {
            user_id: userId,
            franchiseId: null,
        },
        select: {
            id: true,
            name: true,
        },
    });
    res.status(200).json(restaurants);
});
export const getFranchise = expressAsyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new BetterError('no user found', 400, 'NO_USER_FOUND', 'User Error');
    }
    try {
        const franchise = await prisma.franchise.findMany({
            where: {
                userId,
            },
        });
        res.status(200).json(franchise);
    }
    catch (_error) {
        throw new BetterError('no franchise found', 400, 'NO_FRANCHISE_FOUND', 'Franchise Error');
    }
});
