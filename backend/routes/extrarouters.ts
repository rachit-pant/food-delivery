import express from 'express';
import cartCount from '../controllers/functions/cartCount.js';
import Dashboard from '../controllers/functions/dashboard.js';
import logout from '../controllers/functions/logout.js';
import refreshToken from '../controllers/functions/refreshtoken.js';
import search from '../controllers/functions/search.js';
import createPaymentIntent from '../controllers/functions/stripe.js';
import CheckoutItems from '../controllers/subscription/CheckoutItems.js';
import PostSubscription from '../controllers/subscription/PostSubscription.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();
router.get('/refreshToken', refreshToken);

router.post('/logout', authorize, logout);

router.post('/create-payment-intent', authorize, createPaymentIntent);

router.get('/search', search);
router.post('/subscribe', authorize, PostSubscription);
router.get('/checkoutItemsView', authorize, CheckoutItems);
router.get('/dashboard', authorize, Dashboard);
router.get('/cartCount', authorize, cartCount);

export default router;
