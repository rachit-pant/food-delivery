const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');
const AllowRoles = require('../middleware/AllowRoles');
const PostResta = require('../controllers/restaurants/PostRestaurants');
const {
  GetRestro,
  GetPer,
} = require('../controllers/restaurants/GetRestaurants');
const DeleteRestro = require('../controllers/restaurants/DeleteRestaurants');
const OwnerAdminAcess = require('../middleware/OwnerAdminAcess');
const UpdateRestro = require('../controllers/restaurants/UpdateRestaurants');
const PopularDish = require('../controllers/menu/PopularDish');
router.post('/', authorize, AllowRoles(2, 3), PostResta);

router.get('/', GetRestro);
router.get('/:restaurantId', GetPer);

router.delete('/:id', authorize, OwnerAdminAcess, DeleteRestro);

router.patch('/:id', authorize, OwnerAdminAcess, UpdateRestro);

router.get('/dish/:menuName', PopularDish);

module.exports = router;
