import asyncHandler from "express-async-handler";
import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
const AddCategory = asyncHandler(async (_req, res) => {
    const GetCategory = await prisma.menu_categories.findMany({});
    if (!GetCategory) {
        const error = new Error("server error");
        error.statusCode = 500;
        throw error;
    }
    res.status(201).json(GetCategory);
});
export default AddCategory;
