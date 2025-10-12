import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const PostCart = asyncHandler(async (req, res) => {
    const variantId = Number(req.body.variant);
    const quantity = Number(req.body.quantity);
    const variant = await prisma.menu_variants.findUnique({
        where: { id: variantId },
        select: {
            menu_id: true,
            menus: {
                select: {
                    restaurant_id: true,
                },
            },
        },
    });
    if (!variant) {
        throw new Error("Invalid variant");
    }
    const existingCart = await prisma.carts.findMany({
        where: {
            user_id: Number(req.user?.id),
        },
    });
    if (existingCart.length &&
        existingCart.some((item) => item.restaurant_id !== variant.menus?.restaurant_id)) {
        await prisma.carts.deleteMany({ where: { user_id: req.user?.id } });
    }
    const cart = await prisma.carts.findUnique({
        where: {
            user_id_menu_id_variant_id: {
                user_id: Number(req.user?.id),
                menu_id: Number(variant.menu_id),
                variant_id: variantId,
            },
        },
    });
    let cartItem;
    if (cart) {
        cartItem = await prisma.carts.update({
            where: {
                user_id_menu_id_variant_id: {
                    user_id: Number(req.user?.id),
                    menu_id: Number(variant.menu_id),
                    variant_id: variantId,
                },
            },
            data: {
                quantity: cart.quantity + (quantity || 1),
            },
            select: {
                user_id: true,
                quantity: true,
            },
        });
    }
    else {
        cartItem = await prisma.carts.create({
            data: {
                user_id: Number(req.user?.id),
                menu_id: Number(variant.menu_id),
                variant_id: variantId,
                quantity: quantity || 1,
                restaurant_id: Number(variant.menus?.restaurant_id),
            },
            select: {
                user_id: true,
                quantity: true,
            },
        });
    }
    res.status(200).json(cartItem);
});
export default PostCart;
