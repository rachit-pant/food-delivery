import express from 'express';
const router = express.Router();
const StripeWebhooks = require('../controllers/subscription/StripeWebhooks');
router.post('/webhooks', express.raw({ type: 'application/json' }), StripeWebhooks);
module.exports = router;
