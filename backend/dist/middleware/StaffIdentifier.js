import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { BetterError } from "../middleware/errorHandler.js";
const staffIdentifier = asyncHandler(async (req, _res, next) => {
    const token = req.cookies?.staffToken;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
            req.staff = decoded;
            next();
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                console.log("hello");
                throw new BetterError("Token expired", 401, "TOKEN_EXPIRED", "Token Error");
            }
            throw new BetterError("Invalid access token", 401, "INVALID_ACCESS_TOKEN", "Token Error");
        }
    }
    else {
        next();
    }
});
export default staffIdentifier;
