import express from "express";
import getUserAddress from "../controllers/address/getUserAddress.js";
import SimilarCountry from "../controllers/functions/getSimilarCountry.js";
import OrdersHistory from "../controllers/orders/GetOrdersHistory.js";
import UserAddr from "../controllers/user/createAddresses.js";
import DeleteAddress from "../controllers/user/deleteAddress.js";
import DeleteUser from "../controllers/user/deleteUser.js";
import { getUser, getUsers } from "../controllers/user/getUsers.js";
import { login, regUser } from "../controllers/user/loginRegisterUser.js";
import ReadAddress from "../controllers/user/readAddresses.js";
import SendAddressHome from "../controllers/user/SendeAddressesHome.js";
import updateAddress from "../controllers/user/updateAddresses.js";
import updateUser from "../controllers/user/updateUser.js";
import authorize from "../middleware/authorize.js";
import UserAccess from "../middleware/userAccess.js";

const router = express.Router();
router.post("/register", regUser);

router.get("/allUsers", authorize, getUsers);

router.post("/login", login);

router.get("/", authorize, getUser);

router.patch("/", authorize, updateUser);

router.delete("/:id", authorize, UserAccess, DeleteUser);

router.post("/address", authorize, UserAddr);

router.get("/address", authorize, ReadAddress);

router.delete("/address/:addressId", authorize, DeleteAddress);

router.get("/address/homepage", authorize, SendAddressHome);

router.get("/similarcountry/homepage", SimilarCountry);

router.get("/orders", authorize, OrdersHistory);

router.patch("/address/:addressId", authorize, updateAddress);

export default router;
