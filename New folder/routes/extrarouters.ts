import express from 'express';
const router = express.Router();
const refreshToken = require('../controllers/functions/refreshtoken');
const SimilarCountry = require('../controllers/functions/getSimilarCountry');
router.get('/refreshToken', refreshToken);

module.exports = router;
