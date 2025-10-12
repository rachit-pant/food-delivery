import express from "express";
import { AllCityStates, AllCountryFetch, AllStatesCountry, } from "../controllers/address/AllCountry.js";
const router = express.Router();
router.get("/countryAll", AllCountryFetch);
router.get("/countryAll/:id", AllStatesCountry);
router.get("/countryAll/states/:stateId", AllCityStates);
export default router;
