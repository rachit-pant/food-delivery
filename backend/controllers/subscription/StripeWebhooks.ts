import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Stripe from 'stripe';
const { BetterError } = require('../../middleware/errorHandler');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
import prisma from '../../prisma/client';
const StripeWebhooks = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;
  console.log(sig);
  console.log(process.env.STRIPE_WEBHOOK_SECRET!);
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
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
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;

      if (!session.subscription) {
        throw new BetterError(
          'No subscription ID found on checkout session.',
          404,
          'NO_SUBSCRIPTION_FOUND',
          'Subscription Error'
        );
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
      });
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
module.exports = StripeWebhooks;
