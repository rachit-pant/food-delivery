jest.mock("../../prisma/client", () => ({
    user_addresses: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
}));
import createAddr from "../../controllers/user/createAddresses.js";
import prisma from "../../prisma/client.js";
function mockReqBody({ body = {}, params = {}, user = {} } = {}) {
    const req = {
        body,
        params,
        user,
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    const next = jest.fn();
    return { req, res, next };
}
describe("Create Addresses Unit", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Not find address", async () => {
        const address = "User Random";
        const city_id = "1234567890";
        prisma.user_addresses.findMany.mockRejectedValue(Object.assign(new Error("User not found"), {
            code: "USER_NOT_FOUND",
        }));
        const { req, res, next } = mockReqBody({
            body: {
                address,
                city_id,
            },
            user: {
                id: 1,
            },
        });
        await createAddr(req, res, next);
        expect(prisma.user_addresses.findMany).toHaveBeenCalledWith({
            where: {
                user_id: Number(req.user?.id),
            },
        });
        expect(prisma.user_addresses.create).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 500,
            message: "Address not created",
            code: "ADDRESS_NOT_CREATED",
            name: "User Error",
        }));
    });
    it("Not new address", async () => {
        const address = "User Random";
        const city_id = "1234567890";
        const addr = {
            id: 1,
            user_id: 1,
            address,
            city_id: Number(city_id),
            is_default: false,
        };
        prisma.user_addresses.findMany.mockResolvedValue([addr]);
        prisma.user_addresses.create.mockRejectedValue(Object.assign(new Error("Address not created"), {
            code: "ADDRESS_NOT_CREATED",
        }));
        const { req, res, next } = mockReqBody({
            body: {
                address,
                city_id,
            },
            user: {
                id: 1,
            },
        });
        await createAddr(req, res, next);
        expect(prisma.user_addresses.findMany).toHaveBeenCalledWith({
            where: {
                user_id: Number(req.user?.id),
            },
        });
        expect(prisma.user_addresses.create).toHaveBeenCalledWith({
            data: {
                user_id: Number(req.user?.id),
                address,
                city_id: Number(city_id),
                is_default: false,
            },
        });
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 500,
            message: "Address not created",
            code: "ADDRESS_NOT_CREATED",
            name: "User Error",
        }));
    });
    it("Created Address", async () => {
        const address = "User Random";
        const city_id = "1234567890";
        const addr = {
            id: 1,
            user_id: 1,
            address,
            city_id: Number(city_id),
            is_default: false,
        };
        prisma.user_addresses.findMany.mockResolvedValue([addr]);
        prisma.user_addresses.create.mockResolvedValue(addr);
        const { req, res, next } = mockReqBody({
            body: {
                address,
                city_id,
            },
            user: {
                id: 1,
            },
        });
        await createAddr(req, res, next);
        expect(prisma.user_addresses.findMany).toHaveBeenCalledWith({
            where: {
                user_id: Number(req.user?.id),
            },
        });
        expect(prisma.user_addresses.create).toHaveBeenCalledWith({
            data: {
                user_id: Number(req.user?.id),
                address,
                city_id: Number(city_id),
                is_default: false,
            },
        });
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Address created successfully",
            data: addr,
        });
    });
    it("First address becomes default", async () => {
        prisma.user_addresses.findMany.mockResolvedValue([]);
        prisma.user_addresses.create.mockResolvedValue({
            id: 1,
            user_id: 1,
            address: "First Address",
            city_id: 1,
            is_default: true,
        });
        const { req, res, next } = mockReqBody({
            body: { address: "First Address", city_id: 1 },
            user: { id: 1 },
        });
        await createAddr(req, res, next);
        expect(prisma.user_addresses.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({ is_default: true }),
        }));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: "Address created successfully",
            data: expect.objectContaining({ is_default: true }),
        }));
    });
});
