import express from 'express';
const router = express.Router();
const refreshToken = require('../controllers/functions/refreshtoken');
router.get('/refreshToken', refreshToken);

module.exports = router;
