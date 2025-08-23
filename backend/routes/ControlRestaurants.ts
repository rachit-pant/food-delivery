const express = require('express');
const multer = require('multer');
const diskStorage = require('multer').diskStorage;
const path = require('path');

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
const {
  MerchantGetRestro,
  MerchantGetMenus,
} = require('../controllers/restaurants/Merchant');
const AddCategory = require('../controllers/restaurants/Categories');
const storage = diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ) {
    cb(null, path.join(__dirname, '..', 'images'));
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Function) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  '/',
  authorize,
  AllowRoles(2, 3),
  upload.single('image'),
  PostResta
);

router.get('/', GetRestro);
router.get('/:restaurantId', GetPer);

router.delete('/:restaurantId', authorize, OwnerAdminAcess, DeleteRestro);

router.patch('/:restaurantId', authorize, OwnerAdminAcess, UpdateRestro);

router.get('/dish/:menuName', PopularDish);

router.get('/merchant/restaurant', authorize, MerchantGetRestro);
router.get('/merchant/restaurant/:restaurantId', authorize, MerchantGetMenus);

router.get('/merchant/categories', authorize, AddCategory);

module.exports = router;
export interface Timings {}
