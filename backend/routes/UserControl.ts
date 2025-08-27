const express = require('express');
const router = express.Router();
const { getUsers, getUser } = require('../controllers/user/getUsers');
const { regUser, login } = require('../controllers/user/loginRegisterUser');
const authorize = require('../middleware/authorize');
const updateUser = require('../controllers/user/updateUser');
import { Request, response, Response } from 'express';
const UserAccess = require('../middleware/userAccess');
const DeleteUser = require('../controllers/user/deleteUser');
const UserAddr = require('../controllers/user/createAddresses');
const ReadAddress = require('../controllers/user/readAddresses');
const DeleteAddress = require('../controllers/user/deleteAddress');
const SendAddressHome = require('../controllers/user/SendeAddressesHome');
const SimilarCountry = require('../controllers/functions/getSimilarCountry');
const OrdersHistory = require('../controllers/orders/GetOrdersHistory');
const updateAddress = require('../controllers/user/updateAddresses');
router.post('/register', regUser);

router.get('/allUsers', authorize, getUsers);

router.post('/login', login);

router.get('/', authorize, getUser);

router.patch('/', authorize, updateUser);

router.delete('/:id', authorize, UserAccess, DeleteUser);

router.post('/address', authorize, UserAddr);

router.get('/address', authorize, ReadAddress);

router.delete('/address/:addressId', authorize, DeleteAddress);

router.get('/address/homepage', authorize, SendAddressHome);

router.get('/similarcountry/homepage', SimilarCountry);

router.get('/orders', authorize, OrdersHistory);

router.patch('/address/:addressId', authorize, updateAddress);

module.exports = router;
