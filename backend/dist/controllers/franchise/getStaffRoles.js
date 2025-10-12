import expressAsyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";
const getStaffRoles = expressAsyncHandler(async (_req, res) => {
    const roles = await prisma.staffRole.findMany({
        select: {
            id: true,
            role: true,
        },
    });
    res.status(200).json(roles);
});
export default getStaffRoles;
