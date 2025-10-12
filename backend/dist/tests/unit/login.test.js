jest.mock("../../prisma/client", () => ({
    users: {
        findUnique: jest.fn(),
        update: jest.fn(),
    },
}));
import prisma from "../../prisma/client.js";
jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));
import bcrypt from "bcrypt";
import { AccessToken, RefreshToken } from "../../controllers/functions/jwt.js";
import { login } from "../../controllers/user/loginRegisterUser.js";
jest.mock("../../controllers/functions/jwt", () => ({
    AccessToken: jest.fn(),
    RefreshToken: jest.fn(),
}));
function mockReqBody(body = {}) {
    const req = { body };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        cookie: jest.fn().mockReturnThis(),
        clearCookie: jest.fn().mockReturnThis(),
    };
    const next = jest.fn();
    return { req, res, next };
}
describe("loginController (unit)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("User not found 404 status", async () => {
        const email = "user@example.com";
        const password = "password123";
        const _user = {
            id: 1,
            full_name: "User",
            email,
            phone_number: "1234567890",
            password: "hashed-password",
            role_id: 1,
            refreshToken: "refreshToken",
        };
        prisma.users.findUnique.mockRejectedValue(Object.assign(new Error("User not found"), {
            code: "USER_NOT_FOUND",
        }));
        const { req, res, next } = mockReqBody({ email, password });
        await login(req, res, next);
        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email },
        });
        expect(bcrypt.compare).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: "User not found",
            code: "USER_NOT_FOUND",
            name: "User Error",
        }));
    });
    it("Invalid email or password 401 status", async () => {
        const email = "user@example.com";
        const password = "password123";
        const user = {
            id: 1,
            full_name: "User",
            email,
            phone_number: "1234567890",
            password: "hashed-password",
            role_id: 1,
            refreshToken: "refreshToken",
        };
        prisma.users.findUnique.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(false);
        const { req, res, next } = mockReqBody({ email, password });
        await login(req, res, next);
        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 401,
            message: "Invalid email or password",
            code: "BAD_REQUEST",
            name: "User Error",
        }));
    });
    it("perfect response 200 status", async () => {
        const email = "user@example.com";
        const password = "password123";
        const user = {
            id: 1,
            full_name: "User",
            email,
            phone_number: "1234567890",
            password: "hashed-password",
            role_id: 1,
            refreshToken: "refreshToken",
        };
        prisma.users.findUnique.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        AccessToken.mockReturnValue("accessToken");
        RefreshToken.mockReturnValue("refreshToken");
        prisma.users.update.mockResolvedValue(user);
        const { req, res, next } = mockReqBody({ email, password });
        await login(req, res, next);
        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
        expect(AccessToken).toHaveBeenCalledWith(user);
        expect(RefreshToken).toHaveBeenCalledWith(user);
        expect(prisma.users.update).toHaveBeenCalledWith({
            where: { id: user.id },
            data: { refreshToken: "refreshToken" },
        });
        expect(res.cookie).toHaveBeenCalledWith("accesstoken", "accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        expect(res.cookie).toHaveBeenCalledWith("refreshtoken", "refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            name: user.full_name,
            role: user.role_id,
            message: "Login successful",
        });
        expect(next).not.toHaveBeenCalled();
    });
    it("User not updated", async () => {
        const email = "user@example.com";
        const password = "password123";
        const user = {
            id: 1,
            full_name: "User",
            email,
            phone_number: "1234567890",
            password: "hashed-password",
            role_id: 1,
            refreshToken: "refreshToken",
        };
        prisma.users.findUnique.mockResolvedValue(user);
        bcrypt.compare.mockResolvedValue(true);
        AccessToken.mockReturnValue("accessToken");
        RefreshToken.mockReturnValue("refreshToken");
        prisma.users.update.mockRejectedValue(Object.assign(new Error("User not updated"), {
            code: "USER_NOT_UPDATED",
        }));
        const { req, res, next } = mockReqBody({ email, password });
        await login(req, res, next);
        expect(prisma.users.findUnique).toHaveBeenCalledWith({
            where: { email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
        expect(AccessToken).toHaveBeenCalledWith(user);
        expect(RefreshToken).toHaveBeenCalledWith(user);
        expect(prisma.users.update).toHaveBeenCalledWith({
            where: { id: user.id },
            data: { refreshToken: "refreshToken" },
        });
        expect(res.cookie).not.toHaveBeenCalledWith("accesstoken", "accessToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        expect(res.cookie).not.toHaveBeenCalledWith("refreshtoken", "refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });
        expect(next).toHaveBeenCalledWith(expect.objectContaining({
            statusCode: 404,
            message: "User not updated",
            code: "USER_NOT_UPDATED",
            name: "User Error",
        }));
    });
});
