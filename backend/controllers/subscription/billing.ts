import { Request, Response } from 'express';
import Stripe from 'stripe';
import expressAsyncHandler from 'express-async-handler';
import prisma from '../../prisma/client';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const { BetterError } = require('../../middleware/errorHandler');
const BillingPortalSession = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new BetterError(
        'No user ID found',
        404,
        'NO_USER_ID_FOUND',
        'Subscription Error'
      );
    }
    const subs_id = await prisma.sub.findMany({
      where: {
        user_id: userId,
        isDefault: true,
      },
    });
    if (!subs_id.length) {
      throw new BetterError(
        'No subscription ID found',
        404,
        'NO_SUBSCRIPTION_ID_FOUND',
        'Subscription Error'
      );
    }
    const subscription = await stripe.subscriptions.retrieve(
      subs_id[0].stripe_subscription_id as string
    );
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.customer as string,
      return_url: 'http://localhost:3000/subscription',
    });
    res.status(200).json({
      message: 'Billing portal session created successfully',
      data: session,
    });
  }
);
module.exports = BillingPortalSession;
