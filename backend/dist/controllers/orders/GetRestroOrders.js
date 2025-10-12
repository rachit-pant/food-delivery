import asyncHandler from 'express-async-handler';
import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';
const getRestroOrders = asyncHandler(async (req, res) => {
    const restroId = Number(req.params.restaurantId);
    const franchiseId = Number(req.query.franchiseId);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    if (franchiseId && franchiseId === 0) {
        throw new BetterError('Franchise ID is required', 400, 'FRANCHISE_ID_REQUIRED', 'Franchise Error');
    }
    if (!restroId) {
        throw new BetterError('Restaurant not found', 404, 'RESTAURANT_NOT_FOUND', 'Restaurant Error');
    }
    const totalOrders = await prisma.orders.count({
        where: {
            restaurant_id: restroId,
            restaurants: {
                franchiseId,
            },
            status: 'preparing',
            NOT: { status: 'cancelled' },
        },
    });
    const getOrders = await prisma.orders.findMany({
        where: {
            restaurant_id: restroId,
            restaurants: {
                franchiseId,
            },
            status: 'preparing',
            NOT: {
                status: 'cancelled',
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip,
        take: limit,
        select: {
            id: true,
            createdAt: true,
            total_amount: true,
            discount_amount: true,
            delivery_charges: true,
            net_amount: true,
            payment_status: true,
            status: true,
            restaurants: {
                select: {
                    name: true,
                    imageurl: true,
                },
            },
            order_addresses: {
                select: {
                    address: true,
                    cities: {
                        select: {
                            city_name: true,
                        },
                    },
                },
            },
            order_items: {
                select: {
                    product_name: true,
                    price: true,
                    quantity: true,
                    menus: {
                        select: {
                            image_url: true,
                        },
                    },
                    menu_variants: {
                        select: {
                            variety_name: true,
                        },
                    },
                },
            },
            order_payments: {
                select: {
                    payment_mode: true,
                    payment_status: true,
                },
            },
        },
    });
    const formattedOrders = getOrders.map((order) => ({
        orderId: order.id,
        placedAt: order.createdAt,
        status: order.status,
        amounts: {
            subtotal: order.total_amount,
            discount: order.discount_amount,
            delivery: order.delivery_charges,
            total: order.net_amount,
        },
        payment: {
            mode: order.order_payments[0]?.payment_mode || null,
            status: order.order_payments[0]?.payment_status || null,
        },
        restaurant: {
            name: order.restaurants?.name || '',
            image: order.restaurants?.imageurl || '',
        },
        deliveryAddress: {
            street: order.order_addresses?.address || '',
            city: order.order_addresses?.cities?.city_name || '',
        },
        items: order.order_items.map((item) => ({
            name: item.product_name,
            variant: item.menu_variants?.variety_name || '',
            price: item.price,
            quantity: item.quantity,
            image: item.menus?.image_url || '',
        })),
    }));
    res.status(200).json({
        orders: formattedOrders,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders,
            limit,
        },
    });
});
export default getRestroOrders;
