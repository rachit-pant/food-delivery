import express from 'express';
const router = express.Router();
const GetPlans = require('../controllers/subscription/GetPlans');
const authorize = require('../middleware/authorize');
const BillingPortalSession = require('../controllers/subscription/billing');
router.get('/plans', authorize, GetPlans);
router.get('/billing', authorize, BillingPortalSession);
module.exports = router;
