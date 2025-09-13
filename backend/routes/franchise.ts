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
module.exports = router;
