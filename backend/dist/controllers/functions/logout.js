import asyncHandler from "express-async-handler";
const logout = asyncHandler(async (_req, res) => {
    const settings = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };
    res.clearCookie("accesstoken", settings);
    res.clearCookie("refreshtoken", settings);
    res.clearCookie("staffToken", settings);
    res.status(200).json({
        msessage: "Logged out ",
    });
});
export default logout;
