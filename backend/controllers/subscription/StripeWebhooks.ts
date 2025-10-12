import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

import { BetterError } from '../../middleware/errorHandler.js';
import prisma from '../../prisma/client.js';

const StripeWebhooks = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;
  console.log(sig);

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (_error) {
    console.log(
      '111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111'
    );
    throw new BetterError(
      'webhook error',
      400,
      'WEBHOOK_ERROR',
      'Subscription Error'
    );
  }
  console.log(event);
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.subscription) {
        const userId = Number(session.client_reference_id);
        const restaurant_id = Number(session.metadata?.restaurant_id);
        const addressId = Number(session.metadata?.address_id);

        if (!userId || !restaurant_id || !addressId) {
          throw new BetterError(
            'user id or restaurant id or address id not found',
            400,
            'USER_ID_OR_RESTAURANT_ID_OR_ADDRESS_ID_NOT_FOUND',
            'Subscription Error'
          );
        }
        const ownerId = await prisma.restaurants.findUnique({
          where: {
            id: restaurant_id,
          },
        });
        let planId: { plan_id: number } | null = null;
        if (ownerId?.user_id) {
          planId = await prisma.sub.findFirst({
            where: {
              user_id: ownerId.user_id,
              isDefault: true,
            },
            select: {
              plan_id: true,
            },
          });
          console.log(planId);
        }
        const addressUser = await prisma.user_addresses.findUnique({
          where: {
            id: addressId,
          },
        });
        const cartItems = await prisma.carts.findMany({
          where: {
            user_id: userId,
          },
          include: {
            menu_variants: {
              select: {
                price: true,
              },
            },
            menus: {
              select: {
                item_name: true,
              },
            },
          },
        });
        if (!cartItems.length) {
          res.status(400).json({ message: 'Cart is empty' });
          return;
        }
        const subsId = await prisma.sub.findMany({
          where: {
            user_id: userId,
            isDefault: true,
          },
          select: {
            id: true,
          },
        });
        let total_amount = 0;
        let net_amount = 0;
        let delivery_charges = 0;
        if (subsId.length) {
          delivery_charges = 0;
          total_amount = (session.amount_total ?? 0) / 100;
          net_amount = (session.amount_total ?? 0) / 100;
        } else {
          delivery_charges = 50;
          total_amount = (session.amount_total ?? 0) / 100 - 50;
          net_amount = (session.amount_total ?? 0) / 100;
        }
        const newOrder = await prisma.orders.create({
          data: {
            user_id: userId,
            total_amount: total_amount,
            discount_amount: 0,
            delivery_charges: delivery_charges,
            tax_amount: 0,
            net_amount: net_amount,
            payment_status:
              session.payment_status === 'paid' ? 'paid' : 'not_paid',
            status: 'preparing',
            restaurant_id,
            order_items: {
              create: cartItems.map((item) => ({
                menu_id: item.menu_id,
                variant_id: item.variant_id,
                quantity: item.quantity,
                price: item.menu_variants?.price,
                total_amount:
                  (item.menu_variants?.price ?? 100) * item.quantity,
                product_name: item.menus?.item_name,
              })),
            },
            order_addresses: {
              create: {
                address_id: addressUser?.id,
                address: addressUser?.address,
                city_id: addressUser?.city_id,
              },
            },
            order_payments: {
              create: {
                amount: total_amount,
                payment_mode:
                  session.payment_method_types[0] === 'card'
                    ? 'Debit_Credit_Card'
                    : 'COD',
                payment_status:
                  session.payment_status === 'paid' ? 'paid' : 'not_paid',
              },
            },
          },
          include: {
            order_items: true,
          },
        });
        const premiumPlans = [9, 12];
        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const socketId: string[] | [] = onlineUsers.get(ownerId?.user_id) || [];
        if (planId && premiumPlans.includes(planId.plan_id)) {
          if (socketId.length > 0) {
            socketId.forEach((id) => {
              io.to(id).emit('newOrder', {
                orderId: newOrder.id,
                total: newOrder.net_amount,
                payments: newOrder.payment_status,
                items: newOrder.order_items,
                restaurant_name: ownerId?.name,
                restaurant_image: ownerId?.imageurl,
              });
            });
          }
        }

        await prisma.carts.deleteMany({ where: { user_id: userId } });
        res.status(201).json({
          message: 'Order placed successfully',
          order: newOrder,
        });
        break;
      }
      const subscription: Stripe.Subscription =
        await stripe.subscriptions.retrieve(session.subscription as string, {
          expand: ['items.data.price'],
        });
      const priceId = subscription.items.data[0].price.id;
      const plan = await prisma.plan.findUnique({
        where: {
          stripe_price_id: priceId,
        },
      });
      if (!plan) {
        throw new BetterError(
          'no plan found',
          404,
          'NO_PLAN_FOUND',
          'Subscription Error'
        );
      }
      const userId = Number(session.client_reference_id);

      await prisma.$transaction(async (tx: any) => {
        await tx.sub.updateMany({
          where: {
            user_id: userId,
            isDefault: true,
          },
          data: {
            isDefault: false,
          },
        });

        await tx.sub.upsert({
          where: {
            stripe_subscription_id: session.subscription as string,
          },
          update: {
            plan_id: plan.id,
            startDate: new Date(
              subscription.items.data[0].current_period_start * 1000
            ),
            endDate: new Date(
              subscription.items.data[0].current_period_end * 1000
            ),
            paymentStatus: session.payment_status === 'paid' ? 'paid' : 'open',
            price: (subscription.items.data[0].price.unit_amount || 0) / 100,
            isDefault: true,
          },
          create: {
            user_id: Number(session.client_reference_id),
            plan_id: plan.id,
            stripe_subscription_id: session.subscription as string,
            startDate: new Date(
              subscription.items.data[0].current_period_start * 1000
            ),
            endDate: new Date(
              subscription.items.data[0].current_period_end * 1000
            ),
            paymentStatus: session.payment_status === 'paid' ? 'paid' : 'open',
            price: (subscription.items.data[0].price.unit_amount || 0) / 100,
            isDefault: true,
          },
        });
      });
      res.status(200).json({
        message: 'Subscription created successfully',
      });
      break;
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customer = invoice.customer_email as string;
      const user = await prisma.users.findUnique({
        where: {
          email: customer,
        },
      });
      if (!user) {
        throw new BetterError(
          'User not found',
          404,
          'USER_NOT_FOUND',
          'Subscription Error'
        );
      }
      await prisma.sub.updateMany({
        where: {
          user_id: user.id,
          isDefault: true,
        },
        data: {
          endDate: new Date(invoice.period_end * 1000),
          paymentStatus: invoice.status || 'open',
          price: invoice.total / 100,
        },
      });
      res.status(200).json({
        message: 'Subscription updated successfully',
      });
      break;
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const customer = invoice.customer_email as string;
      const user = await prisma.users.findUnique({
        where: {
          email: customer,
        },
      });
      if (!user) {
        throw new BetterError(
          'User not found',
          404,
          'USER_NOT_FOUND',
          'Subscription Error'
        );
      }
      await prisma.sub.updateMany({
        where: {
          user_id: user.id,
          isDefault: true,
        },
        data: {
          paymentStatus: invoice.status || 'open',
        },
      });
      res.status(200).json({
        message: 'Subscription updated successfully',
      });
      break;
    }
    case 'customer.subscription.updated': {
      const customer = event.data.object as Stripe.Subscription;
      const planId = customer.items.data[0].price.id;
      const plan = await prisma.plan.findUnique({
        where: {
          stripe_price_id: planId,
        },
      });
      if (!plan) {
        throw new BetterError(
          'no plan found',
          404,
          'NO_PLAN_FOUND',
          'Subscription Error'
        );
      }
      await prisma.sub.updateMany({
        where: {
          stripe_subscription_id: customer.id,
          isDefault: true,
        },
        data: {
          plan_id: plan.id,
          price: (customer.items.data[0].price.unit_amount || 0) / 100,
        },
      }); //take a look later
      res.status(200).json({
        message: 'Subscription updated successfully',
      });
      break;
    }
    case 'customer.subscription.deleted': {
      const customer = event.data.object as Stripe.Subscription;
      await prisma.sub.updateMany({
        where: {
          stripe_subscription_id: customer.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
          status: 'canceled',
        },
      });
      res.status(200).json({
        message: 'Subscription deleted successfully',
      });
      break;
    }
    default:
      res.status(200).json({
        message: 'Event type not supported',
      });
      break;
  }
});

export default StripeWebhooks;
