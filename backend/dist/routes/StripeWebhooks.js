import express from "express";
import StripeWebhooks from "../controllers/subscription/StripeWebhooks.js";
const router = express.Router();
router.post("/webhooks", express.raw({ type: "application/json" }), StripeWebhooks);
export default router;
