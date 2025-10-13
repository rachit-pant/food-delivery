import express from "express";
import {
	AllCityStates,
	AllCountryFetch,
	AllStatesCountry,
} from "../controllers/address/AllCountry.js";
import getUserAddress from "../controllers/address/getUserAddress.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();
router.get("/countryAll", AllCountryFetch);

router.get("/countryAll/:id", AllStatesCountry);

router.get("/countryAll/states/:stateId", AllCityStates);
router.get("/address/user", authorize, getUserAddress);
export default router;
