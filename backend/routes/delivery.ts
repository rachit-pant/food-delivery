import express from "express";
import getInfo from "../controllers/delivery/getInfo.js";
import {
	getStatus,
	updateStatus,
} from "../controllers/delivery/updateStatus.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();
router.get("/", authorize, getInfo);
router.patch("/updateStatus", authorize, updateStatus);
router.get("/status", authorize, getStatus);

export default router;
