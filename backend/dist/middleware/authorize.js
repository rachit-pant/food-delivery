import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
const authorize = asyncHandler(async (req, _res, next) => {
    const token = req.cookies?.accesstoken;
    if (!token) {
        const error = new Error("No access token provided");
        error.statusCode = 401;
        throw error;
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
        req.user = decoded;
        next();
    }
    catch (err) {
        if (err.name === "TokenExpiredError") {
            console.log("hello");
            const error = new Error("Token expired");
            error.statusCode = 401;
            throw error;
        }
        console.log("hello again");
        const error = new Error("Invalid token");
        error.statusCode = 401;
        throw error;
    }
});
export default authorize;
