import express from 'express';
const router = express.Router();
const {
  AllCountryFetch,
  AllStatesCountry,
  AllCityStates,
} = require('../controllers/address/AllCountry');

router.get('/countryAll', AllCountryFetch);

router.get('/countryAll/:id', AllStatesCountry);

router.get('/countryAll/states/:stateId', AllCityStates);

module.exports = router;
