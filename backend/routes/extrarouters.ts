import express from 'express';
const router = express.Router();
const refreshToken = require('../controllers/functions/refreshtoken');
const SimilarCountry = require('../controllers/functions/getSimilarCountry');
const logout = require('../controllers/functions/logout');
const authorize = require('../middleware/authorize');
const createPaymentIntent = require('../controllers/functions/stripe');
router.get('/refreshToken', refreshToken);

router.post('/logout', authorize, logout);

router.post('/create-payment-intent', authorize, createPaymentIntent);

module.exports = router;
