import path from 'node:path';
import express, { type Request } from 'express';
import multer from 'multer';
import addStaffInvites from '../controllers/franchise/addStaffInvites.js';
import createAlreadyCreatedStaff from '../controllers/franchise/createAlreadyCreatedStaff.js';
import { login, regUser } from '../controllers/franchise/createStaff.js';
import dashboard from '../controllers/franchise/dashboard.js';
import deleteFranchise from '../controllers/franchise/deleteFranchise.js';
import deleteFranchiseStaff from '../controllers/franchise/deleteFranchiseStaff.js';
import deleteRestro from '../controllers/franchise/deleteRestroFranchise.js';
import {
  getStaff,
  StaffNotFranchise,
} from '../controllers/franchise/exisitngStaffFranchise.js';
import list from '../controllers/franchise/FranchiseRestoList.js';
import franchiseRoleinfo from '../controllers/franchise/franchiseRoleinfo.js';
import getAllStaff from '../controllers/franchise/getAllStaff.js';
import {
  getFranchise,
  getSelectedRestaurants,
} from '../controllers/franchise/getFranchise.js';
import getFranchiseOfStaff from '../controllers/franchise/getFranchiseOfStaff.js';
import getStaffRoles from '../controllers/franchise/getStaffRoles.js';
import getUserRole from '../controllers/franchise/getUserRole.js';
import postFranchise from '../controllers/franchise/postFranchise.js';
import updateRole from '../controllers/franchise/updateRole.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();
type MulterCallback = (error: Error | null, value: string) => void;
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: MulterCallback
  ) => {
    cb(null, path.join(__dirname, '..', 'images'));
  },
  filename: (_req: Request, file: Express.Multer.File, cb: MulterCallback) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
router.get('/getRestaurants', authorize, getSelectedRestaurants);
router.get('/', authorize, getFranchise);
router.post('/', authorize, upload.single('image'), postFranchise);
router.delete('/:restaurantId', authorize, deleteFranchise);
router.get('/list/:franchiseId', authorize, list);
router.delete('/list/:restaurantId/:franchiseId', authorize, deleteRestro);
router.get('/dashboard/:franchiseId', authorize, dashboard);
router.get('/getStaffRoles', authorize, getStaffRoles);
router.post('/addStaffInvites', authorize, addStaffInvites);
router.post('/franchiseRoleinfo', authorize, franchiseRoleinfo);
router.get('/getAllStaff', authorize, getAllStaff);
router.post('/login', login);
router.post('/register', regUser);
router.post('/updateRole', authorize, updateRole);
router.delete(
  '/deleteFranchiseStaff/:franchiseStaffId',
  authorize,
  deleteFranchiseStaff
);
router.get('/getStaff', authorize, getStaff);
router.get('/existingStaffFranchise/:staffId', authorize, StaffNotFranchise);
router.post('/createAlreadyCreatedStaff', authorize, createAlreadyCreatedStaff);
router.get('/getFranchiseOfStaff', authorize, getFranchiseOfStaff);
router.get('/getUserRole/:franchiseId', authorize, getUserRole);

export default router;
