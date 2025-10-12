import path from 'node:path';
import express from 'express';
import multer from 'multer';
import PopularDish from '../controllers/menu/PopularDish.js';
import AddCategory from '../controllers/restaurants/Categories.js';
import DeleteRestro from '../controllers/restaurants/DeleteRestaurants.js';
import { GetPer, GetRestro, } from '../controllers/restaurants/GetRestaurants.js';
import { MerchantGetMenus, MerchantGetRestro, } from '../controllers/restaurants/Merchant.js';
import PostResta from '../controllers/restaurants/PostRestaurants.js';
import UpdateRestro from '../controllers/restaurants/UpdateRestaurants.js';
import AllowRoles from '../middleware/AllowRoles.js';
import authorize from '../middleware/authorize.js';
import OwnerAdminAcess from '../middleware/OwnerAdminAcess.js';
const router = express.Router();
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', 'images'));
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
router.post('/', authorize, AllowRoles(2, 3), upload.single('image'), PostResta);
router.get('/', GetRestro);
router.get('/:restaurantId', GetPer);
router.delete('/:restaurantId', authorize, OwnerAdminAcess, DeleteRestro);
router.patch('/:restaurantId', authorize, OwnerAdminAcess, UpdateRestro);
router.get('/dish/:menuName', PopularDish);
router.get('/merchant/restaurant', authorize, MerchantGetRestro);
router.get('/merchant/restaurant/:restaurantId', authorize, MerchantGetMenus);
router.get('/merchant/categories', authorize, AddCategory);
export default router;
