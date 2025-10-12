import expressAsyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import { BetterError } from '../../middleware/errorHandler.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const allowedPlans = [
    'price_1S2qniFuZCtCjNMxyYhqD9Fj',
    'price_1S2qp5FuZCtCjNMx2iiBNqT3',
    'price_1S2UE7FuZCtCjNMxpXi1IBpe',
    'price_1S2qoGFuZCtCjNMxyo0vKeve',
    'price_1S2qpMFuZCtCjNMxtE38g6q8',
    'price_1S2UHJFuZCtCjNMxX5aN10hH',
    'price_1S2x3VFuZCtCjNMx8Lsnj1v8',
    'price_1S2x5lFuZCtCjNMx1eZcoZTD',
    'price_1S2x7OFuZCtCjNMxHBi6y5yo',
    'price_1S2x3zFuZCtCjNMxbp7fNit0',
    'price_1S2x6DFuZCtCjNMxYe4vHZl1',
    'price_1S2x7nFuZCtCjNMxOVbVB8Fc',
];
const PostSubscription = expressAsyncHandler(async (req, res) => {
    const { priceId } = req.body;
    console.log('priceId', priceId);
    const id = Number(req.user?.id);
    if (!id) {
        throw new BetterError('id not found', 404, 'NO_ID_FOUND', 'Subscription Error');
    }
    if (!priceId || typeof priceId !== 'string') {
        throw new BetterError('priceId not found', 404, 'PRICE_ID_NOT_FOUND', 'Subscription Error');
    }
    console.log(priceId);
    if (!allowedPlans.includes(priceId)) {
        throw new BetterError('invalid id', 404, 'INVALID_ID', 'Subscription Error');
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
        success_url: 'http://localhost:3000/subscription/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'http://localhost:3000/subscription/cancel',
    });
    res.json({ url: session.url });
});
export default PostSubscription;
