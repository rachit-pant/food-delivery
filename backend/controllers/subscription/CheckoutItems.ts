import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import { BetterError } from '../../middleware/errorHandler.js';
import { z } from 'zod';

const CheckoutItems = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const schema = z.object({
      sessionId: z.string(),
    });
    const validation = schema.safeParse(req.query);
    if (!validation.success) {
      throw new BetterError(
        'no id found',
        404,
        'NO_ID_FOUND',
        'Subscription Error'
      );
    }
    const sessionId = validation.data.sessionId;
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['line_items'],
      });
      res.status(200).json({
        message: 'Session retrieved successfully',
        data: session,
      });
    } catch (_error) {
      throw new BetterError(
        'no session found',
        404,
        'NO_SESSION_FOUND',
        'Subscription Error'
      );
    }
  }
);

export default CheckoutItems;
