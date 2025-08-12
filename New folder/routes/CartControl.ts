import express from "express";
const router = express.Router();
const authorize = require('../middleware/authorize');
const PostCart = require('../controllers/cart/PostCart');
const GetCart = require('../controllers/cart/GetCart');
const DeleteCart = require('../controllers/cart/DeleteCart');
const PatchCart = require('../controllers/cart/PatchCart');

router.post('/',authorize,PostCart);

router.get('/',authorize,GetCart);

router.delete('/:itemId',authorize,DeleteCart);

router.patch('/:itemId',authorize,PatchCart);

module.exports = router;