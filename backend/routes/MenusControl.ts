import express from 'express';
const router = express.Router({ mergeParams: true });
const MenusAdd = require('../controllers/menu/PostMenus');
const OwnerAdminAcess = require('../middleware/OwnerAdminAcess');
const authorize = require('../middleware/authorize');
const staffIdentifier = require('../middleware/StaffIdentifier');
const GetMenus = require('../controllers/menu/GetMenus');
const DeleteMenus = require('../controllers/menu/DeleteMenus');
const PatchMenus = require('../controllers/menu/PatchMenus');
const multer = require('multer');
const diskStorage = require('multer').diskStorage;
const path = require('path');
const {
  getItemsReviews,
  postItemReviews,
  showReviews,
} = require('../controllers/functions/reviews');
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
  staffIdentifier,
  OwnerAdminAcess,
  upload.single('image'),
  MenusAdd
);
router.get('/', GetMenus);

router.patch(
  '/:menuId',
  authorize,
  staffIdentifier,
  OwnerAdminAcess,
  PatchMenus
);

router.delete(
  '/:menuId',
  authorize,
  staffIdentifier,
  OwnerAdminAcess,
  DeleteMenus
);

router.get('/reviews', authorize, getItemsReviews);

router.post('/reviews', authorize, postItemReviews);

router.get('/reviews/all', showReviews);

module.exports = router;
