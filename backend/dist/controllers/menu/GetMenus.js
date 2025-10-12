import asyncHandler from 'express-async-handler';
import _ from 'lodash';
const { groupBy } = _;
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();
const GetMenus = asyncHandler(async (req, res) => {
    const restaurant_id = Number(req.params.restaurantId);
    const GetMenus = await prisma.menus.findMany({
        where: {
            restaurant_id,
        },
        include: {
            menu_categories: true,
            menu_variants: true,
        },
    });
    if (!GetMenus) {
        const error = new Error('no mennus found');
        error.statusCode = 400;
        throw error;
    }
    const groupedMenus = groupBy(GetMenus, (Menus) => Menus.menu_categories?.cat_name);
    res.status(200).json(groupedMenus);
});
export default GetMenus;
