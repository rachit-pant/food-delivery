import { Request, Response } from 'express';
import Stripe from 'stripe';
import expressAsyncHandler from 'express-async-handler';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

const createPaymentIntent = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const cart = await prisma.carts.findMany({
        where: {
          user_id: req.user?.id,
        },
        select: {
          id: true,
          quantity: true,
          restaurant_id: true,
          menus: {
            select: {
              item_name: true,
              image_url: true,
            },
          },
          menu_variants: {
            select: {
              variety_name: true,
              price: true,
            },
          },
        },
      });

      if (!cart || cart.length === 0) {
        res.status(400).json({ error: 'Cart is empty' });
        return;
      }

      const lineItems = cart.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.menus?.item_name} (${item.menu_variants?.variety_name})`,
          },
          unit_amount: Math.round((item.menu_variants?.price || 0) * 100), // cents
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: lineItems,
        success_url: 'http://localhost:3000/cart/success',
        cancel_url: 'http://localhost:3000/cart/failure',
      });

      res.json({ url: session.url });
      return;
    } catch (error: any) {
      console.error('Stripe Checkout Error:', error.message);
      res.status(500).json({ error: error.message });
      return;
    }
  }
);

module.exports = createPaymentIntent;
