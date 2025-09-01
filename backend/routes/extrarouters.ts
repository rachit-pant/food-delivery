import express from 'express';
const router = express.Router();
const refreshToken = require('../controllers/functions/refreshtoken');
const SimilarCountry = require('../controllers/functions/getSimilarCountry');
const logout = require('../controllers/functions/logout');
const authorize = require('../middleware/authorize');
const createPaymentIntent = require('../controllers/functions/stripe');
const search = require('../controllers/functions/search');
const PostSubscription = require('../controllers/subscription/PostSubscription');
const CheckoutItems = require('../controllers/subscription/CheckoutItems');
router.get('/refreshToken', refreshToken);

router.post('/logout', authorize, logout);

router.post('/create-payment-intent', authorize, createPaymentIntent);

router.get('/search', search);
router.post('/subscribe', authorize, PostSubscription);
router.get('/checkoutItemsView', authorize, CheckoutItems);
module.exports = router;
