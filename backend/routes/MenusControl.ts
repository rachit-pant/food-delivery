import express from 'express';
const router = express.Router({ mergeParams: true });
const MenusAdd = require('../controllers/menu/PostMenus');
const OwnerAdminAcess = require('../middleware/OwnerAdminAcess');
const authorize = require('../middleware/authorize');
const GetMenus = require('../controllers/menu/GetMenus');
const DeleteMenus = require('../controllers/menu/DeleteMenus');
const PatchMenus = require('../controllers/menu/PatchMenus');
const {
  getItemsReviews,
  postItemReviews,
} = require('../controllers/functions/reviews');
router.post('/', authorize, OwnerAdminAcess, MenusAdd);
router.get('/', GetMenus);

router.patch('/:menuId', authorize, OwnerAdminAcess, PatchMenus);

router.delete('/:menuId', authorize, OwnerAdminAcess, DeleteMenus);

router.get('/reviews', authorize, getItemsReviews);

router.post('/reviews', authorize, postItemReviews);

module.exports = router;
