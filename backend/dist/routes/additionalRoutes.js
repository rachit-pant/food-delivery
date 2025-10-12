import express from "express";
import BillingPortalSession from "../controllers/subscription/billing.js";
import GetPlans from "../controllers/subscription/GetPlans.js";
import authorize from "../middleware/authorize.js";
const router = express.Router();
router.get("/plans", authorize, GetPlans);
router.get("/billing", authorize, BillingPortalSession);
export default router;
