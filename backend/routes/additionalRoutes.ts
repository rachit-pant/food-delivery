import express from 'express';
const router = express.Router();
const GetPlans = require('../controllers/subscription/GetPlans');
const authorize = require('../middleware/authorize');
router.get('/plans', authorize, GetPlans);

module.exports = router;
