import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../generated/prisma/index.js";
import { AccessToken, RefreshToken } from "../functions/jwt.js";
const prisma = new PrismaClient();
const refreshtoken = expressAsyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshtoken;
    if (!incomingRefreshToken) {
        const error = new Error("Refresh token missing, please login again");
        error.statusCode = 401;
        throw error;
    }
    let DecodedToken;
    try {
        DecodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_SECRET_KEY);
    }
    catch (_err) {
        const error = new Error("Invalid or expired refresh token");
        error.statusCode = 401;
        throw error;
    }
    const user = await prisma.users.findUnique({
        where: {
            id: DecodedToken.id,
        },
    });
    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    console.log(user.refreshToken);
    console.log(incomingRefreshToken);
    console.log("updated token");
    if (user.refreshToken !== incomingRefreshToken) {
        const error = new Error("Refresh token does not match, login again");
        error.statusCode = 403;
        throw error;
    }
    const acessKey = AccessToken(user);
    const refreshKey = RefreshToken(user);
    await prisma.users.update({
        where: {
            id: user.id,
        },
        data: {
            refreshToken: refreshKey,
        },
    });
    const settings = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };
    res.cookie("accesstoken", acessKey, settings);
    res.cookie("refreshtoken", refreshKey, settings);
    res.status(200).json({
        message: "Refresh successful",
    });
});
export default refreshtoken;
