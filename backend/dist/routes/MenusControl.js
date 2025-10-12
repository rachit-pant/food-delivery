import path from 'node:path';
import express from 'express';
import multer from 'multer';
import { getItemsReviews, postItemReviews, showReviews, } from '../controllers/functions/reviews.js';
import DeleteMenus from '../controllers/menu/DeleteMenus.js';
import GetMenus from '../controllers/menu/GetMenus.js';
import PatchMenus from '../controllers/menu/PatchMenus.js';
import MenusAdd from '../controllers/menu/PostMenus.js';
import authorize from '../middleware/authorize.js';
import OwnerAdminAcess from '../middleware/OwnerAdminAcess.js';
import staffIdentifier from '../middleware/StaffIdentifier.js';
const router = express.Router({ mergeParams: true });
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', 'images'));
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
router.post('/', authorize, staffIdentifier, OwnerAdminAcess, upload.single('image'), MenusAdd);
router.get('/', GetMenus);
router.patch('/:menuId', authorize, staffIdentifier, OwnerAdminAcess, PatchMenus);
router.delete('/:menuId', authorize, staffIdentifier, OwnerAdminAcess, DeleteMenus);
router.get('/reviews', authorize, getItemsReviews);
router.post('/reviews', authorize, postItemReviews);
router.get('/reviews/all', showReviews);
export default router;
