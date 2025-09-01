import { Request, Response } from 'express';
import Stripe from 'stripe';
import expressAsyncHandler from 'express-async-handler';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
import prisma from '../../prisma/client';
const { BetterError } = require('../../middleware/errorHandler');
const allowedPlans = [
  'price_1S2UE7FuZCtCjNMxpXi1IBpe',
  'price_1S2UHJFuZCtCjNMxX5aN10hH',
];
const PostSubscription = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { priceId } = req.body;
    const id = Number(req.user?.id);
    if (!id) {
      throw new BetterError(
        'no id found',
        404,
        'NO_ID_FOUND',
        'Subscription Error'
      );
    }
    if (!priceId || typeof priceId !== 'string') {
      throw new BetterError(
        'no id found',
        404,
        'NO_ID_FOUND',
        'Subscription Error'
      );
    }
    console.log(priceId);
    if (!allowedPlans.includes(priceId)) {
      throw new BetterError(
        'invalid id',
        404,
        'INVALID_ID',
        'Subscription Error'
      );
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      client_reference_id: id.toString(),
      success_url:
        'http://localhost:3000/subscription/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/subscription/cancel',
    });
    res.json({ url: session.url });
  }
);
module.exports = PostSubscription;
