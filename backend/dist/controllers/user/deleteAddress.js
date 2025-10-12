import asyncHandler from "express-async-handler";
import prisma from "../../prisma/client.js";
const DeleteAddress = asyncHandler(async (req, res) => {
    const id = Number(req.user?.id);
    const addressId = Number(req.params.addressId);
    if (!id || !addressId) {
        const error = new Error("no input given");
        error.statusCode = 400;
        throw error;
    }
    const address = await prisma.user_addresses.findFirst({
        where: {
            id: addressId,
            user_id: id,
        },
    });
    if (!address) {
        const error = new Error("no address found");
        error.statusCode = 404;
        throw error;
    }
    await prisma.user_addresses.delete({
        where: {
            id: addressId,
            user_id: id,
        },
    });
    if (address.is_default) {
        const another = await prisma.user_addresses.findFirst({
            where: {
                user_id: id,
            },
        });
        if (another) {
            await prisma.user_addresses.update({
                where: { id: another.id },
                data: { is_default: true },
            });
        }
    }
    res.status(200).json({
        message: "Address deleted successfully",
    });
});
export default DeleteAddress;
