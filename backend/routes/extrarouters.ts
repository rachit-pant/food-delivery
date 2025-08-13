import express from 'express';
const router = express.Router();
const refreshToken = require('../controllers/functions/refreshtoken');
const SimilarCountry = require('../controllers/functions/getSimilarCountry');
const logout = require('../controllers/functions/logout');
const authorize = require('../middleware/authorize');
router.get('/refreshToken', refreshToken);

router.post('/logout', authorize, logout);

module.exports = router;
