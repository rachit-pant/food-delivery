import express from 'express';
const multer = require('multer');
const diskStorage = require('multer').diskStorage;
const path = require('path');
const router = express.Router();
const {
  getSelectedRestaurants,
  getFranchise,
} = require('../controllers/franchise/getFranchise');
const list = require('../controllers/franchise/FranchiseRestoList');
const authorize = require('../middleware/authorize');
const postFranchise = require('../controllers/franchise/postFranchise');
const deleteFranchise = require('../controllers/franchise/deleteFranchise');
const deleteRestro = require('../controllers/franchise/deleteRestroFranchise');
const dashboard = require('../controllers/franchise/dashboard');
const getStaffRoles = require('../controllers/franchise/getStaffRoles');
const addStaffInvites = require('../controllers/franchise/addStaffInvites');
const franchiseRoleinfo = require('../controllers/franchise/franchiseRoleinfo');
const getAllStaff = require('../controllers/franchise/getAllStaff');
const { login, regUser } = require('../controllers/franchise/createStaff');
const updateRole = require('../controllers/franchise/updateRole');
const deleteFranchiseStaff = require('../controllers/franchise/deleteFranchiseStaff');
const {
  getStaff,
  StaffNotFranchise,
} = require('../controllers/franchise/exisitngStaffFranchise');
const createAlreadyCreatedStaff = require('../controllers/franchise/createAlreadyCreatedStaff');
const getFranchiseOfStaff = require('../controllers/franchise/getFranchiseOfStaff');
const getUserRole = require('../controllers/franchise/getUserRole');
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
module.exports = router;
