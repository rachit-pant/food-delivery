import { Request, Response } from 'express';
import Stripe from 'stripe';
import expressAsyncHandler from 'express-async-handler';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const createPaymentIntent = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
      });
      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

module.exports = createPaymentIntent;
