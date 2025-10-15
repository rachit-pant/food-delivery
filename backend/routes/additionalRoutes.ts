import express from 'express';
import BillingPortalSession from '../controllers/subscription/billing.js';
import GetPlans from '../controllers/subscription/GetPlans.js';
import authorize from '../middleware/authorize.js';
import GetSubscription from '../controllers/subscription/getSuscription.js';

const router = express.Router();
router.get('/plans', authorize, GetPlans);
router.get('/billing', authorize, BillingPortalSession);
router.get('/userplan', authorize, GetSubscription);
export default router;
