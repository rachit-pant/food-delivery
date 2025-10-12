import asyncHandler from 'express-async-handler';
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();
export const GetRestro = asyncHandler(async (req, res) => {
    const filter = req.query.filter;
    const country = req.query.country;
    if (!filter || filter === 'None') {
        if (country === '') {
            const allRes = await prisma.restaurants.findMany();
            res.status(200).json(allRes);
            return;
        }
        const allRes = await prisma.restaurants.findMany({
            where: {
                cities: {
                    states: {
                        countries: {
                            country_name: country,
                        },
                    },
                },
            },
        });
        res.status(200).json(allRes);
        return;
    }
    const rating = Number(filter);
    if (country === '') {
        const allRes = await prisma.restaurants.findMany({
            where: {
                rating: {
                    gte: rating,
                },
            },
        });
        res.status(200).json(allRes);
        return;
    }
    const filteredRes = await prisma.restaurants.findMany({
        where: {
            rating: {
                gte: rating,
            },
            cities: {
                states: {
                    countries: {
                        country_name: country,
                    },
                },
            },
        },
    });
    res.status(200).json(filteredRes);
});
export const GetPer = asyncHandler(async (req, res) => {
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
        const error = new Error('no restro exists');
        error.statusCode = 400;
        throw error;
    }
    res.status(200).json(GetPer);
});
