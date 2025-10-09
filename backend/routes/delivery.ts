import express from 'express';
const router = express.Router();
const authorize = require('../middleware/authorize');
const getInfo = require('../controllers/delivery/getInfo');
const {
  updateStatus,
  getStatus,
} = require('../controllers/delivery/updateStatus');

router.get('/', authorize, getInfo);
router.patch('/updateStatus', authorize, updateStatus);
router.get('/status', authorize, getStatus);

module.exports = router;
