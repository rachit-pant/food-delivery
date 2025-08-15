import express from 'express';
const router = express.Router({ mergeParams: true });
const authorize = require('../middleware/authorize');
const createOrderFromCart = require('../controllers/orders/PostOrders');
const AllOrders = require('../controllers/orders/GetOrders');
const getSpecOrders = require('../controllers/orders/GetSpeOrders');
const deleteOrders = require('../controllers/orders/DeleteOrders');

router.post('/', authorize, createOrderFromCart);
router.get('/', authorize, AllOrders);

router.get('/:orderId', authorize, getSpecOrders);

router.delete('/:orderId', authorize, deleteOrders);

module.exports = router;
