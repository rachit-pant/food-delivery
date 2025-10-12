import asyncHandler from "express-async-handler";
const UserAccess = asyncHandler(async (req, _res, next) => {
    const id = Number(req.params.id);
    if (id !== req.user?.id) {
        const error = new Error("wrong login");
        error.statusCode = 400;
        throw error;
    }
    next();
});
export default UserAccess;
